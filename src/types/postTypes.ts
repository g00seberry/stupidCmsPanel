import { z } from 'zod';

/**
 * Схема валидации типа контента CMS.
 * Тип контента определяет структуру и настройки для записей определённого вида.
 * @example
 * const postType: ZPostType = {
 *   slug: 'article',
 *   name: 'Articles',
 *   options_json: { fields: { price: { type: 'number' } } },
 *   created_at: '2025-01-10T12:45:00+00:00',
 *   updated_at: '2025-01-10T12:45:00+00:00'
 * };
 */
export const zPostType = z.object({
  /** Уникальный идентификатор типа контента (URL-friendly строка). */
  slug: z.string(),
  /** Отображаемое название типа контента. */
  name: z.string(),
  /** Дополнительные настройки типа контента в формате JSON. */
  options_json: z.record(z.string(), z.unknown()).default({}),
  /** Дата создания в формате ISO 8601. */
  created_at: z.string().optional(),
  /** Дата последнего обновления в формате ISO 8601. */
  updated_at: z.string().optional(),
});

/**
 * Тип данных одного типа контента.
 * Используется для представления типа контента в приложении.
 */
export type ZPostType = z.infer<typeof zPostType>;

/**
 * Схема валидации данных для создания или обновления типа контента.
 * @example
 * const payload: ZPostTypePayload = {
 *   slug: 'product',
 *   name: 'Products',
 *   options_json: { fields: { price: { type: 'number' } } }
 * };
 */
export const zPostTypePayload = z.object({
  /** Уникальный идентификатор типа контента. Не может быть пустым. */
  slug: z.string().min(1),
  /** Отображаемое название типа контента. Не может быть пустым. */
  name: z.string().min(1),
  /** Дополнительные настройки в формате JSON. По умолчанию пустой объект. */
  options_json: z.record(z.string(), z.unknown()).default({}),
});

/**
 * DTO для сохранения типа контента.
 * Используется при создании нового типа контента или обновлении существующего.
 */
export type ZPostTypePayload = z.infer<typeof zPostTypePayload>;

/**
 * Ответ API со списком типов контента.
 */
export const zPostTypesResponse = z.object({
  data: z.array(zPostType),
});

/**
 * Ответ API с данными одного типа контента.
 */
export const zPostTypeResponse = z.object({
  data: zPostType,
});
