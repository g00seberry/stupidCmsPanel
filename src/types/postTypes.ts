import { z } from 'zod';

/**
 * Схема валидации типа контента CMS.
 * Тип контента определяет структуру и настройки для записей определённого вида.
 * @example
 * const postType: ZPostType = {
 *   slug: 'article',
 *   name: 'Статья',
 *   template: 'article-template',
 *   options_json: { allowComments: true },
 *   created_at: '2024-01-01T00:00:00Z',
 *   updated_at: '2024-01-02T00:00:00Z'
 * };
 */
export const zPostType = z.object({
  /** Уникальный идентификатор типа контента (URL-friendly строка). */
  slug: z.string(),
  /** Отображаемое название типа контента. */
  name: z.string(),
  /** Имя шаблона для рендеринга записей этого типа. Может быть `null`. */
  template: z.string().optional().nullable(),
  /** Дополнительные настройки типа контента в формате JSON. */
  options_json: z.record(z.string(), z.unknown()).nullish().default(null),
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
 *   slug: 'article',
 *   name: 'Статья',
 *   template: 'article-template',
 *   options_json: { allowComments: true }
 * };
 */
export const zPostTypePayload = z.object({
  /** Уникальный идентификатор типа контента. Не может быть пустым. */
  slug: z.string().min(1),
  /** Отображаемое название типа контента. Не может быть пустым. */
  name: z.string().min(1),
  /** Имя шаблона для рендеринга. Может быть `null` или `undefined`. */
  template: z.string().optional().nullable(),
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
