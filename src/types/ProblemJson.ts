import { z } from 'zod';

/**
 * Схема ответа в формате RFC 7807 (Problem Details for HTTP APIs).
 */
export const zProblemJson = z
  .object({
    type: z.string().optional(),
    title: z.string().optional(),
    status: z.number().optional(),
    detail: z.string().optional(),
    instance: z.string().optional(),
    errors: z.record(z.string(), z.array(z.string())).optional(),
  })
  .catchall(z.unknown());

/**
 * Тип данных Problem JSON.
 */
export type ZProblemJson = z.infer<typeof zProblemJson>;
