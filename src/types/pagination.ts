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
 * Тип пагинированного ответа API.
 * @template T Тип элемента данных в массиве.
 */
export type ZPaginatedResponse<T> = {
  /** Массив данных. */
  data: T[];
  /** Метаданные пагинации. */
  meta: ZPaginationMeta;
};

/**
 * Создаёт схему валидации пагинированного ответа API.
 * @param dataSchema Схема валидации одного элемента данных.
 * @returns Схема валидации пагинированного ответа с массивом данных и метаданными пагинации.
 */
export const zPaginatedResponse = <T extends z.ZodTypeAny>(
  dataSchema: T
): z.ZodType<ZPaginatedResponse<z.infer<T>>> =>
  z.object({
    /** Массив данных. */
    data: z.array(dataSchema),
    /** Метаданные пагинации. */
    meta: zPaginationMeta,
  }) as z.ZodType<ZPaginatedResponse<z.infer<T>>>;
