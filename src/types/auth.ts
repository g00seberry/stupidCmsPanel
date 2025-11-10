import { z } from 'zod';

export const zLoginField = z.enum(['email', 'password']);
export type ZLoginField = z.infer<typeof zLoginField>;

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
export type ZLoginDto = z.infer<typeof zLoginDto>;

export const zAuthUser = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string(),
});
export type ZAuthUser = z.infer<typeof zAuthUser>;

export const zLoginResponse = z.object({
  user: zAuthUser,
});
export type ZLoginResponse = z.infer<typeof zLoginResponse>;
