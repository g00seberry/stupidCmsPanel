import { authStore } from '@/AuthStore';
import { refresh } from '@/api/apiAuth';
import axios, { type AxiosResponse } from 'axios';

let authWait: Promise<AxiosResponse<void>> | null = null;

/**
 * Выполняет запрос к API с автоматическим обновлением токенов при 401 ответе.
 * @param task Функция, выполняющая HTTP-запрос.
 * @returns Ответ API после возможного обновления токенов.
 * @throws HttpError Если обновить токены не удалось.
 */
export const authTask = async <R extends AxiosResponse>(task: () => Promise<R>): Promise<R> => {
  try {
    return await task();
  } catch (error) {
    if (!axios.isAxiosError(error) || !error.response || error.response.status !== 401) {
      throw error;
    }

    authWait = authWait ?? refresh();

    try {
      const refreshResponse = await authWait;
      authWait = null;

      if (refreshResponse.status !== 200) {
        authStore.setUser(null);
        throw refreshResponse;
      }
    } catch (error) {
      authWait = null;
      authStore.setUser(null);
      throw error;
    }

    return task();
  }
};
