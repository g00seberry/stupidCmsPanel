import { login, fetchCsrfToken } from '@/api/auth';
import type { ZLoginDto, ZLoginResponse } from '@/types/auth';
import { isHttpError } from '@/utils/http-error';

type LoginRetryOptions = {
  retriedCsrf?: boolean;
};

export async function loginWithCsrfRetry(
  dto: ZLoginDto,
  { retriedCsrf = false }: LoginRetryOptions = {}
): Promise<ZLoginResponse> {
  try {
    return await login(dto);
  } catch (error) {
    if (!retriedCsrf && isHttpError(error) && (error.status === 419 || error.status === 403)) {
      await fetchCsrfToken();
      return loginWithCsrfRetry(dto, { retriedCsrf: true });
    }

    throw error;
  }
}
