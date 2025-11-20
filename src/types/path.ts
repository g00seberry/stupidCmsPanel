import { z } from 'zod';

/**
 * Схема валидации типа данных поля Path.
 * Определяет допустимые типы данных для полей в Blueprint.
 * @example
 * const dataType: ZDataType = 'string';
 */
export const zDataType = z.enum([
  'string',
  'text',
  'int',
  'float',
  'bool',
  'date',
  'datetime',
  'json',
  'ref',
]);

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

/**
 * Схема валидации вложенного объекта source_blueprint в Path.
 * Используется для представления информации об исходном Blueprint,
 * из которого было скопировано поле (для readonly полей).
 * Может быть `null`, `undefined` или отсутствовать в ответе API.
 */
const zSourceBlueprint = z
  .object({
    /** Идентификатор исходного Blueprint. */
    id: z.number(),
    /** Код исходного Blueprint. */
    code: z.string(),
    /** Название исходного Blueprint. */
    name: z.string(),
  })
  .nullish();

/**
 * Схема валидации поля Path.
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
export const zPath: z.ZodType<any> = z.object({
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
  /** Правила валидации поля в формате JSON массива. Может быть `null`. */
  validation_rules: z.array(z.any()).nullable(),
  /** Идентификатор исходного Blueprint, из которого было скопировано поле. `null` для обычных полей. */
  source_blueprint_id: z.number().nullable(),
  /** Идентификатор встраивания Blueprint, к которому относится поле. `null` для обычных полей. */
  blueprint_embed_id: z.number().nullable(),
  /** Информация об исходном Blueprint (для readonly полей). */
  source_blueprint: zSourceBlueprint,
  /** Дочерние поля (для полей типа json). Используется lazy для рекурсивной структуры. */
  children: z.array(z.lazy((): z.ZodType<any> => zPath)).optional(),
  /** Дата создания в формате ISO 8601. */
  created_at: z.string(),
  /** Дата последнего обновления в формате ISO 8601. */
  updated_at: z.string(),
});

/**
 * Тип данных поля Path.
 * Используется для представления поля в Blueprint.
 */
export type ZPath = z.infer<typeof zPath>;

/**
 * Схема валидации узла дерева Path.
 * Расширенная версия zPath с обязательной поддержкой рекурсивной структуры children.
 * Используется для представления иерархической структуры полей Blueprint.
 * @example
 * const pathTree: ZPathTreeNode = {
 *   id: 1,
 *   blueprint_id: 1,
 *   parent_id: null,
 *   name: 'author',
 *   full_path: 'author',
 *   data_type: 'json',
 *   cardinality: 'one',
 *   is_required: false,
 *   is_indexed: false,
 *   is_readonly: false,
 *   sort_order: 0,
 *   validation_rules: null,
 *   source_blueprint_id: null,
 *   blueprint_embed_id: null,
 *   source_blueprint: undefined,
 *   children: [
 *     {
 *       id: 2,
 *       name: 'name',
 *       full_path: 'author.name',
 *       data_type: 'string',
 *       // ... остальные поля
 *       children: undefined
 *     }
 *   ],
 *   created_at: '2025-01-10T12:45:00+00:00',
 *   updated_at: '2025-01-10T12:45:00+00:00'
 * };
 */
export const zPathTreeNode: z.ZodType<any> = (zPath as z.ZodObject<any>).extend({
  /** Дочерние поля с поддержкой рекурсивной структуры. */
  children: z.array(z.lazy((): z.ZodType<any> => zPathTreeNode)).optional(),
});

/**
 * Тип данных узла дерева Path.
 * Используется для представления иерархической структуры полей Blueprint.
 */
export type ZPathTreeNode = z.infer<typeof zPathTreeNode>;

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
  /** Правила валидации поля в формате JSON массива. */
  validation_rules: z.array(z.any()).optional(),
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
