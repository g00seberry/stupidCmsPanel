import { z } from 'zod';
import type { FieldNode, JsonFieldNode, ScalarFieldNode } from '../types/formField';
import { t } from './i18n';

/**
 * Применяет правила валидации к Zod-схеме на основе validation_rules из FieldNode.
 * @param schema Базовая Zod-схема.
 * @param node Узел поля формы.
 * @returns Zod-схема с применёнными правилами валидации.
 */
const applyValidationRules = <T extends z.ZodTypeAny>(schema: T, node: FieldNode): T => {
  const validationRules = node.ui?.validationRules;
  if (!validationRules || !Array.isArray(validationRules)) {
    return schema;
  }

  let result = schema;

  for (const rule of validationRules) {
    if (typeof rule === 'object' && rule.type) {
      switch (rule.type) {
        case 'min':
          if (typeof rule.value === 'number') {
            if (node.dataType === 'string' || node.dataType === 'text') {
              result = (result as z.ZodString).min(
                rule.value,
                t('blueprint.field.minLength', { min: String(rule.value) })
              ) as T;
            } else if (node.dataType === 'int' || node.dataType === 'float') {
              result = (result as z.ZodNumber).min(
                rule.value,
                t('blueprint.field.minValue', { min: String(rule.value) })
              ) as T;
            } else if (node.dataType === 'date' || node.dataType === 'datetime') {
              // Для дат min/max не применяются напрямую
            }
          }
          break;
        case 'max':
          if (typeof rule.value === 'number') {
            if (node.dataType === 'string' || node.dataType === 'text') {
              result = (result as z.ZodString).max(
                rule.value,
                t('blueprint.field.maxLength', { max: String(rule.value) })
              ) as T;
            } else if (node.dataType === 'int' || node.dataType === 'float') {
              result = (result as z.ZodNumber).max(
                rule.value,
                t('blueprint.field.maxValue', { max: String(rule.value) })
              ) as T;
            }
          }
          break;
        case 'regex':
          if (typeof rule.pattern === 'string') {
            try {
              const regex = new RegExp(rule.pattern);
              result = (result as z.ZodString).regex(regex, t('blueprint.field.invalidFormat')) as T;
            } catch {
              // Игнорируем невалидные regex
            }
          }
          break;
        case 'length':
          if (typeof rule.min === 'number') {
            if (node.dataType === 'string' || node.dataType === 'text') {
              result = (result as z.ZodString).min(
                rule.min,
                t('blueprint.field.minLength', { min: String(rule.min) })
              ) as T;
            }
          }
          if (typeof rule.max === 'number') {
            if (node.dataType === 'string' || node.dataType === 'text') {
              result = (result as z.ZodString).max(
                rule.max,
                t('blueprint.field.maxLength', { max: String(rule.max) })
              ) as T;
            }
          }
          break;
        case 'enum':
          if (Array.isArray(rule.values)) {
            // Для enum создаём union из допустимых значений
            const enumValues = rule.values as Array<string | number>;
            if (enumValues.length > 0) {
              result = z.union(
                enumValues.map(val => (typeof val === 'string' ? z.literal(val) : z.literal(val))) as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]
              ) as T;
            }
          }
          break;
      }
    }
  }

  return result;
};

/**
 * Строит Zod-схему для скалярного поля.
 * @param node Узел скалярного поля.
 * @returns Zod-схема для скалярного поля.
 */
const buildScalarSchema = (node: ScalarFieldNode): z.ZodTypeAny => {
  let schema: z.ZodTypeAny;

  switch (node.dataType) {
    case 'string':
    case 'text':
      schema = z.string();
      break;
    case 'int':
      schema = z.number().int(t('blueprint.field.mustBeInteger'));
      break;
    case 'float':
      schema = z.number(t('blueprint.field.mustBeNumber'));
      break;
    case 'bool':
      schema = z.boolean();
      break;
    case 'date':
      schema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, t('blueprint.field.invalidDate'));
      break;
    case 'datetime':
      schema = z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, t('blueprint.field.invalidDateTime'));
      break;
    case 'ref':
      schema = z.union([z.string(), z.number()]);
      break;
    default:
      schema = z.unknown();
  }

  // Применяем правила валидации
  schema = applyValidationRules(schema, node);

  // Применяем required/optional
  if (node.required) {
    return schema;
  }
  return schema.optional().nullable();
};

/**
 * Строит Zod-схему для json-группы (вложенного объекта).
 * @param node Узел json-группы.
 * @returns Zod-схема для json-группы.
 */
const buildJsonSchema = (node: JsonFieldNode): z.ZodTypeAny => {
  const shape: Record<string, z.ZodTypeAny> = {};

  // Рекурсивно строим схемы для дочерних полей
  for (const child of node.children) {
    const childSchema = buildFieldSchema(child);
    shape[child.name] = childSchema;
  }

  let schema = z.object(shape);

  // Применяем required/optional
  if (node.required) {
    return schema;
  }
  return schema.optional().nullable();
};

/**
 * Строит Zod-схему для одного поля.
 * @param node Узел поля формы.
 * @returns Zod-схема для поля.
 */
const buildFieldSchema = (node: FieldNode): z.ZodTypeAny => {
  let schema: z.ZodTypeAny;

  if (node.dataType === 'json') {
    schema = buildJsonSchema(node);
  } else {
    schema = buildScalarSchema(node);
  }

  // Применяем cardinality (массивы)
  if (node.cardinality === 'many') {
    // Получаем minItems и maxItems из validation_rules
    const validationRules = node.ui?.validationRules;
    let minItems: number | undefined;
    let maxItems: number | undefined;

    if (Array.isArray(validationRules)) {
      for (const rule of validationRules) {
        if (typeof rule === 'object' && rule.type === 'length') {
          if (typeof rule.min === 'number') {
            minItems = rule.min;
          }
          if (typeof rule.max === 'number') {
            maxItems = rule.max;
          }
        }
      }
    }

    let arraySchema = z.array(schema);
    if (minItems !== undefined) {
      arraySchema = arraySchema.min(minItems, t('blueprint.field.minItems', { min: String(minItems) }));
    }
    if (maxItems !== undefined) {
      arraySchema = arraySchema.max(maxItems, t('blueprint.field.maxItems', { max: String(maxItems) }));
    }

    // Для массивов required означает, что массив должен существовать (может быть пустым)
    if (node.required) {
      return arraySchema;
    }
    return arraySchema.optional().nullable();
  }

  return schema;
};

/**
 * Строит Zod-схему для формы на основе массива полей FieldNode.
 * Генерирует схему объекта, где ключи - это имена полей, а значения - их Zod-схемы.
 * @param nodes Массив узлов полей формы.
 * @returns Zod-схема для всей формы.
 * @example
 * const schema = buildZodSchemaFromPaths(fieldNodes);
 * const result = schema.parse(formData);
 */
export const buildZodSchemaFromPaths = (nodes: FieldNode[]): z.ZodObject<Record<string, z.ZodTypeAny>> => {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const node of nodes) {
    shape[node.name] = buildFieldSchema(node);
  }

  return z.object(shape);
};

