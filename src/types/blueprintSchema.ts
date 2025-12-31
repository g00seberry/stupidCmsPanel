import { z } from 'zod';
import { zCardinality, zDataType, type ZCardinality, type ZDataType } from './path/path';
import { zValidationRules } from './path/pathValidationRules';

/**
 * Тип данных поля в JSON схеме Blueprint.
 */
export type ZBlueprintSchemaField = {
  type: ZDataType;
  indexed: boolean;
  cardinality: ZCardinality;
  validation: z.infer<typeof zValidationRules> | null;
  children?: Record<string, ZBlueprintSchemaField>;
};

/**
 * Схема валидации поля в JSON схеме Blueprint.
 * Используется для описания структуры данных в схеме Blueprint.
 * Рекурсивная схема для поддержки вложенных полей.
 * @example
 * const schemaField: ZBlueprintSchemaField = {
 *   type: 'string',
 *   indexed: true,
 *   cardinality: 'one',
 *   validation: { required: true, min: 5, max: 100, pattern: '^[A-Z]' }
 * };
 */
const zBlueprintSchemaField: z.ZodType<ZBlueprintSchemaField> = z.lazy(() =>
  z.object({
    /** Тип данных поля. */
    type: zDataType,
    /** Флаг индексирования поля. */
    indexed: z.boolean(),
    /** Мощность поля: одно значение или множество. */
    cardinality: zCardinality,
    /** Правила валидации поля (JSON объект). Включает required, min, max и другие правила. */
    validation: zValidationRules.nullable(),
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
 *       indexed: true,
 *       cardinality: 'one',
 *       validation: { required: true, min: 5, max: 100 }
 *     },
 *     author: {
 *       type: 'json',
 *       indexed: false,
 *       cardinality: 'one',
 *       validation: null,
 *       children: {
 *         name: { type: 'string', indexed: false, cardinality: 'one', validation: { required: true } }
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
