import { makeAutoObservable } from 'mobx';
import { login, logout as logoutRequest } from '@/api/auth';
import type { ZAuthUser, ZLoginDto, ZLoginField } from '@/types/auth';
import { zLoginField } from '@/types/auth';
import type { ZProblemJson } from '@/types/ProblemJson';
import { onError } from '@/utils/on-error';
import { isHttpError } from '@/utils/http-error';

/**
 * Состояние авторизации администратора и операции входа/выхода.
 */
export class AuthStore {
  pending = false;
  error: string | null = null;
  fieldErrors: Partial<Record<ZLoginField, string>> = {};
  user: ZAuthUser | null = null;

  /**
   * Создаёт экземпляр MobX-стора авторизации.
   */
  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Устанавливает флаг выполнения запроса авторизации.
   * @param value Новое значение флага ожидания.
   */
  setPending(value: boolean) {
    this.pending = value;
  }

  /**
   * Сохраняет общее сообщение об ошибке авторизации.
   * @param message Текст ошибки или `null` для сброса.
   */
  setError(message: string | null) {
    this.error = message;
  }

  /**
   * Сохраняет ошибки валидации по полям формы авторизации.
   * @param errors Словарь ошибок по полям.
   */
  setFieldErrors(errors: Partial<Record<ZLoginField, string>>) {
    this.fieldErrors = errors;
  }

  /**
   * Сохраняет информацию о текущем пользователе.
   * @param user Данные пользователя или `null` для сброса.
   */
  setUser(user: ZAuthUser | null) {
    this.user = user;
  }

  /**
   * Сбрасывает общее сообщение и ошибки полей.
   */
  resetError() {
    this.setError(null);
    this.setFieldErrors({});
  }

  /**
   * Признак активной авторизации пользователя.
   */
  get isAuthenticated(): boolean {
    return this.user !== null;
  }

  /**
   * Выполняет попытку входа и обновляет состояние в зависимости от результата.
   * @param dto Данные формы входа.
   * @returns `true`, если вход выполнен успешно.
   */
  async login(dto: ZLoginDto): Promise<boolean> {
    this.setPending(true);
    this.resetError();

    try {
      const resp = await login(dto);
      this.setUser(resp.user);
      return true;
    } catch (error) {
      const message = this.assignErrorMessage(error);
      if (message) {
        onError(error, { message });
      }
      return false;
    } finally {
      this.setPending(false);
    }
  }

  /**
   * Выполняет выход текущего пользователя.
   * @param options Дополнительные параметры завершения сессий.
   */
  async logout(options: { all?: boolean } = {}): Promise<void> {
    try {
      await logoutRequest(options);
    } finally {
      this.setError(null);
      this.setUser(null);
    }
  }

  /**
   * Определяет сообщение об ошибке авторизации и обновляет состояние.
   * @param error Ошибка, возникшая во время входа.
   * @returns Сообщение об ошибке или `null`, если необходимо показать ошибки полей.
   */
  private assignErrorMessage(error: unknown): string | null {
    if (!isHttpError(error)) {
      const message = 'Ошибка входа';
      this.setError(message);
      return message;
    }

    if (error.status === 401) {
      const message = 'Неверный email или пароль';
      this.setError(message);
      this.setFieldErrors({});
      return message;
    }

    const problemErrors = error.problem?.errors;
    const mappedFieldErrors = mapProblemErrors(problemErrors);
    const hasFieldErrors = Object.keys(mappedFieldErrors).length > 0;
    const problemTitle = error.problem?.title;

    this.setFieldErrors(mappedFieldErrors);
    const message = hasFieldErrors ? null : (problemTitle ?? 'Ошибка входа');
    this.setError(message);
    return message;
  }
}

/**
 * Преобразует ошибки формата Problem JSON в ошибки формы авторизации.
 * @param errors Исходные ошибки, полученные от API.
 * @returns Словарь ошибок по полям формы.
 */
const mapProblemErrors = (errors: ZProblemJson['errors']): Partial<Record<ZLoginField, string>> => {
  if (!errors) return {};

  return zLoginField.options.reduce<Partial<Record<ZLoginField, string>>>((acc, field) => {
    const message = errors[field]?.at(0);
    if (message) {
      acc[field] = message;
    }
    return acc;
  }, {});
};

/**
 * Экземпляр стора авторизации для повторного использования.
 */
export const authStore = new AuthStore();
