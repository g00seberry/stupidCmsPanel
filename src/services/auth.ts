import { login, fetchCsrfToken, type LoginDto, type LoginResponse } from '@/api/auth';
import { isHttpError } from '@/utils/http-error';

type LoginRetryOptions = {
  retriedCsrf?: boolean;
};

export async function loginWithCsrfRetry(
  dto: LoginDto,
  { retriedCsrf = false }: LoginRetryOptions = {}
): Promise<LoginResponse> {
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

