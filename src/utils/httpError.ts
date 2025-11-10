import type { HttpError } from '@/types/HttpError';

/**
 * Проверяет, является ли ошибка экземпляром `HttpError`.
 * @param error Произвольное значение ошибки.
 * @returns Признак того, что ошибка соответствует `HttpError`.
 */
export const isHttpError = (error: unknown): error is HttpError => {
  return typeof error === 'object' && error !== null && 'status' in error;
};

