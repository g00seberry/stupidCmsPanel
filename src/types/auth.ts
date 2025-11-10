import { z } from 'zod';

/**
 * Поля формы авторизации пользователя.
 */
export const zLoginField = z.enum(['email', 'password']);
/**
 * Тип поля формы авторизации.
 */
export type ZLoginField = z.infer<typeof zLoginField>;

/**
 * Данные, требуемые для входа пользователя.
 */
export const zLoginDto = z.object({
  email: z
    .email({ message: 'Некорректный email' })
    .min(1, { message: 'Email обязателен' })
    .max(255, { message: 'Email не должен превышать 255 символов' }),
  password: z
    .string()
    .min(8, { message: 'Пароль должен содержать минимум 8 символов' })
    .max(255, { message: 'Пароль не должен превышать 255 символов' }),
});
/**
 * DTO для запроса авторизации.
 */
export type ZLoginDto = z.infer<typeof zLoginDto>;

/**
 * Модель пользователя, возвращаемая API авторизации.
 */
export const zAuthUser = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string(),
});
/**
 * Тип пользователя, получаемый после авторизации.
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
