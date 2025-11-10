import { http } from '@/api/http';
import { zAuthUser, zLoginDto, zLoginResponse } from '@/types/auth';
import type { LogoutOptions, ZAuthUser, ZLoginDto, ZLoginResponse } from '@/types/auth';

/**
 * Выполняет попытку входа пользователя с указанными данными.
 * @param dto Пара логин/пароль, прошедшая валидацию.
 * @returns Ответ API с данными авторизованного пользователя.
 */
export const login = async (dto: ZLoginDto): Promise<ZLoginResponse> => {
  const payload = zLoginDto.parse(dto);
  const response = await http<unknown>('/api/v1/auth/login', {
    method: 'post',
    data: payload,
  });
  return zLoginResponse.parse(response);
};

/**
 * Завершает пользовательскую сессию.
 * @param options Параметры завершения сессии.
 */
export const logout = async (options: LogoutOptions = {}): Promise<void> => {
  await http<unknown>('/api/v1/auth/logout', {
    method: 'post',
    data: options.all ? { all: true } : undefined,
  });
};

/**
 * Загружает информацию о текущем авторизованном пользователе.
 * @returns Данные пользователя.
 */
export const fetchCurrentUser = async (): Promise<ZAuthUser> => {
  const response = await http<unknown>('/api/v1/admin/auth/current', {
    method: 'get',
  });
  return zAuthUser.parse(response);
};

/**
 * Обновляет токены авторизации пользователя.
 */
export const refreshTokens = async (): Promise<void> => {
  await http<unknown>('/api/v1/auth/refresh', {
    method: 'post',
  });
};
