import { z } from 'zod';
import { zId } from './ZId';

/**
 * Схема валидации options_json типа контента.
 * Содержит настройки типа контента, включая список разрешённых таксономий.
 * @example
 * const options: ZPostTypeOptions = {
 *   taxonomies: [1, 2],
 *   fields: { price: { type: 'number' } }
 * };
 */
export const zPostTypeOptions = z
  .object({
    /** Массив ID разрешённых таксономий. Если пуст или отсутствует, разрешены все таксономии. */
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
 *   name: 'Articles',
 *   template: 'templates.article',
 *   options_json: { taxonomies: [1, 2], fields: { price: { type: 'number' } } },
 *   blueprint_id: 1,
 *   created_at: '2025-01-10T12:45:00+00:00',
 *   updated_at: '2025-01-10T12:45:00+00:00'
 * };
 */
export const zPostType = z.object({
  /** Уникальный числовой идентификатор типа контента. */
  id: zId,
  /** Отображаемое название типа контента. */
  name: z.string(),
  /** Путь к шаблону Blade. Должен начинаться с `templates.`. Может быть `null`. */
  template: z
    .union([
      z
        .string()
        .max(255, 'Максимум 255 символов')
        .refine(val => val.startsWith('templates.'), 'Шаблон должен начинаться с templates.'),
      z.null(),
    ])
    .optional(),
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
 *   name: 'Products',
 *   template: 'templates.product',
 *   options_json: { taxonomies: ['categories'], fields: { price: { type: 'number' } } }
 * };
 */
export const zPostTypePayload = z.object({
  /** Отображаемое название типа контента. Не может быть пустым. */
  name: z.string().min(1),
  /** Путь к шаблону Blade. Должен начинаться с `templates.`. Может быть `null`. */
  template: z
    .union([
      z
        .string()
        .max(255, 'Максимум 255 символов')
        .refine(val => val.startsWith('templates.'), 'Шаблон должен начинаться с templates.'),
      z.null(),
    ])
    .optional(),
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
