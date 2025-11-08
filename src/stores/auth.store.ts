import { makeAutoObservable, runInAction } from 'mobx';
import { http, type HttpError } from '@/api/http';

type LoginDto = {
  email: string;
  password: string;
  remember?: boolean;
};
type LoginField = 'email' | 'password';

export class AuthStore {
  isAuthenticated = false;
  pending = false;
  error: string | null = null;
  returnTo: string | null = null;
  fieldErrors: Partial<Record<LoginField, string>> = {};

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setReturnTo(path: string | null) {
    this.returnTo = path;
  }

  resetError() {
    this.error = null;
    this.fieldErrors = {};
  }

  async login(dto: LoginDto): Promise<boolean> {
    this.pending = true;
    this.error = null;
    this.fieldErrors = {};

    try {
      await this.performLogin(dto);
      runInAction(() => {
        this.isAuthenticated = true;
      });
      return true;
    } catch (error) {
      this.assignErrorMessage(error);
      return false;
    } finally {
      runInAction(() => {
        this.pending = false;
      });
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      runInAction(() => {
        this.isAuthenticated = false;
        this.returnTo = null;
        this.error = null;
      });
    }
  }

  private async performLogin(dto: LoginDto, { retriedCsrf = false } = {}): Promise<void> {
    try {
      await http<unknown>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(dto),
      });
    } catch (error) {
      if (!retriedCsrf && isHttpError(error) && (error.status === 419 || error.status === 403)) {
        await this.obtainCsrfCookie();
        await this.performLogin(dto, { retriedCsrf: true });
        return;
      }
      throw error;
    }
  }

  private async obtainCsrfCookie(): Promise<void> {
    await fetch('/api/v1/auth/csrf', {
      method: 'GET',
      credentials: 'include',
    });
  }

  private assignErrorMessage(error: unknown): void {
    if (!isHttpError(error)) {
      runInAction(() => {
        this.error = 'Ошибка входа';
      });
      return;
    }

    if (error.status === 401) {
      runInAction(() => {
        this.error = 'Неверный email или пароль';
        this.fieldErrors = {};
      });
      return;
    }

    const problemErrors = error.problem?.errors;
    const mappedFieldErrors = mapProblemErrors(problemErrors);
    const hasFieldErrors = Object.keys(mappedFieldErrors).length > 0;
    const problemTitle = error.problem?.title;

    runInAction(() => {
      this.fieldErrors = mappedFieldErrors;
      this.error = hasFieldErrors ? null : (problemTitle ?? 'Ошибка входа');
    });
  }
}

function isHttpError(error: unknown): error is HttpError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

function mapProblemErrors(
  errors: Record<string, string[]> | undefined
): Partial<Record<LoginField, string>> {
  if (!errors) return {};

  return (['email', 'password'] satisfies LoginField[]).reduce<Partial<Record<LoginField, string>>>(
    (acc, field) => {
      const message = errors[field]?.at(0);
      if (message) {
        acc[field] = message;
      }
      return acc;
    },
    {}
  );
}

export const authStore = new AuthStore();
