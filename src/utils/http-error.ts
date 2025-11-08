import type { HttpError } from '@/api/http';

export function isHttpError(error: unknown): error is HttpError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

