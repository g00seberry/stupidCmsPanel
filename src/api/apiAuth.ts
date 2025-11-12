import axios, { type AxiosResponse } from 'axios';
import { rest } from '@/api/rest';
import { zAuthUser, zLoginDto, zLoginResponse } from '@/types/auth';
import type { LogoutOptions, ZAuthUser, ZLoginDto, ZLoginResponse } from '@/types/auth';

const getAuthUrl = (path: string) => `/api/v1/auth${path}`;
const getAdminAuthUrl = (path: string) => `/api/v1/admin/auth${path}`;

/**
 * Загружает данные текущего авторизованного пользователя.
 * Используется для проверки авторизации и получения информации о пользователе.
 * @returns Информация о пользователе, прошедшая валидацию `zAuthUser`.
 * @throws {Error} Если пользователь не авторизован или токен истёк.
 * @example
 * const user = await getCurrentUser();
 * console.log(user.name); // 'Администратор'
 */
export const getCurrentUser = async (): Promise<ZAuthUser> => {
  const response = await rest.get<ZAuthUser>(getAdminAuthUrl('/current'));
  return zAuthUser.parse(response.data);
};

/**
 * Выполняет запрос на вход пользователя.
 * @param params Данные формы входа, предварительно валидированные.
 * @returns Ответ API с данными пользователя и токенами авторизации.
 * @throws {Error} Если неверные учётные данные или произошла ошибка сети.
 * @example
 * const response = await login({
 *   email: 'admin@example.com',
 *   password: 'securePassword123'
 * });
 * console.log(response.user.name); // 'Администратор'
 */
export const login = async (params: ZLoginDto): Promise<ZLoginResponse> => {
  const payload = zLoginDto.parse(params);
  const response = await axios.post<ZLoginResponse>(getAuthUrl('/login'), payload);
  return zLoginResponse.parse(response.data);
};

/**
 * Завершает текущую пользовательскую сессию.
 * @param options Параметры завершения сессии.
 * @example
 * // Выйти из текущей сессии
 * await logout();
 *
 * // Выйти из всех сессий на всех устройствах
 * await logout({ all: true });
 */
export const logout = async (options: LogoutOptions = {}): Promise<void> => {
  const payload = options.all ? { all: true } : undefined;
  await rest.post(getAuthUrl('/logout'), payload);
};

/**
 * Обновляет токены авторизации пользователя.
 * @returns HTTP-ответ refresh-эндпоинта.
 */
export const refresh = (): Promise<AxiosResponse<void>> => {
  return axios.post<void>(getAuthUrl('/refresh'));
};
