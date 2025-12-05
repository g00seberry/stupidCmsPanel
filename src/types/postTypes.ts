import { z } from 'zod';
import { zId } from './ZId';

/**
 * Схема валидации options_json типа контента.
 * Содержит настройки типа контента, включая список разрешённых таксономий.
 * @example
 * const options: ZPostTypeOptions = {
 *   taxonomies: ['categories', 'tags'],
 *   fields: { price: { type: 'number' } }
 * };
 */
export const zPostTypeOptions = z
  .object({
    /** Массив slug'ов разрешённых таксономий. Если пуст или отсутствует, разрешены все таксономии. */
    taxonomies: z.array(zId).optional().default([]),
  })
  .catchall(z.unknown());

/**
 * Тип данных options_json типа контента.
 */
export type ZPostTypeOptions = z.infer<typeof zPostTypeOptions>;

/**
 * Схема валидации типа контента CMS.
 * Тип контента определяет структуру и настройки для записей определённого вида.
 * @example
 * const postType: ZPostType = {
 *   id: 1,
 *   slug: 'article',
 *   name: 'Articles',
 *   options_json: { taxonomies: ['categories'], fields: { price: { type: 'number' } } },
 *   blueprint_id: 1,
 *   created_at: '2025-01-10T12:45:00+00:00',
 *   updated_at: '2025-01-10T12:45:00+00:00'
 * };
 */
export const zPostType = z.object({
  /** Уникальный числовой идентификатор типа контента. */
  id: zId,
  /** Уникальный идентификатор типа контента (URL-friendly строка). */
  slug: z.string(),
  /** Отображаемое название типа контента. */
  name: z.string(),
  /** Дополнительные настройки типа контента в формате JSON. */
  options_json: zPostTypeOptions.default({ taxonomies: [] }),
  /** ID привязанного Blueprint. `null` если Blueprint не привязан. */
  blueprint_id: zId.nullable().optional(),
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
 *   options_json: { taxonomies: ['categories'], fields: { price: { type: 'number' } } }
 * };
 */
export const zPostTypePayload = z.object({
  /** Уникальный идентификатор типа контента. Не может быть пустым. */
  slug: z.string().min(1),
  /** Отображаемое название типа контента. Не может быть пустым. */
  name: z.string().min(1),
  /** Дополнительные настройки в формате JSON. По умолчанию пустой объект. */
  options_json: zPostTypeOptions.default({ taxonomies: [] }),
  /** ID Blueprint для привязки. `null` для отвязки. Опционально. */
  blueprint_id: zId.nullable().optional(),
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
