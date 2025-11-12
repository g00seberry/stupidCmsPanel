import { z } from 'zod';

/**
 * Схема валидации метаданных пагинации.
 */
export const zPaginationMeta = z.object({
  /** Текущая страница. */
  current_page: z.number(),
  /** Последняя страница. */
  last_page: z.number(),
  /** Количество элементов на странице. */
  per_page: z.number(),
  /** Общее количество элементов. */
  total: z.number(),
});

/**
 * Тип метаданных пагинации.
 */
export type ZPaginationMeta = z.infer<typeof zPaginationMeta>;

/**
 * Схема валидации ссылок пагинации.
 */
export const zPaginationLinks = z.object({
  /** Ссылка на первую страницу. */
  first: z.string().nullable(),
  /** Ссылка на последнюю страницу. */
  last: z.string().nullable(),
  /** Ссылка на предыдущую страницу. */
  prev: z.string().nullable(),
  /** Ссылка на следующую страницу. */
  next: z.string().nullable(),
});

/**
 * Тип ссылок пагинации.
 */
export type ZPaginationLinks = z.infer<typeof zPaginationLinks>;
