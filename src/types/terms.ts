import { z } from 'zod';
import { zId } from '@/types/ZId';
import { zPaginatedResponse } from '@/types/pagination';

/**
 * Базовая схема валидации термина таксономии CMS.
 * Термин представляет собой конкретное значение внутри таксономии (например, "Guides" в таксономии "Categories").
 * @example
 * const term: ZTerm = {
 *   id: 3,
 *   taxonomy: 1,
 *   name: 'Guides',
 *   parent_id: null,
 *   meta_json: {},
 *   created_at: '2025-01-10T12:00:00+00:00',
 *   updated_at: '2025-01-10T12:00:00+00:00',
 *   deleted_at: null
 * };
 */
const zTermBase = z.object({
  /** Уникальный идентификатор термина. */
  id: zId,
  /** ID таксономии, к которой принадлежит термин. */
  taxonomy: zId,
  /** Отображаемое название термина. */
  name: z.string(),
  /** ID родительского термина для иерархических таксономий. `null` для корневых терминов. */
  parent_id: zId.nullable().optional(),
  /** Дополнительные метаданные термина в формате JSON. */
  meta_json: z.unknown(),
  /** Дата создания в формате ISO 8601. */
  created_at: z.string().optional(),
  /** Дата последнего обновления в формате ISO 8601. */
  updated_at: z.string().optional(),
  /** Дата удаления (soft delete) в формате ISO 8601. `null` если термин не удалён. */
  deleted_at: z.string().nullable().optional(),
});

/**
 * Схема валидации термина таксономии CMS.
 */
export const zTerm = zTermBase;

/**
 * Схема валидации термина с вложенными дочерними терминами (для tree response).
 * Используется только в ответах эндпоинта `/tree`.
 * @example
 * const termTree: ZTermTree = {
 *   id: 1,
 *   taxonomy: 1,
 *   name: 'Технологии',
 *   parent_id: null,
 *   children: [
 *     {
 *       id: 2,
 *       taxonomy: 1,
 *       name: 'Laravel',
 *       parent_id: 1,
 *       children: []
 *     }
 *   ],
 *   meta_json: {},
 *   created_at: '2025-01-10T12:00:00+00:00',
 *   updated_at: '2025-01-10T12:00:00+00:00'
 * };
 */
export const zTermTree: z.ZodType<any> = zTermBase.extend({
  /** Массив дочерних терминов. Присутствует только в ответах эндпоинта `/tree`. */
  children: z.lazy(() => z.array(zTermTree)).default([]),
});

/**
 * Тип данных одного термина.
 * Используется для представления термина в приложении.
 */
export type ZTerm = z.infer<typeof zTerm>;

/**
 * Тип данных термина с вложенными дочерними терминами.
 * Используется для представления дерева терминов.
 */
export type ZTermTree = ZTerm & {
  /** Массив дочерних терминов. Присутствует только в ответах эндпоинта `/tree`. */
  children: ZTermTree[];
};

/**
 * Схема валидации данных для создания или обновления термина.
 * @example
 * const payload: ZTermPayload = {
 *   name: 'Guides',
 *   parent_id: 1,
 *   meta_json: { color: '#ffcc00' }
 * };
 */
export const zTermPayload = z.object({
  /** Отображаемое название термина. Не может быть пустым. */
  name: z.string().min(1),
  /** ID родительского термина для иерархических таксономий. `null` для корневых терминов. */
  parent_id: zId.nullable().optional(),
  /** Дополнительные метаданные в формате JSON. По умолчанию пустой объект. */
  meta_json: z.unknown(),
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
  /** Поиск по имени. */
  q?: string;
  /** Сортировка. Values: created_at.desc,created_at.asc,name.asc,name.desc. Default: created_at.desc. */
  sort?: string;
  /** Размер страницы (10-100). Default: 15. */
  per_page?: number;
  /** Номер страницы (>=1). По умолчанию: 1. */
  page?: number;
};

/**
 * Ответ API со списком терминов. PAGED
 */
export const zTermsResponse = zPaginatedResponse(zTerm);

/**
 * Ответ API с данными одного термина.
 */
export const zTermResponse = z.object({
  data: zTerm,
});

/**
 * Ответ API с деревом терминов (для эндпоинта `/tree`).
 */
export const zTermsTreeResponse = z.object({
  /** Массив корневых терминов с вложенными дочерними терминами. */
  data: z.array(zTermTree),
});
