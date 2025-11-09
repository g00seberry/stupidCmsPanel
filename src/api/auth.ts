import { http } from '@/api/http';
import { z } from 'zod';

export const loginDtoSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный email')
    .max(255, 'Email не должен превышать 255 символов'),
  password: z
    .string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .max(255, 'Пароль не должен превышать 255 символов'),
});

export type LoginDto = z.infer<typeof loginDtoSchema>;

export const authUserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
});

export type AuthUser = z.infer<typeof authUserSchema>;

export const loginResponseSchema = z.object({
  user: authUserSchema,
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export async function login(dto: LoginDto): Promise<LoginResponse> {
  const response = await http<unknown>('/api/v1/auth/login', {
    method: 'post',
    data: dto,
  });
  return loginResponseSchema.parse(response);
}

export async function logout(options: { all?: boolean } = {}): Promise<void> {
  await http<unknown>('/api/v1/auth/logout', {
    method: 'post',
    data: options.all ? { all: true } : undefined,
  });
}

export async function fetchCsrfToken(): Promise<void> {
  await http<unknown>('/api/v1/auth/csrf', { method: 'get' });
}
