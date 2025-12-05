import { z } from 'zod';
import { zId } from './ZId';

/**
 * Схема валидации вложенного объекта blueprint в BlueprintEmbed.
 * Используется для представления информации о Blueprint, в который встроен другой Blueprint.
 */
const zBlueprintInfo = z
  .object({
    /** Идентификатор Blueprint. */
    id: zId,
    /** Код Blueprint. */
    code: z.string(),
    /** Название Blueprint. */
    name: z.string(),
  })
  .optional();

/**
 * Схема валидации вложенного объекта embedded_blueprint в BlueprintEmbed.
 * Используется для представления информации о встроенном Blueprint.
 */
const zEmbeddedBlueprintInfo = z
  .object({
    /** Идентификатор встроенного Blueprint. */
    id: zId,
    /** Код встроенного Blueprint. */
    code: z.string(),
    /** Название встроенного Blueprint. */
    name: z.string(),
  })
  .optional();

/**
 * Схема валидации вложенного объекта host_path в BlueprintEmbed.
 * Используется для представления информации о поле, в которое встроен Blueprint.
 */
const zHostPathInfo = z
  .object({
    /** Идентификатор поля-хозяина. */
    id: zId,
    /** Имя поля-хозяина. */
    name: z.string(),
    /** Полный путь поля-хозяина. */
    full_path: z.string(),
  })
  .nullable()
  .optional();

/**
 * Схема валидации встраивания Blueprint.
 * BlueprintEmbed представляет связь между двумя Blueprint, где один встроен в другой.
 * @example
 * const embed: ZBlueprintEmbed = {
 *   id: 1,
 *   blueprint_id: 1,
 *   embedded_blueprint_id: 2,
 *   host_path_id: 5,
 *   blueprint: {
 *     id: 1,
 *     code: 'company',
 *     name: 'Company'
 *   },
 *   embedded_blueprint: {
 *     id: 2,
 *     code: 'address',
 *     name: 'Address'
 *   },
 *   host_path: {
 *     id: 5,
 *     name: 'office',
 *     full_path: 'office'
 *   },
 *   created_at: '2025-01-10T12:45:00+00:00',
 *   updated_at: '2025-01-10T12:45:00+00:00'
 * };
 */
export const zBlueprintEmbed = z.object({
  /** Уникальный идентификатор встраивания. */
  id: zId,
  /** Идентификатор Blueprint, в который встроен другой Blueprint. */
  blueprint_id: zId,
  /** Идентификатор встроенного Blueprint. */
  embedded_blueprint_id: zId,
  /** Идентификатор поля-хозяина, в которое встроен Blueprint. `null` для корневого встраивания. */
  host_path_id: zId.nullable(),
  /** Информация о Blueprint-хозяине (в который встроен другой Blueprint). */
  blueprint: zBlueprintInfo,
  /** Информация о встроенном Blueprint. */
  embedded_blueprint: zEmbeddedBlueprintInfo,
  /** Информация о поле-хозяине, в которое встроен Blueprint. `null` для корневого встраивания. */
  host_path: zHostPathInfo,
  /** Дата создания в формате ISO 8601. */
  created_at: z.string(),
  /** Дата последнего обновления в формате ISO 8601. */
  updated_at: z.string(),
});

/**
 * Тип данных встраивания Blueprint.
 * Используется для представления связи между Blueprint в приложении.
 */
export type ZBlueprintEmbed = z.infer<typeof zBlueprintEmbed>;
