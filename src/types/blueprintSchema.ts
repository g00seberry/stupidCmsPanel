import { z } from 'zod';
import {
  zCardinality,
  zDataType,
  zValidationRule,
  type ZCardinality,
  type ZDataType,
  type ZValidationRule,
} from './path';

/**
 * Тип данных поля в JSON схеме Blueprint.
 */
export type ZBlueprintSchemaField = {
  type: ZDataType;
  required: boolean;
  indexed: boolean;
  cardinality: ZCardinality;
  validation: ZValidationRule[];
  children?: Record<string, ZBlueprintSchemaField>;
};

/**
 * Схема валидации поля в JSON схеме Blueprint.
 * Используется для описания структуры данных в схеме Blueprint.
 * Рекурсивная схема для поддержки вложенных полей.
 * @example
 * const schemaField: ZBlueprintSchemaField = {
 *   type: 'string',
 *   required: true,
 *   indexed: true,
 *   cardinality: 'one',
 *   validation: []
 * };
 */
const zBlueprintSchemaField: z.ZodType<ZBlueprintSchemaField> = z.lazy(() =>
  z.object({
    /** Тип данных поля. */
    type: zDataType,
    /** Флаг обязательности поля. */
    required: z.boolean(),
    /** Флаг индексирования поля. */
    indexed: z.boolean(),
    /** Мощность поля: одно значение или множество. */
    cardinality: zCardinality,
    /** Правила валидации поля (JSON объект). */
    validation: z.array(zValidationRule),
    /** Вложенные поля (только для типа json). */
    children: z.record(z.string(), zBlueprintSchemaField).optional(),
  })
);

/**
 * Схема валидации JSON схемы Blueprint.
 * Представляет иерархическую структуру полей Blueprint.
 * @example
 * const schema: ZBlueprintSchema = {
 *   schema: {
 *     title: {
 *       type: 'string',
 *       required: true,
 *       indexed: true,
 *       cardinality: 'one',
 *       validation: []
 *     },
 *     author: {
 *       type: 'json',
 *       required: false,
 *       indexed: false,
 *       cardinality: 'one',
 *       validation: [],
 *       children: {
 *         name: { type: 'string', required: true, indexed: false, cardinality: 'one', validation: [] }
 *       }
 *     }
 *   }
 * };
 */
export const zBlueprintSchema = z.object({
  /** Объект с полями схемы, где ключ - имя поля, значение - описание поля. */
  schema: z.record(z.string(), zBlueprintSchemaField),
});

/**
 * Тип данных JSON схемы Blueprint.
 */
export type ZBlueprintSchema = z.infer<typeof zBlueprintSchema>;
