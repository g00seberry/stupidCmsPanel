import { z } from 'zod';
import { zId } from './ZId';

/**
 * Схема валидации таксономии CMS.
 * Таксономия определяет категоризацию контента (например, категории, теги).
 * @example
 * const taxonomy: ZTaxonomy = {
 *   id: 1,
 *   label: 'Categories',
 *   hierarchical: true,
 *   options_json: {},
 *   created_at: '2025-01-10T12:00:00+00:00',
 *   updated_at: '2025-01-10T12:00:00+00:00'
 * };
 */
export const zTaxonomy = z.object({
  /** Уникальный идентификатор таксономии. */
  id: zId,
  /** Отображаемое название таксономии. */
  label: z.string(),
  /** Является ли таксономия иерархической (поддерживает вложенность). */
  hierarchical: z.boolean(),
  /** Дополнительные настройки таксономии в формате JSON. */
  options_json: z.record(z.string(), z.unknown()).nullish().default(null),
  /** Дата создания в формате ISO 8601. */
  created_at: z.string().optional(),
  /** Дата последнего обновления в формате ISO 8601. */
  updated_at: z.string().optional(),
});

/**
 * Тип данных одной таксономии.
 * Используется для представления таксономии в приложении.
 */
export type ZTaxonomy = z.infer<typeof zTaxonomy>;

/**
 * Схема валидации данных для создания или обновления таксономии.
 * @example
 * const payload: ZTaxonomyPayload = {
 *   label: 'Categories',
 *   hierarchical: false,
 *   options_json: { color: '#ffcc00' }
 * };
 */
export const zTaxonomyPayload = z.object({
  /** Отображаемое название таксономии. Не может быть пустым. */
  label: z.string().min(1),
  /** Является ли таксономия иерархической. */
  hierarchical: z.boolean(),
  /** Дополнительные настройки в формате JSON. По умолчанию пустой объект. */
  options_json: z.record(z.string(), z.unknown()).default({}),
});

/**
 * DTO для сохранения таксономии.
 * Используется при создании новой таксономии или обновлении существующей.
 */
export type ZTaxonomyPayload = z.infer<typeof zTaxonomyPayload>;

/**
 * Ответ API со списком таксономий.
 */
export const zTaxonomiesResponse = z.object({
  data: z.array(zTaxonomy),
});

/**
 * Ответ API с данными одной таксономии.
 */
export const zTaxonomyResponse = z.object({
  data: zTaxonomy,
});
