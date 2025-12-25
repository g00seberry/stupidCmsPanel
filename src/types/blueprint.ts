import { z } from 'zod';
import { zPostType } from './postTypes';
import { zPaginationMeta } from './pagination';
import { zId } from './ZId';

/**
 * Схема валидации Blueprint.
 * Blueprint определяет структуру данных для записей CMS через систему полей (Path).
 * @example
 * const blueprint: ZBlueprint = {
 *   id: 1,
 *   name: 'Article',
 *   code: 'article',
 *   description: 'Схема для статей',
 *   paths_count: 5,
 *   embeds_count: 2,
 *   embedded_in_count: 1,
 *   post_types_count: 3,
 *   post_types: [{ id: 1, name: 'News', template: 'templates.news', options_json: { taxonomies: [] } }],
 *   created_at: '2025-01-10T12:45:00+00:00',
 *   updated_at: '2025-01-10T12:45:00+00:00'
 * };
 */
export const zBlueprint = z.object({
  /** Уникальный идентификатор Blueprint. */
  id: zId,
  /** Отображаемое название Blueprint. */
  name: z.string(),
  /** Уникальный код Blueprint (URL-friendly строка). */
  code: z.string(),
  /** Описание Blueprint. Может быть `null`. */
  description: z.string().nullable(),
  /** Количество полей (Path) в Blueprint. */
  paths_count: z.number().optional(),
  /** Количество встроенных Blueprint в текущем Blueprint. */
  embeds_count: z.number().optional(),
  /** Количество Blueprint, в которые встроен текущий Blueprint. */
  embedded_in_count: z.number().optional(),
  /** Количество типов контента, использующих этот Blueprint. */
  post_types_count: z.number().optional(),
  /** Список типов контента, использующих этот Blueprint. */
  post_types: z.array(zPostType).optional(),
  /** Дата создания в формате ISO 8601. */
  created_at: z.string(),
  /** Дата последнего обновления в формате ISO 8601. */
  updated_at: z.string(),
});

/**
 * Тип данных Blueprint.
 * Используется для представления полной информации о Blueprint в приложении.
 */
export type ZBlueprint = z.infer<typeof zBlueprint>;

/**
 * Схема валидации элемента списка Blueprint.
 * Упрощённая версия Blueprint для отображения в таблицах и списках.
 * @example
 * const blueprintItem: ZBlueprintListItem = {
 *   id: 1,
 *   name: 'Article',
 *   code: 'article',
 *   description: 'Схема для статей',
 *   paths_count: 5,
 *   embeds_count: 2,
 *   post_types_count: 3,
 *   created_at: '2025-01-10T12:45:00+00:00',
 *   updated_at: '2025-01-10T12:45:00+00:00'
 * };
 */
export const zBlueprintListItem = z.object({
  /** Уникальный идентификатор Blueprint. */
  id: zId,
  /** Отображаемое название Blueprint. */
  name: z.string(),
  /** Уникальный код Blueprint (URL-friendly строка). */
  code: z.string(),
  /** Описание Blueprint. Может быть `null`. */
  description: z.string().nullable(),
  /** Количество полей (Path) в Blueprint. */
  paths_count: z.number(),
  /** Количество встроенных Blueprint в текущем Blueprint. */
  embeds_count: z.number(),
  /** Количество типов контента, использующих этот Blueprint. */
  post_types_count: z.number(),
  /** Дата создания в формате ISO 8601. */
  created_at: z.string(),
  /** Дата последнего обновления в формате ISO 8601. */
  updated_at: z.string(),
});

/**
 * Тип данных элемента списка Blueprint.
 * Используется для представления Blueprint в списках и таблицах.
 */
export type ZBlueprintListItem = z.infer<typeof zBlueprintListItem>;

/**
 * Схема валидации данных для создания нового Blueprint.
 * @example
 * const createDto: ZCreateBlueprintDto = {
 *   name: 'Article',
 *   code: 'article',
 *   description: 'Схема для статей'
 * };
 */
export const zCreateBlueprintDto = z.object({
  /** Отображаемое название Blueprint. Минимум 1 символ, максимум 255 символов. */
  name: z.string().min(1, 'Название обязательно').max(255, 'Максимум 255 символов'),
  /** Уникальный код Blueprint (URL-friendly строка). Только a-z, 0-9 и _. Минимум 1 символ, максимум 255 символов. */
  code: z
    .string()
    .min(1, 'Код обязателен')
    .max(255, 'Максимум 255 символов')
    .regex(/^[a-z0-9_]+$/, 'Только a-z, 0-9 и _'),
  /** Описание Blueprint. Максимум 1000 символов. */
  description: z.string().max(1000, 'Максимум 1000 символов').optional(),
});

/**
 * Тип данных для создания нового Blueprint.
 * Используется при отправке запроса на создание Blueprint.
 */
export type ZCreateBlueprintDto = z.infer<typeof zCreateBlueprintDto>;

/**
 * Схема валидации данных для обновления Blueprint.
 * Все поля опциональны - обновляются только переданные поля.
 * @example
 * const updateDto: ZUpdateBlueprintDto = {
 *   name: 'Updated Article',
 *   description: 'Обновлённое описание'
 * };
 */
export const zUpdateBlueprintDto = z.object({
  /** Отображаемое название Blueprint. Минимум 1 символ, максимум 255 символов. */
  name: z.string().min(1).max(255).optional(),
  /** Уникальный код Blueprint (URL-friendly строка). Только a-z, 0-9 и _. Максимум 255 символов. */
  code: z
    .string()
    .max(255)
    .regex(/^[a-z0-9_]+$/)
    .optional(),
  /** Описание Blueprint. Максимум 1000 символов. */
  description: z.string().max(1000).optional(),
});

/**
 * Тип данных для обновления Blueprint.
 * Используется при отправке запроса на обновление Blueprint.
 */
export type ZUpdateBlueprintDto = z.infer<typeof zUpdateBlueprintDto>;

/**
 * Схема валидации информации о Blueprint (краткая версия).
 * Используется в списках зависимостей и встраиваний.
 */
const zBlueprintInfo = z.object({
  /** Идентификатор Blueprint. */
  id: zId,
  /** Код Blueprint. */
  code: z.string(),
  /** Название Blueprint. */
  name: z.string(),
});

/**
 * Схема валидации списка Blueprint, доступных для встраивания.
 * @example
 * const embeddable: ZEmbeddableBlueprints = {
 *   data: [
 *     { id: 2, code: 'address', name: 'Address' },
 *     { id: 3, code: 'contact', name: 'Contact' }
 *   ]
 * };
 */
export const zEmbeddableBlueprints = z.object({
  /** Список Blueprint, доступных для безопасного встраивания. */
  data: z.array(zBlueprintInfo),
});

/**
 * Тип данных списка Blueprint, доступных для встраивания.
 */
export type ZEmbeddableBlueprints = z.infer<typeof zEmbeddableBlueprints>;

// Реэкспорт типов и схем JSON схемы Blueprint
export type { ZBlueprintSchema, ZBlueprintSchemaField } from './blueprintSchema';
export { zBlueprintSchema } from './blueprintSchema';

/**
 * Схема валидации ошибки API.
 * Используется для обработки ошибок валидации и других ошибок от бэкенда.
 * @example
 * const apiError: ZApiError = {
 *   message: 'Ошибка валидации',
 *   errors: {
 *     code: ['Код уже используется'],
 *     name: ['Название обязательно']
 *   }
 * };
 */
export const zApiError = z.object({
  /** Сообщение об ошибке. */
  message: z.string(),
  /** Объект с ошибками валидации (Laravel format). Ключ - имя поля, значение - массив сообщений об ошибках. */
  errors: z.record(z.string(), z.array(z.string())).optional(),
});

/**
 * Тип данных ошибки API.
 */
export type ZApiError = z.infer<typeof zApiError>;

/**
 * Generic функция для создания схемы пагинированного ответа API.
 * @param dataSchema Схема валидации элемента данных.
 * @returns Схема валидации пагинированного ответа.
 * @example
 * const zBlueprintsResponse = zPaginatedResponse(zBlueprintListItem);
 * const response: z.infer<typeof zBlueprintsResponse> = {
 *   data: [{ id: 1, name: 'Article', code: 'article', ... }],
 *   links: { first: '...', last: '...', prev: null, next: '...' },
 *   meta: { current_page: 1, last_page: 5, per_page: 15, total: 75 }
 * };
 */
export const zPaginatedResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    /** Массив данных текущей страницы. */
    data: z.array(dataSchema),
    /** Метаданные пагинации. */
    meta: zPaginationMeta,
  });
