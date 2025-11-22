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
 * Схема валидации правила минимального/максимального значения.
 */
const zValidationRuleMinMax = z.object({
  /** Тип правила. */
  type: z.literal('min').or(z.literal('max')),
  /** Значение правила. */
  value: z.number(),
});

/**
 * Схема валидации правила регулярного выражения.
 */
const zValidationRuleRegex = z.object({
  /** Тип правила. */
  type: z.literal('regex'),
  /** Паттерн регулярного выражения. */
  pattern: z.string(),
});

/**
 * Схема валидации правила длины.
 */
const zValidationRuleLength = z.object({
  /** Тип правила. */
  type: z.literal('length'),
  /** Минимальная длина. */
  min: z.number().optional(),
  /** Максимальная длина. */
  max: z.number().optional(),
});

/**
 * Схема валидации правила перечисления значений.
 */
const zValidationRuleEnum = z.object({
  /** Тип правила. */
  type: z.literal('enum'),
  /** Допустимые значения. */
  values: z.array(z.union([z.string(), z.number()])),
});

/**
 * Схема валидации кастомного правила валидации.
 */
const zValidationRuleCustom = z.object({
  /** Тип правила. */
  type: z.literal('custom'),
  /** Имя валидатора. */
  validator: z.string(),
  /** Сообщение об ошибке. */
  message: z.string().optional(),
});

/**
 * Схема валидации правила валидации поля Path в новом формате (объект).
 * Определяет различные типы правил валидации через discriminatedUnion.
 * @example
 * const rule: ZValidationRuleObject = { type: 'min', value: 5 };
 * const rule2: ZValidationRuleObject = { type: 'max', value: 100 };
 * const rule3: ZValidationRuleObject = { type: 'regex', pattern: '^[a-z]+$' };
 */
export const zValidationRuleObject = z.discriminatedUnion('type', [
  zValidationRuleMinMax,
  zValidationRuleRegex,
  zValidationRuleLength,
  zValidationRuleEnum,
  zValidationRuleCustom,
]);

/**
 * Тип правила валидации поля Path в новом формате (объект).
 */
export type ZValidationRuleObject = z.infer<typeof zValidationRuleObject>;

/**
 * Схема валидации правила валидации поля Path.
 * Поддерживает как новый формат (объект), так и старый формат (строка "type:value").
 * Это обеспечивает обратную совместимость с существующими данными.
 * @example
 * const rule: ZValidationRule = { type: 'min', value: 5 };
 * const rule2: ZValidationRule = 'max:100';
 * const rule3: ZValidationRule = { type: 'regex', pattern: '^[a-z]+$' };
 */
export const zValidationRule = z.union([zValidationRuleObject, z.string()]);

/**
 * Тип правила валидации поля Path.
 * Может быть объектом (новый формат) или строкой (старый формат "type:value").
 */
export type ZValidationRule = z.infer<typeof zValidationRule>;

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
 *   is_required: true,
 *   is_indexed: true,
 *   is_readonly: false,
 *   sort_order: 0,
 *   validation_rules: null,
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
  /** Флаг обязательности поля. */
  is_required: z.boolean(),
  /** Флаг индексации поля для поиска. */
  is_indexed: z.boolean(),
  /** Флаг только для чтения. `true` для полей, скопированных из встроенных Blueprint. */
  is_readonly: z.boolean(),
  /** Порядок сортировки поля среди полей одного уровня. */
  sort_order: z.number(),
  /** Правила валидации поля. Может быть `null`. */
  validation_rules: z.array(zValidationRule).nullable(),
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
 *   is_required: true,
 *   is_indexed: true,
 *   is_readonly: false,
 *   sort_order: 0,
 *   validation_rules: null,
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
 *   is_required: true,
 *   is_indexed: true,
 *   sort_order: 0
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
  /** Флаг обязательности поля. По умолчанию `false`. */
  is_required: z.boolean().default(false),
  /** Флаг индексации поля для поиска. По умолчанию `false`. */
  is_indexed: z.boolean().default(false),
  /** Порядок сортировки поля среди полей одного уровня. Минимум 0. По умолчанию 0. */
  sort_order: z.number().int().min(0, 'Минимум 0').default(0),
  /** Правила валидации поля. */
  validation_rules: z.array(zValidationRule).optional(),
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
 *   is_required: true
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
