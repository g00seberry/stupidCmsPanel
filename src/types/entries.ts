import { zPaginationLinks, zPaginationMeta } from '@/types/pagination';
import { zTerm } from '@/types/terms';
import { z } from 'zod';
import { zId } from './ZId';

/**
 * Схема валидации записи CMS.
 * Запись представляет собой единицу контента определённого типа.
 * @example
 * const entry: ZEntry = {
 *   id: 42,
 *   post_type: 'article',
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
  id: z.number(),
  /** Тип контента записи (slug типа). */
  post_type: z.string(),
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
  /** Фильтр по slug типа контента. */
  post_type?: string;
  /** Фильтр по статусу: all, draft, published, scheduled, trashed. По умолчанию: all. */
  status?: 'all' | 'draft' | 'published' | 'scheduled' | 'trashed';
  /** Поиск по названию/slug. */
  q?: string;
  /** ID автора. */
  author_id?: number;
  /** Массив ID терминов для фильтрации. */
  term?: number[];
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
 *   post_type: 'article',
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
  /** Тип контента записи (slug типа). Обязателен при создании. */
  post_type: z.string().optional(),
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
  term_ids: z.array(z.number()).optional(),
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
 * Схема валидации данных термов записи в ответе API.
 * Содержит список всех термов записи и группировку по таксономиям.
 * @example
 * const entryTerms: ZEntryTermsData = {
 *   entry_id: 42,
 *   terms: [
 *     {
 *       id: 3,
 *       name: 'Guides',
 *       slug: 'guides',
 *       taxonomy: 'category'
 *     }
 *   ],
 *   terms_by_taxonomy: {
 *     category: [
 *       {
 *         id: 3,
 *         name: 'Guides',
 *         slug: 'guides'
 *       }
 *     ]
 *   }
 * };
 */
export const zEntryTermsData = z.object({
  /** ID записи, для которой получены термы. */
  entry_id: z.number(),
  /** Массив всех термов записи с полной информацией, включая taxonomy. */
  terms: z.array(zTerm),
  /** Группировка термов по таксономиям. Ключ - slug таксономии, значение - массив термов без поля taxonomy. */
  terms_by_taxonomy: z.record(zId, z.array(zTermWithoutTaxonomy)),
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
 *     terms: [
 *       {
 *         id: 3,
 *         name: 'Guides',
 *         slug: 'guides',
 *         taxonomy: 'category'
 *       }
 *     ],
 *     terms_by_taxonomy: {
 *       category: [
 *         {
 *           id: 3,
 *           name: 'Guides',
 *           slug: 'guides'
 *         }
 *       ]
 *     }
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
  term_ids: z.array(z.number()),
});

/**
 * Тип данных тела запроса для привязки/отвязки/синхронизации термов.
 */
export type ZEntryTermsPayload = z.infer<typeof zEntryTermsPayload>;
