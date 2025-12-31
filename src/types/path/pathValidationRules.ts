// ============================================================================
// Правила валидации
// ============================================================================
/**
 * Схема валидации условного правила.
 * Используется для правил required_if, prohibited_unless, required_unless, prohibited_if.
 * Поддерживается только расширенный формат (объект).
 * @example
 * const rule: ZConditionalRule = { field: 'is_published', value: true, operator: '==' };
 */

import z from 'zod';

export const zConditionalRule = z.object({
  /** Путь к полю для проверки условия (например, 'is_published'). */
  field: z.string(),
  /** Значение для сравнения. */
  value: z.any().optional(),
  /** Оператор сравнения. По умолчанию '=='. */
  operator: z.enum(['==', '!=', '>', '<', '>=', '<=']).optional(),
});
/**
 * Тип условного правила валидации.
 */

export type ZConditionalRule = z.infer<typeof zConditionalRule>;
/**
 * Схема валидации правила сравнения полей.
 * @example
 * const rule: ZFieldComparisonRule = {
 *   operator: '>=',
 *   field: 'data_json.start_date'
 * };
 * const rule2: ZFieldComparisonRule = {
 *   operator: '>=',
 *   value: '2024-01-01'
 * };
 */

export const zFieldComparisonRule = z.object({
  /** Оператор сравнения. */
  operator: z.enum(['>=', '<=', '>', '<', '==', '!=']),
  /** Путь к другому полю для сравнения (например, 'data_json.start_date'). */
  field: z.string().optional(),
  /** Константное значение для сравнения. */
  value: z.any().optional(),
});
/**
 * Тип правила сравнения полей.
 */

export type ZFieldComparisonRule = z.infer<typeof zFieldComparisonRule>;
/**
 * Схема валидации правил валидации поля Path (новый формат).
 * Согласно документации blueprint-validation-frontend.md, validation_rules - это объект JSON
 * с различными правилами валидации.
 * @example
 * const rules: ZValidationRules = {
 *   required: true,
 *   min: 5,
 *   max: 500,
 *   pattern: '/^[A-Z]/'
 * };
 * const arrayRules: ZValidationRules = {
 *   min: 3,
 *   max: 50,
 *   distinct: true
 * };
 * const conditionalRules: ZValidationRules = {
 *   required_if: { field: 'is_published', value: true, operator: '==' }
 * };
 */

export const zValidationRules = z.object({
  /** Флаг обязательности поля. */
  required: z.boolean().optional(),
  /** Минимальное значение или длина. */
  min: z.number().optional(),
  /** Максимальное значение или длина. */
  max: z.number().optional(),
  /** Регулярное выражение для валидации строки. */
  pattern: z.string().optional(),
  /** Требование уникальности элементов массива (только для cardinality: 'many'). */
  distinct: z.boolean().optional(),
  /** Поле обязательно, если условие выполнено. */
  required_if: zConditionalRule.optional(),
  /** Поле запрещено, если условие не выполнено. */
  prohibited_unless: zConditionalRule.optional(),
  /** Поле обязательно, если условие не выполнено. */
  required_unless: zConditionalRule.optional(),
  /** Поле запрещено, если условие выполнено. */
  prohibited_if: zConditionalRule.optional(),
  /** Правило сравнения полей. */
  field_comparison: zFieldComparisonRule.optional(),
});
/**
 * Тип правил валидации поля Path (новый формат).
 * Используется для настройки валидации полей в Blueprint.
 */

export type ZValidationRules = z.infer<typeof zValidationRules>;
