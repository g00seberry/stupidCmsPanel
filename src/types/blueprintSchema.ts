import { z } from 'zod';
import { zCardinality, zDataType, type ZCardinality, type ZDataType, zValidationRules } from './path';

// Локальные типы для старого формата правил валидации (используются только в blueprintSchema)
const zValidationRuleMinMax = z.object({
  type: z.literal('min').or(z.literal('max')),
  value: z.number(),
});

const zValidationRuleRegex = z.object({
  type: z.literal('regex'),
  pattern: z.string(),
});

const zValidationRuleLength = z.object({
  type: z.literal('length'),
  min: z.number().optional(),
  max: z.number().optional(),
});

const zValidationRuleEnum = z.object({
  type: z.literal('enum'),
  values: z.array(z.union([z.string(), z.number()])),
});

const zValidationRuleCustom = z.object({
  type: z.literal('custom'),
  validator: z.string(),
  message: z.string().optional(),
});

const zValidationRuleObject = z.discriminatedUnion('type', [
  zValidationRuleMinMax,
  zValidationRuleRegex,
  zValidationRuleLength,
  zValidationRuleEnum,
  zValidationRuleCustom,
]);

const zValidationRule = z.union([zValidationRuleObject, z.string()]);

/**
 * Тип правила валидации для blueprintSchema (старый формат - массив правил).
 * Используется только в blueprintSchema, не в Path.
 */
export type ZValidationRule = z.infer<typeof zValidationRule>;

/**
 * Тип объекта правила валидации для blueprintSchema.
 * Используется только в blueprintSchema, не в Path.
 */
export type ZValidationRuleObject = z.infer<typeof zValidationRuleObject>;

/**
 * Тип данных поля в JSON схеме Blueprint.
 */
export type ZBlueprintSchemaField = {
  type: ZDataType;
  required: boolean;
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
 *   required: true,
 *   indexed: true,
 *   cardinality: 'one',
 *   validation: { min: 5, max: 100, pattern: '^[A-Z]' }
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
 *       required: true,
 *       indexed: true,
 *       cardinality: 'one',
 *       validation: { min: 5, max: 100 }
 *     },
 *     author: {
 *       type: 'json',
 *       required: false,
 *       indexed: false,
 *       cardinality: 'one',
 *       validation: null,
 *       children: {
 *         name: { type: 'string', required: true, indexed: false, cardinality: 'one', validation: null }
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
