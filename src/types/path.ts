import { z } from 'zod';

// ============================================================================
// Константы и базовые типы данных
// ============================================================================

/**
 * Допустимые типы данных для полей Path.
 */
const DATA_TYPES = [
  'string',
  'text',
  'int',
  'float',
  'bool',
  'date',
  'datetime',
  'json',
  'ref',
] as const;

/**
 * Схема валидации типа данных поля Path.
 * Определяет допустимые типы данных для полей в Blueprint.
 * @example
 * const dataType: ZDataType = 'string';
 */
export const zDataType = z.enum(DATA_TYPES);

/**
 * Тип данных поля Path.
 */
export type ZDataType = z.infer<typeof zDataType>;

/**
 * Схема валидации мощности поля Path.
 * Определяет, может ли поле содержать одно значение или множество.
 * @example
 * const cardinality: ZCardinality = 'one';
 */
export const zCardinality = z.enum(['one', 'many']);

/**
 * Тип мощности поля Path.
 */
export type ZCardinality = z.infer<typeof zCardinality>;

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
 *   field: 'content_json.start_date'
 * };
 * const rule2: ZFieldComparisonRule = {
 *   operator: '>=',
 *   value: '2024-01-01'
 * };
 */
export const zFieldComparisonRule = z.object({
  /** Оператор сравнения. */
  operator: z.enum(['>=', '<=', '>', '<', '==', '!=']),
  /** Путь к другому полю для сравнения (например, 'content_json.start_date'). */
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
 *   array_min_items: 2,
 *   array_max_items: 10,
 *   min: 3,
 *   max: 50,
 *   array_unique: true
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
  /** Минимальное количество элементов в массиве (только для cardinality: 'many'). */
  array_min_items: z.number().optional(),
  /** Максимальное количество элементов в массиве (только для cardinality: 'many'). */
  array_max_items: z.number().optional(),
  /** Требование уникальности элементов массива (только для cardinality: 'many'). */
  array_unique: z.boolean().optional(),
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

// ============================================================================
// Связанные типы
// ============================================================================

/**
 * Схема валидации вложенного объекта source_blueprint в Path.
 * Используется для представления информации об исходном Blueprint,
 * из которого было скопировано поле (для readonly полей).
 */
const zSourceBlueprint = z.object({
  /** Идентификатор исходного Blueprint. */
  id: z.number(),
  /** Код исходного Blueprint. */
  code: z.string(),
  /** Название исходного Blueprint. */
  name: z.string(),
});

/**
 * Тип вложенного объекта source_blueprint.
 */
export type ZSourceBlueprint = z.infer<typeof zSourceBlueprint>;

// ============================================================================
// Базовые схемы Path
// ============================================================================

/**
 * Базовая схема валидации поля Path без рекурсивного поля children.
 * Используется как основа для создания полных схем с рекурсией.
 * @example
 * const pathBase: ZPathBase = {
 *   id: 1,
 *   blueprint_id: 1,
 *   parent_id: null,
 *   name: 'title',
 *   full_path: 'title',
 *   data_type: 'string',
 *   cardinality: 'one',
 *   is_indexed: true,
 *   is_readonly: false,
 *   sort_order: 0,
 *   validation_rules: { required: true, min: 5, max: 500 },
 *   source_blueprint_id: null,
 *   blueprint_embed_id: null,
 *   source_blueprint: undefined,
 *   created_at: '2025-01-10T12:45:00+00:00',
 *   updated_at: '2025-01-10T12:45:00+00:00'
 * };
 */
export const zPathBase = z.object({
  /** Уникальный идентификатор поля. */
  id: z.number(),
  /** Идентификатор Blueprint, к которому принадлежит поле. */
  blueprint_id: z.number(),
  /** Идентификатор родительского поля. `null` для корневых полей. */
  parent_id: z.number().nullable(),
  /** Имя поля (URL-friendly строка). */
  name: z.string(),
  /** Полный путь поля в иерархии (например, "author.contacts.email"). */
  full_path: z.string(),
  /** Тип данных поля. */
  data_type: zDataType,
  /** Мощность поля: одно значение или множество. */
  cardinality: zCardinality,
  /** Флаг индексации поля для поиска. */
  is_indexed: z.boolean(),
  /** Флаг только для чтения. `true` для полей, скопированных из встроенных Blueprint. */
  is_readonly: z.boolean(),
  /** Порядок сортировки поля среди полей одного уровня. */
  sort_order: z.number(),
  /** Правила валидации поля. Может быть `null`. */
  validation_rules: zValidationRules.nullable(),
  /** Идентификатор исходного Blueprint, из которого было скопировано поле. `null` для обычных полей. */
  source_blueprint_id: z.number().nullable(),
  /** Идентификатор встраивания Blueprint, к которому относится поле. `null` для обычных полей. */
  blueprint_embed_id: z.number().nullable(),
  /** Информация об исходном Blueprint (для readonly полей). Может быть `null` или `undefined`. */
  source_blueprint: zSourceBlueprint.nullish(),
  /** Дата создания в формате ISO 8601. */
  created_at: z.string(),
  /** Дата последнего обновления в формате ISO 8601. */
  updated_at: z.string(),
});

/**
 * Тип базового поля Path без рекурсивного поля children.
 */
export type ZPathBase = z.infer<typeof zPathBase>;

/**
 * Схема валидации поля Path с опциональными дочерними полями.
 * Path определяет структуру одного поля в Blueprint.
 * @example
 * const path: ZPath = {
 *   id: 1,
 *   blueprint_id: 1,
 *   parent_id: null,
 *   name: 'title',
 *   full_path: 'title',
 *   data_type: 'string',
 *   cardinality: 'one',
 *   is_indexed: true,
 *   is_readonly: false,
 *   sort_order: 0,
 *   validation_rules: { required: true, min: 5, max: 500 },
 *   source_blueprint_id: null,
 *   blueprint_embed_id: null,
 *   source_blueprint: undefined,
 *   children: undefined,
 *   created_at: '2025-01-10T12:45:00+00:00',
 *   updated_at: '2025-01-10T12:45:00+00:00'
 * };
 */
export const zPath: z.ZodType<ZPathBase & { children?: ZPath[] }> = zPathBase.extend({
  /** Дочерние поля (для полей типа json). Используется lazy для рекурсивной структуры. */
  children: z.array(z.lazy((): typeof zPath => zPath)).optional(),
});

/**
 * Тип данных поля Path.
 * Используется для представления поля в Blueprint.
 */
export type ZPath = z.infer<typeof zPath>;

// ============================================================================
// DTO схемы (для создания и обновления)
// ============================================================================

/**
 * Схема валидации данных для создания нового поля Path.
 * @example
 * const createDto: ZCreatePathDto = {
 *   name: 'title',
 *   parent_id: null,
 *   data_type: 'string',
 *   cardinality: 'one',
 *   is_indexed: true,
 *   sort_order: 0,
 *   validation_rules: { required: true, min: 5, max: 500 }
 * };
 */
export const zCreatePathDto = z.object({
  /** Имя поля (URL-friendly строка). Только a-z, 0-9 и _. Минимум 1 символ, максимум 255 символов. */
  name: z
    .string()
    .min(1, 'Имя поля обязательно')
    .max(255, 'Максимум 255 символов')
    .regex(/^[a-z0-9_]+$/, 'Только a-z, 0-9 и _'),
  /** Идентификатор родительского поля. `null` для корневых полей. */
  parent_id: z.number().nullable().optional(),
  /** Тип данных поля. */
  data_type: zDataType,
  /** Мощность поля: одно значение или множество. По умолчанию 'one'. */
  cardinality: zCardinality.default('one'),
  /** Флаг индексации поля для поиска. По умолчанию `false`. */
  is_indexed: z.boolean().default(false),
  /** Порядок сортировки поля среди полей одного уровня. Минимум 0. По умолчанию 0. */
  sort_order: z.number().int().min(0, 'Минимум 0').default(0),
  /** Правила валидации поля (новый формат - объект JSON). */
  validation_rules: zValidationRules.optional().nullable(),
});

/**
 * Тип данных для создания нового поля Path.
 * Используется при отправке запроса на создание поля.
 */
export type ZCreatePathDto = z.infer<typeof zCreatePathDto>;

/**
 * Схема валидации данных для обновления поля Path.
 * Все поля опциональны - обновляются только переданные поля.
 * @example
 * const updateDto: ZUpdatePathDto = {
 *   name: 'updated_title',
 *   validation_rules: { required: true }
 * };
 */
export const zUpdatePathDto = zCreatePathDto.partial();

/**
 * Тип данных для обновления поля Path.
 * Используется при отправке запроса на обновление поля.
 */
export type ZUpdatePathDto = z.infer<typeof zUpdatePathDto>;

// ============================================================================
// API Response схемы
// ============================================================================

/**
 * Схема валидации ответа со списком полей (дерево).
 * Используется для валидации ответа API при получении списка полей.
 * @example
 * const response = await rest.get('/api/v1/admin/blueprints/1/paths');
 * const validated = zPathsResponse.parse(response.data);
 * validated.data.forEach(path => console.log(path.full_path));
 */
export const zPathsResponse = z.object({
  /** Массив узлов дерева полей. */
  data: z.array(zPath),
});

/**
 * Тип ответа со списком полей (дерево).
 */
export type ZPathsResponse = z.infer<typeof zPathsResponse>;

/**
 * Схема валидации ответа с одним полем.
 * Используется для валидации ответа API при получении одного поля.
 * @example
 * const response = await rest.get('/api/v1/admin/paths/1');
 * const validated = zPathResponse.parse(response.data);
 * console.log(validated.data.full_path);
 */
export const zPathResponse = z.object({
  /** Поле с полной информацией (включая дочерние поля, если есть). */
  data: zPath,
});

/**
 * Тип ответа с одним полем.
 */
export type ZPathResponse = z.infer<typeof zPathResponse>;
