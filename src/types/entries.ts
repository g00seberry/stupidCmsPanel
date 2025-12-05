import { zPaginationLinks, zPaginationMeta } from '@/types/pagination';
import { zTerm } from '@/types/terms';
import { zTaxonomy } from '@/types/taxonomies';
import { z } from 'zod';
import { zId, type ZId } from './ZId';

/**
 * Схема валидации Blueprint в контексте Entry.
 * Упрощённая версия Blueprint, возвращаемая в ответе Entry.
 */
const zEntryBlueprint = z.object({
  /** Уникальный идентификатор Blueprint. */
  id: zId,
  /** Отображаемое название Blueprint. */
  name: z.string(),
  /** Уникальный код Blueprint (URL-friendly строка). */
  code: z.string(),
  /** Описание Blueprint. Может быть `null`. */
  description: z.string().nullable(),
  /** Дата создания в формате ISO 8601. Может быть `null`. */
  created_at: z.string().nullable(),
  /** Дата последнего обновления в формате ISO 8601. Может быть `null`. */
  updated_at: z.string().nullable(),
});

/**
 * Схема валидации записи CMS.
 * Запись представляет собой единицу контента определённого типа.
 * @example
 * const entry: ZEntry = {
 *   id: 42,
 *   post_type_id: 1,
 *   title: 'Headless CMS launch checklist',
 *   slug: 'launch-checklist',
 *   status: 'published',
 *   is_published: true,
 *   published_at: '2025-02-10T08:00:00+00:00',
 *   content_json: { hero: { title: 'Launch' } },
 *   meta_json: { title: 'Launch', description: 'Checklist' },
 *   template_override: 'templates.landing',
 *   created_at: '2025-02-09T10:15:00+00:00',
 *   updated_at: '2025-02-10T08:05:00+00:00',
 *   deleted_at: null
 * };
 */
export const zEntry = z.object({
  /** Уникальный идентификатор записи. */
  id: zId,
  /** ID типа контента записи. */
  post_type_id: z.number(),
  /** Заголовок записи. */
  title: z.string(),
  /** URL-friendly идентификатор записи. */
  slug: z.string(),
  /** Статус записи: draft, published, scheduled, trashed. */
  status: z.enum(['draft', 'published', 'scheduled', 'trashed']),
  /** Флаг публикации записи. */
  is_published: z.boolean(),
  /** Дата публикации в формате ISO 8601. Может быть `null`. */
  published_at: z.string().nullable(),
  /** Содержимое записи в формате JSON. */
  content_json: z.record(z.string(), z.unknown()).nullish().default(null),
  /** Метаданные записи в формате JSON. */
  meta_json: z.record(z.string(), z.unknown()).nullish().default(null),
  /** Переопределение шаблона для записи. Может быть `null`. */
  template_override: z.string().nullable().optional(),
  /** Blueprint, назначенный в PostType. Присутствует только если PostType имеет blueprint_id. */
  blueprint: zEntryBlueprint.optional(),
  /** Дата создания в формате ISO 8601. */
  created_at: z.string().optional(),
  /** Дата последнего обновления в формате ISO 8601. */
  updated_at: z.string().optional(),
  /** Дата мягкого удаления в формате ISO 8601. Может быть `null`. */
  deleted_at: z.string().nullable().optional(),
});

/**
 * Тип данных одной записи CMS.
 */
export type ZEntry = z.infer<typeof zEntry>;

/**
 * Схема валидации ответа API со списком записей.
 */
export const zEntriesResponse = z.object({
  /** Массив записей. */
  data: z.array(zEntry),
  /** Ссылки пагинации. */
  links: zPaginationLinks,
  /** Метаданные пагинации. */
  meta: zPaginationMeta,
});

/**
 * Тип ответа API со списком записей.
 */
export type ZEntriesResponse = z.infer<typeof zEntriesResponse>;

/**
 * Схема валидации ответа API со списком возможных статусов записей.
 */
export const zEntriesStatusesResponse = z.object({
  /** Массив возможных статусов записей. */
  data: z.array(z.string()),
});

/**
 * Тип ответа API со списком возможных статусов записей.
 */
export type ZEntriesStatusesResponse = z.infer<typeof zEntriesStatusesResponse>;

/**
 * Параметры запроса списка записей.
 */
export type ZEntriesListParams = {
  /** Фильтр по ID типа контента. */
  post_type_id?: ZId;
  /** Фильтр по статусу: all, draft, published, scheduled, trashed. По умолчанию: all. */
  status?: 'all' | 'draft' | 'published' | 'scheduled' | 'trashed';
  /** Поиск по названию/slug. */
  q?: string;
  /** ID автора. */
  author_id?: ZId;
  /** Массив ID терминов для фильтрации. */
  term?: ZId[];
  /** Поле даты для диапазона: updated, published. По умолчанию: updated. */
  date_field?: 'updated' | 'published';
  /** Начальная дата диапазона (ISO 8601). */
  date_from?: string;
  /** Конечная дата диапазона (ISO 8601, >= date_from). */
  date_to?: string;
  /** Поле сортировки: updated_at.desc, updated_at.asc, published_at.desc, published_at.asc, title.asc, title.desc. По умолчанию: updated_at.desc. */
  sort?:
    | 'updated_at.desc'
    | 'updated_at.asc'
    | 'published_at.desc'
    | 'published_at.asc'
    | 'title.asc'
    | 'title.desc';
  /** Количество элементов на странице (10-100). По умолчанию: 15. */
  per_page?: number;
  /** Номер страницы (>=1). По умолчанию: 1. */
  page?: number;
};

/**
 * Схема валидации ответа API с одной записью.
 */
export const zEntryResponse = z.object({
  /** Данные записи. */
  data: zEntry,
});

/**
 * Тип ответа API с одной записью.
 */
export type ZEntryResponse = z.infer<typeof zEntryResponse>;

/**
 * Схема валидации данных для создания или обновления записи.
 * @example
 * const payload: ZEntryPayload = {
 *   post_type_id: 1,
 *   title: 'Headless CMS launch checklist',
 *   slug: 'launch-checklist',
 *   content_json: { hero: { title: 'Launch' } },
 *   meta_json: { title: 'Launch', description: 'Checklist' },
 *   is_published: false,
 *   published_at: '2025-02-10T08:00:00Z',
 *   template_override: 'templates.landing',
 *   term_ids: [3, 8]
 * };
 */
export const zEntryPayload = z.object({
  /** ID типа контента записи. Обязателен при создании. */
  post_type_id: zId.optional(),
  /** Заголовок записи. */
  title: z.string().min(1),
  /** URL-friendly идентификатор записи. */
  slug: z.string().min(1),
  /** Содержимое записи в формате JSON. */
  content_json: z.record(z.string(), z.unknown()).nullish().optional(),
  /** Метаданные записи в формате JSON. */
  meta_json: z.record(z.string(), z.unknown()).nullish().optional(),
  /** Флаг публикации записи. */
  is_published: z.boolean().optional(),
  /** Дата публикации в формате ISO 8601. Может быть `null`. */
  published_at: z.string().nullable().optional(),
  /** Переопределение шаблона для записи. Может быть `null`. */
  template_override: z.string().nullable().optional(),
  /** Массив ID терминов для связи с записью. */
  term_ids: z.array(zId).optional(),
});

/**
 * Тип данных для создания или обновления записи.
 */
export type ZEntryPayload = z.infer<typeof zEntryPayload>;

/**
 * Схема валидации терма без поля taxonomy (для группировки по таксономиям).
 * Используется в ответе API о термах записи в поле terms_by_taxonomy.
 */
const zTermWithoutTaxonomy = zTerm.omit({ taxonomy: true });

/**
 * Схема валидации элемента группировки термов по таксономиям.
 * Содержит полный объект таксономии и массив термов, принадлежащих этой таксономии.
 */
const zTermsByTaxonomyItem = z.object({
  /** Полный объект таксономии с информацией о её свойствах. */
  taxonomy: zTaxonomy,
  /** Массив термов, принадлежащих этой таксономии. Термы не содержат поле taxonomy, так как оно доступно на уровне таксономии. */
  terms: z.array(zTermWithoutTaxonomy),
});

/**
 * Схема валидации данных термов записи в ответе API.
 * Содержит группировку термов по таксономиям с полной информацией о таксономиях.
 * @example
 * const entryTerms: ZEntryTermsData = {
 *   entry_id: 42,
 *   terms_by_taxonomy: [
 *     {
 *       taxonomy: {
 *         id: 1,
 *         label: 'Categories',
 *         hierarchical: true,
 *         options_json: {},
 *         created_at: '2025-01-10T12:00:00+00:00',
 *         updated_at: '2025-01-10T12:00:00+00:00'
 *       },
 *       terms: [
 *         {
 *           id: 3,
 *           name: 'Guides',
 *           meta_json: {},
 *           created_at: '2025-01-10T12:00:00+00:00',
 *           updated_at: '2025-01-10T12:00:00+00:00',
 *           deleted_at: null
 *         }
 *       ]
 *     }
 *   ]
 * };
 */
export const zEntryTermsData = z.object({
  /** ID записи, для которой получены термы. */
  entry_id: zId,
  /** Массив группировок термов по таксономиям. Каждый элемент содержит полную информацию о таксономии и массив её термов. */
  terms_by_taxonomy: z.array(zTermsByTaxonomyItem),
});

/**
 * Тип данных термов записи в ответе API.
 */
export type ZEntryTermsData = z.infer<typeof zEntryTermsData>;

/**
 * Схема валидации ответа API о термах записи.
 * @example
 * const response: ZEntryTermsResponse = {
 *   data: {
 *     entry_id: 42,
 *     terms_by_taxonomy: [
 *       {
 *         taxonomy: {
 *           id: 1,
 *           label: 'Categories',
 *           hierarchical: true,
 *           options_json: {},
 *           created_at: '2025-01-10T12:00:00+00:00',
 *           updated_at: '2025-01-10T12:00:00+00:00'
 *         },
 *         terms: [
 *           {
 *             id: 3,
 *             name: 'Guides',
 *             meta_json: {},
 *             created_at: '2025-01-10T12:00:00+00:00',
 *             updated_at: '2025-01-10T12:00:00+00:00',
 *             deleted_at: null
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * };
 */
export const zEntryTermsResponse = z.object({
  /** Данные о термах записи. */
  data: zEntryTermsData,
});

/**
 * Тип ответа API о термах записи.
 */
export type ZEntryTermsResponse = z.infer<typeof zEntryTermsResponse>;

/**
 * Схема валидации тела запроса для привязки/отвязки/синхронизации термов.
 * @example
 * const payload: ZEntryTermsPayload = {
 *   term_ids: [3, 8]
 * };
 */
export const zEntryTermsPayload = z.object({
  /** Массив ID терминов для привязки/отвязки/синхронизации. */
  term_ids: z.array(zId),
});

/**
 * Тип данных тела запроса для привязки/отвязки/синхронизации термов.
 */
export type ZEntryTermsPayload = z.infer<typeof zEntryTermsPayload>;
