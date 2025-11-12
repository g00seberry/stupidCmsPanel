import { zPaginationLinks, zPaginationMeta } from '@/types/pagination';
import { z } from 'zod';

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
