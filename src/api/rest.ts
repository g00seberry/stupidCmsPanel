import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { authTask } from '@/api/authTask';

axios.defaults.withCredentials = true;

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
 */
export const rest = {
  /**
   * Выполняет GET-запрос.
   * @param url Адрес запроса.
   * @param config Дополнительные параметры Axios.
   * @returns Ответ Axios с данными типа `T`.
   */
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return runWithAuth(() => axios.get<T>(url, config));
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
    return runWithAuth(() => axios.post<T, AxiosResponse<T>, D>(url, data, config));
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
    return runWithAuth(() => axios.put<T, AxiosResponse<T>, D>(url, data, config));
  },
  /**
   * Выполняет DELETE-запрос.
   * @param url Адрес запроса.
   * @param config Дополнительные параметры Axios.
   * @returns Ответ Axios с данными типа `T`.
   */
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return runWithAuth(() => axios.delete<T>(url, config));
  },
} as const;

/**
 * Настройки сериализации параметров для axios.
 */
export const stdParamsSerializer = {
  indexes: null,
} as const;
