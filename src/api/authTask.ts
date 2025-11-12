import { refresh } from '@/api/apiAuth';
import { authStore } from '@/AuthStore';

/**
 * HTTP-ответ с обязательным полем статуса.
 */
export type ApiResponseWithStatus = { status: number };

/**
 * Промис обновления токенов авторизации. Используется для предотвращения параллельных запросов на обновление токенов.
 */
let authWait: Promise<ApiResponseWithStatus> | null = null;

/**
 * Выполняет запрос к API с автоматическим обновлением токенов при 401 ответе.
 * Предотвращает параллельные запросы на обновление токенов через механизм блокировки.
 * Если после обновления токенов запрос всё ещё возвращает 401, пользователь разлогинивается.
 * @param task Функция, выполняющая HTTP-запрос.
 * @returns Ответ API после возможного обновления токенов.
 * @throws {Error} Если обновить токены не удалось или пользователь не авторизован.
 * @example
 * const response = await authTask(() => axios.get('/api/v1/protected'));
 * // Если получили 401, токены автоматически обновятся и запрос повторится
 */
export const authTask = async <R extends ApiResponseWithStatus>(
  task: () => Promise<R>
): Promise<R> => {
  let resp: R;

  try {
    resp = await task();
  } catch (candidateError: unknown) {
    if (candidateError && typeof candidateError === 'object' && 'response' in candidateError) {
      const error = candidateError as { response: R };
      resp = error.response;

      if (resp.status !== 401) {
        throw candidateError;
      }
    } else {
      throw candidateError;
    }
  }

  if (resp.status === 401) {
    authWait = authWait ?? refresh();

    try {
      const refreshResponse = await authWait;

      if (refreshResponse.status !== 200) {
        authStore.setUser(null);
        throw new Error('Authorization required');
      }
    } catch (error) {
      authStore.setUser(null);
      throw error;
    } finally {
      authWait = null;
    }

    resp = await task();

    if (resp.status === 401) {
      authStore.setUser(null);
      throw new Error('Authorization required');
    }
  }

  return resp;
};
