import { z } from 'zod';

/**
 * Схема ответа API генерации slug.
 */
export const zSlugifyResponse = z.object({
  /** Базовый slug, сгенерированный из заголовка. */
  base: z.string(),
  /** Уникальный slug, если базовый уже занят. */
  unique: z.string(),
});

/**
 * Тип ответа API генерации slug.
 */
export type ZSlugifyResponse = z.infer<typeof zSlugifyResponse>;
