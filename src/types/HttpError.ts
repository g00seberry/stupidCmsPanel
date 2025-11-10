import type { ZProblemJson } from '@/types/ProblemJson';

/**
 * Стандартизированная ошибка HTTP-запроса с дополнительными данными.
 */
export interface HttpError extends Error {
  status: number;
  problem?: ZProblemJson;
  raw?: string;
}

