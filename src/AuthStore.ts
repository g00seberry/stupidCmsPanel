import { login, logout as logoutRequest } from '@/api/auth';
import type { LogoutOptions, ZAuthUser, ZLoginDto } from '@/types/auth';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/**
 * Состояние авторизации администратора и операции входа/выхода.
 */
export class AuthStore {
  pending = false;
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
   * Сохраняет информацию о текущем пользователе.
   * @param user Данные пользователя или `null` для сброса.
   */
  setUser(user: ZAuthUser | null) {
    this.user = user;
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

    try {
      const resp = await login(dto);
      this.setUser(resp.user);
      return true;
    } catch (error) {
      onError(error, {
        message: 'Ошибка входа',
      });
      return false;
    } finally {
      this.setPending(false);
    }
  }

  /**
   * Выполняет выход текущего пользователя.
   * @param options Дополнительные параметры завершения сессий.
   */
  async logout(options: LogoutOptions = {}): Promise<void> {
    try {
      await logoutRequest(options);
    } finally {
      this.setUser(null);
    }
  }
}
/**
 * Экземпляр стора авторизации для повторного использования.
 */
export const authStore = new AuthStore();
