import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { authTask } from '@/api/authTask';

const client = axios.create({
  withCredentials: true,
  xsrfCookieName: 'cms_csrf',
  xsrfHeaderName: 'X-CSRF-Token',
});

/**
 * Выполняет HTTP-запрос, гарантируя обработку 401 ответов.
 * @param task Функция, выполняющая запрос Axios.
 * @returns Ответ Axios.
 */
const runWithAuth = async <R extends AxiosResponse>(task: () => Promise<R>): Promise<R> => {
  return authTask(task);
};

/**
 * Унифицированный API-клиент с поддержкой автоматического обновления токенов.
 * Все запросы автоматически обрабатывают 401 ошибки, пытаясь обновить токены.
 * Использует CSRF защиту через cookies и заголовки.
 * @example
 * // GET запрос
 * const response = await rest.get<User>('/api/v1/users/1');
 * console.log(response.data);
 *
 * // POST запрос
 * const newUser = await rest.post<User>('/api/v1/users', { name: 'John' });
 *
 * // PUT запрос
 * const updated = await rest.put<User>('/api/v1/users/1', { name: 'Jane' });
 *
 * // DELETE запрос
 * await rest.delete('/api/v1/users/1');
 */
export const rest = {
  /**
   * Выполняет GET-запрос.
   * @param url Адрес запроса.
   * @param config Дополнительные параметры Axios.
   * @returns Ответ Axios с данными типа `T`.
   */
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return runWithAuth(() => client.get<T>(url, config));
  },
  /**
   * Выполняет POST-запрос.
   * @param url Адрес запроса.
   * @param data Тело запроса.
   * @param config Дополнительные параметры Axios.
   * @returns Ответ Axios с данными типа `T`.
   */
  post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return runWithAuth(() => client.post<T, AxiosResponse<T>, D>(url, data, config));
  },
  /**
   * Выполняет PUT-запрос.
   * @param url Адрес запроса.
   * @param data Тело запроса.
   * @param config Дополнительные параметры Axios.
   * @returns Ответ Axios с данными типа `T`.
   */
  put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return runWithAuth(() => client.put<T, AxiosResponse<T>, D>(url, data, config));
  },
  /**
   * Выполняет DELETE-запрос.
   * @param url Адрес запроса.
   * @param config Дополнительные параметры Axios.
   * @returns Ответ Axios с данными типа `T`.
   */
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return runWithAuth(() => client.delete<T>(url, config));
  },
} as const;
