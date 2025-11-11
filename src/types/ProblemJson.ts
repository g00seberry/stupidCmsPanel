import { z } from 'zod';

/**
 * Схема мета-данных ошибки API.
 */
export const zProblemJsonMeta = z
  .object({
    request_id: z.string().optional(),
    reason: z.string().optional(),
    permission: z.string().optional(),
    retry_after: z.number().optional(),
    errors: z.record(z.string(), z.array(z.string())).optional(),
  })
  .catchall(z.unknown());

/**
 * Тип мета-данных ошибки API.
 */
export type ZProblemJsonMeta = z.infer<typeof zProblemJsonMeta>;

/**
 * Схема ответа в формате RFC 7807 (Problem Details for HTTP APIs).
 */
export const zProblemJson = z
  .object({
    type: z.string().optional(),
    title: z.string().optional(),
    status: z.number().optional(),
    code: z.string().optional(),
    detail: z.string().optional(),
    instance: z.string().optional(),
    meta: zProblemJsonMeta.optional(),
    trace_id: z.string().optional(),
  })
  .catchall(z.unknown());

/**
 * Тип данных Problem JSON.
 */
export type ZProblemJson = z.infer<typeof zProblemJson>;
