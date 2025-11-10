import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { zProblemJson } from '@/types/ProblemJson';
import type { ZProblemJson } from '@/types/ProblemJson';

/**
 * Структура ошибки, возвращаемой HTTP-клиентом.
 */
export interface HttpError extends Error {
  status: number;
  problem?: ZProblemJson;
  raw?: string;
}

const client = axios.create({
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const httpClient = client;

/**
 * Конфигурация запроса HTTP-клиента.
 */
type HttpConfig = AxiosRequestConfig;

/**
 * Выполняет HTTP-запрос с настройками по умолчанию и обработкой ошибок.
 * @param url Адрес запроса.
 * @param config Дополнительная конфигурация запроса.
 * @returns Данные ответа API.
 */
export const http = async <T>(url: string, config: HttpConfig = {}): Promise<T> => {
  try {
    const response = await httpClient.request<T>({
      url,
      ...config,
    });

    if (response.status === 204) {
      return undefined as T;
    }

    return response.data;
  } catch (error) {
    throw buildError(error);
  }
};

/**
 * Преобразует произвольную ошибку в `HttpError`.
 * @param error Ошибка HTTP-запроса.
 * @returns Стандартизированная ошибка.
 */
const buildError = (error: unknown): HttpError => {
  if (axios.isAxiosError(error)) {
    return fromAxiosError(error);
  }

  return Object.assign(new Error('Request failed'), {
    status: 0,
  });
};

/**
 * Преобразует `AxiosError` в `HttpError` с попыткой чтения Problem JSON.
 * @param error Ошибка Axios.
 * @returns Стандартизированная ошибка.
 */
const fromAxiosError = (error: AxiosError): HttpError => {
  const response = error.response as AxiosResponse<unknown> | undefined;
  const status = response?.status ?? 0;
  const data = response?.data;

  const parsedProblem = zProblemJson.safeParse(data);
  if (parsedProblem.success) {
    const problem = parsedProblem.data;
    return Object.assign(new Error(problem.title ?? 'Request failed'), {
      status,
      problem,
    });
  }

  const raw = typeof data === 'string' ? data : error.message;
  return Object.assign(new Error('Request failed'), {
    status,
    raw,
  });
};
