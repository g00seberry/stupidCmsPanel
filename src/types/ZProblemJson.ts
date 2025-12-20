import { z } from 'zod';

/**
 * Схема валидации мета-данных ошибки API.
 * Содержит дополнительную информацию об ошибке, специфичную для конкретного API.
 */
export const zProblemJsonMeta = z
  .object({
    /** Уникальный идентификатор запроса для отслеживания в логах. */
    request_id: z.string().optional(),
    /** Причина ошибки в человекочитаемом формате. */
    reasons: z.string().array().optional(),
    /** Требуемое разрешение для выполнения операции. */
    permission: z.string().optional(),
    /** Количество секунд до следующей попытки (для rate limiting). */
    retry_after: z.number().optional(),
    /** Детали ошибок валидации по полям формы. */
    errors: z.record(z.string(), z.array(z.string())).optional(),
  })
  .catchall(z.unknown());

/**
 * Тип мета-данных ошибки API.
 * Используется для передачи дополнительной информации об ошибке.
 */
export type ZProblemJsonMeta = z.infer<typeof zProblemJsonMeta>;

/**
 * Схема валидации ответа об ошибке в формате RFC 7807 (Problem Details for HTTP APIs).
 * Стандартизированный формат для описания ошибок HTTP API.
 * @example
 * const error: ZProblemJson = {
 *   type: 'https://example.com/errors/validation',
 *   title: 'Ошибка валидации',
 *   status: 400,
 *   code: 'VALIDATION_ERROR',
 *   detail: 'Поле email обязательно для заполнения',
 *   instance: '/api/v1/users',
 *   meta: {
 *     errors: {
 *       email: ['Поле обязательно для заполнения']
 *     }
 *   }
 * };
 */
export const zProblemJson = z
  .object({
    /** URI, идентифицирующий тип проблемы. */
    type: z.string().nullish(),
    /** Краткое описание проблемы. */
    title: z.string().nullish(),
    /** HTTP статус код ошибки. */
    status: z.number().nullish(),
    /** Внутренний код ошибки приложения. */
    code: z.string().nullish(),
    /** Подробное описание проблемы. */
    detail: z.string().nullish(),
    /** URI, указывающий на конкретный экземпляр проблемы. */
    instance: z.string().nullish(),
    /** Дополнительные мета-данные об ошибке. */
    meta: zProblemJsonMeta.nullish(),
    /** Идентификатор трассировки для отладки. */
    trace_id: z.string().nullish(),
  })
  .catchall(z.unknown());

/**
 * Тип данных Problem JSON согласно RFC 7807.
 * Используется для обработки ошибок API в унифицированном формате.
 */
export type ZProblemJson = z.infer<typeof zProblemJson>;
