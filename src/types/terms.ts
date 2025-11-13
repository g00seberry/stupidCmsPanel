import { z } from 'zod';
import { zPaginationLinks, zPaginationMeta } from '@/types/pagination';

/**
 * Схема валидации термина таксономии CMS.
 * Термин представляет собой конкретное значение внутри таксономии (например, "Guides" в таксономии "Categories").
 * @example
 * const term: ZTerm = {
 *   id: 3,
 *   taxonomy: 'category',
 *   name: 'Guides',
 *   slug: 'guides',
 *   meta_json: {},
 *   created_at: '2025-01-10T12:00:00+00:00',
 *   updated_at: '2025-01-10T12:00:00+00:00',
 *   deleted_at: null
 * };
 */
export const zTerm = z.object({
  /** Уникальный идентификатор термина. */
  id: z.number(),
  /** Slug таксономии, к которой принадлежит термин. */
  taxonomy: z.string(),
  /** Отображаемое название термина. */
  name: z.string(),
  /** URL-friendly идентификатор термина. */
  slug: z.string(),
  /** Дополнительные метаданные термина в формате JSON. */
  meta_json: z.record(z.string(), z.unknown()).nullish().default(null),
  /** Дата создания в формате ISO 8601. */
  created_at: z.string().optional(),
  /** Дата последнего обновления в формате ISO 8601. */
  updated_at: z.string().optional(),
  /** Дата удаления (soft delete) в формате ISO 8601. `null` если термин не удалён. */
  deleted_at: z.string().nullable().optional(),
});

/**
 * Тип данных одного термина.
 * Используется для представления термина в приложении.
 */
export type ZTerm = z.infer<typeof zTerm>;

/**
 * Схема валидации данных для создания или обновления термина.
 * @example
 * const payload: ZTermPayload = {
 *   name: 'Guides',
 *   slug: 'guides',
 *   meta_json: { color: '#ffcc00' }
 * };
 */
export const zTermPayload = z.object({
  /** Отображаемое название термина. Не может быть пустым. */
  name: z.string().min(1),
  /** URL-friendly идентификатор термина. Не может быть пустым. */
  slug: z.string().min(1),
  /** Дополнительные метаданные в формате JSON. По умолчанию пустой объект. */
  meta_json: z.record(z.string(), z.unknown()).default({}),
  /** ID записи, к которой нужно привязать термин при создании. */
  attach_entry_id: z.number().optional(),
});

/**
 * DTO для сохранения термина.
 * Используется при создании нового термина или обновлении существующего.
 */
export type ZTermPayload = z.infer<typeof zTermPayload>;

/**
 * Параметры запроса списка терминов.
 */
export type ListTermsParams = {
  /** Поиск по имени/slug. */
  q?: string;
  /** Сортировка. Values: created_at.desc,created_at.asc,name.asc,name.desc,slug.asc,slug.desc. Default: created_at.desc. */
  sort?: string;
  /** Размер страницы (10-100). Default: 15. */
  per_page?: number;
  /** Номер страницы (>=1). По умолчанию: 1. */
  page?: number;
};

/**
 * Ответ API со списком терминов.
 */
export const zTermsResponse = z.object({
  /** Массив терминов. */
  data: z.array(zTerm),
  /** Ссылки пагинации. */
  links: zPaginationLinks,
  /** Метаданные пагинации. */
  meta: zPaginationMeta,
});

/**
 * Ответ API с данными одного термина.
 */
export const zTermResponse = z.object({
  data: zTerm,
});

