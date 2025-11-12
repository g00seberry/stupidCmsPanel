import { z } from 'zod';

/**
 * Схема валидации данных для входа пользователя.
 * @example
 * const loginData: ZLoginDto = {
 *   email: 'admin@example.com',
 *   password: 'securePassword123'
 * };
 */
export const zLoginDto = z.object({
  /** Email пользователя. Должен быть валидным email адресом. */
  email: z
    .email({ message: 'Некорректный email' })
    .min(1, { message: 'Email обязателен' })
    .max(255, { message: 'Email не должен превышать 255 символов' }),
  /** Пароль пользователя. Минимум 8 символов. */
  password: z
    .string()
    .min(8, { message: 'Пароль должен содержать минимум 8 символов' })
    .max(255, { message: 'Пароль не должен превышать 255 символов' }),
});
/**
 * DTO для запроса авторизации.
 * Содержит email и пароль пользователя для входа в систему.
 */
export type ZLoginDto = z.infer<typeof zLoginDto>;

/**
 * Схема валидации данных пользователя, возвращаемых API.
 * @example
 * const user: ZAuthUser = {
 *   id: 1,
 *   email: 'admin@example.com',
 *   name: 'Администратор'
 * };
 */
export const zAuthUser = z.object({
  /** Уникальный идентификатор пользователя. */
  id: z.number(),
  /** Email адрес пользователя. */
  email: z.email(),
  /** Отображаемое имя пользователя. */
  name: z.string(),
});
/**
 * Тип пользователя, получаемый после успешной авторизации.
 * Используется для хранения информации о текущем пользователе в сторе.
 */
export type ZAuthUser = z.infer<typeof zAuthUser>;

/**
 * Ответ API при успешном входе пользователя.
 */
export const zLoginResponse = z.object({
  user: zAuthUser,
});
/**
 * Тип ответа на запрос авторизации.
 */
export type ZLoginResponse = z.infer<typeof zLoginResponse>;

/**
 * Параметры завершения пользовательской сессии.
 * @example
 * // Выйти из текущей сессии
 * await logout();
 *
 * // Выйти из всех сессий
 * await logout({ all: true });
 */
export interface LogoutOptions {
  /**
   * Если `true`, завершает все активные сессии пользователя на всех устройствах.
   * По умолчанию `false` - завершается только текущая сессия.
   */
  all?: boolean;
}
