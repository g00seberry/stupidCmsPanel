import type { LogoutOptions, ZAuthUser, ZLoginDto } from '@/types/auth';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';
import { getCurrentUser, login, logout } from './api/apiAuth';

/**
 * Состояние авторизации администратора и операции входа/выхода.
 */
export class AuthStore {
  relogin = false;
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
   * Устанавливает флаг выполнения запроса релогина.
   * @param value Новое значение флага.
   */
  setRelogin(value: boolean) {
    this.relogin = value;
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
   * Инициализирует состояние авторизации.
   */
  async init() {
    this.setRelogin(true);
    this.setPending(true);
    try {
      const resp = await getCurrentUser();

      this.setUser(resp);
    } catch (error) {
      this.setUser(null);
      onError(error);
    } finally {
      this.setPending(false);
      this.setRelogin(false);
    }
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
      onError(error);
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
      await logout(options);
    } finally {
      this.setUser(null);
    }
  }
}
/**
 * Экземпляр стора авторизации для повторного использования.
 */
export const authStore = new AuthStore();
