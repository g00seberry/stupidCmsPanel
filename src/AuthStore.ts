import { makeAutoObservable } from 'mobx';
import { logout as logoutRequest } from '@/api/auth';
import { loginWithCsrfRetry } from '@/services/auth';
import { zLoginField } from '@/types/auth';
import type { ZAuthUser, ZLoginDto, ZLoginField } from '@/types/auth';
import type { ZProblemJson } from '@/types/ProblemJson';
import { isHttpError } from '@/utils/http-error';

export class AuthStore {
  isAuthenticated = false;
  pending = false;
  error: string | null = null;
  fieldErrors: Partial<Record<ZLoginField, string>> = {};
  user: ZAuthUser | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPending(value: boolean) {
    this.pending = value;
  }

  setAuthenticated(value: boolean) {
    this.isAuthenticated = value;
  }

  setError(message: string | null) {
    this.error = message;
  }

  setFieldErrors(errors: Partial<Record<ZLoginField, string>>) {
    this.fieldErrors = errors;
  }

  setUser(user: ZAuthUser | null) {
    this.user = user;
  }

  resetError() {
    this.setError(null);
    this.setFieldErrors({});
  }

  async login(dto: ZLoginDto): Promise<boolean> {
    this.setPending(true);
    this.resetError();

    try {
      const { user } = await loginWithCsrfRetry(dto);
      this.setUser(user);
      this.setAuthenticated(true);
      return true;
    } catch (error) {
      this.assignErrorMessage(error);
      return false;
    } finally {
      this.setPending(false);
    }
  }

  async logout(options: { all?: boolean } = {}): Promise<void> {
    try {
      await logoutRequest(options);
    } finally {
      this.setAuthenticated(false);
      this.setError(null);
      this.setUser(null);
    }
  }

  private assignErrorMessage(error: unknown): void {
    if (!isHttpError(error)) {
      this.setError('Ошибка входа');
      return;
    }

    if (error.status === 401) {
      this.setError('Неверный email или пароль');
      this.setFieldErrors({});
      return;
    }

    const problemErrors = error.problem?.errors;
    const mappedFieldErrors = mapProblemErrors(problemErrors);
    const hasFieldErrors = Object.keys(mappedFieldErrors).length > 0;
    const problemTitle = error.problem?.title;

    this.setFieldErrors(mappedFieldErrors);
    this.setError(hasFieldErrors ? null : (problemTitle ?? 'Ошибка входа'));
  }
}

function mapProblemErrors(errors: ZProblemJson['errors']): Partial<Record<ZLoginField, string>> {
  if (!errors) return {};

  return zLoginField.options.reduce<Partial<Record<ZLoginField, string>>>((acc, field) => {
    const message = errors[field]?.at(0);
    if (message) {
      acc[field] = message;
    }
    return acc;
  }, {});
}

export const authStore = new AuthStore();
