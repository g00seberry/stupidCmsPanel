import type { ZBlueprintSchema, ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { ZValidationRule, ZValidationRuleObject } from '@/types/path';
import type { EntitySchema, FieldSchema, ValidationSpec } from '@/types/schemaForm';

/**
 * Преобразует строковое правило валидации в ValidationSpec.
 * Поддерживает формат "type:value" (старый формат).
 * @param rule Строковое правило валидации.
 * @returns ValidationSpec или null, если формат не распознан.
 * @example
 * parseStringValidationRule('min:5')
 * // { type: 'min', value: 5 }
 * parseStringValidationRule('max:100')
 * // { type: 'max', value: 100 }
 */
const parseStringValidationRule = (rule: string): ValidationSpec | null => {
  const parts = rule.split(':');
  if (parts.length !== 2) {
    return null;
  }

  const [type, valueStr] = parts;
  const typeMap: Record<string, ValidationSpec['type']> = {
    min: 'min',
    max: 'max',
    regex: 'regex',
    enum: 'enum',
    custom: 'custom',
  };

  const validationType = typeMap[type];
  if (!validationType) {
    return null;
  }

  // Пытаемся преобразовать значение в число, если это не regex
  let value: any = valueStr;
  if (validationType === 'min' || validationType === 'max') {
    const numValue = Number(valueStr);
    if (!isNaN(numValue)) {
      value = numValue;
    }
  }

  return {
    type: validationType,
    value,
  };
};

/**
 * Преобразует ZValidationRule в ValidationSpec.
 * Обрабатывает как объектный формат (ZValidationRuleObject), так и строковый.
 * @param rule Правило валидации из API.
 * @returns ValidationSpec или null, если правило не может быть преобразовано.
 * @example
 * convertValidationRule({ type: 'min', value: 5 })
 * // { type: 'min', value: 5 }
 * convertValidationRule({ type: 'regex', pattern: '^[a-z]+$' })
 * // { type: 'regex', value: '^[a-z]+$' }
 * convertValidationRule('min:5')
 * // { type: 'min', value: 5 }
 */
const convertValidationRule = (rule: ZValidationRule): ValidationSpec | null => {
  // Если это строка, парсим её
  if (typeof rule === 'string') {
    return parseStringValidationRule(rule);
  }

  // Если это объект, обрабатываем по типу
  const ruleObj = rule as ZValidationRuleObject;

  switch (ruleObj.type) {
    case 'min':
    case 'max':
      return {
        type: ruleObj.type,
        value: ruleObj.value,
      };

    case 'regex':
      return {
        type: 'regex',
        value: ruleObj.pattern,
      };

    case 'length':
      // length преобразуем в min/max, если указаны
      // Если указан только min, создаём min правило
      // Если указан только max, создаём max правило
      // Если указаны оба, создаём два правила (но возвращаем только одно - min)
      // В реальности лучше вернуть массив, но для упрощения возвращаем min
      if (ruleObj.min !== undefined) {
        return {
          type: 'min',
          value: ruleObj.min,
        };
      }
      if (ruleObj.max !== undefined) {
        return {
          type: 'max',
          value: ruleObj.max,
        };
      }
      return null;

    case 'enum':
      return {
        type: 'enum',
        value: ruleObj.values,
      };

    case 'custom':
      return {
        type: 'custom',
        validatorKey: ruleObj.validator,
        message: ruleObj.message,
      };

    default:
      return null;
  }
};

/**
 * Преобразует массив ZValidationRule в массив ValidationSpec.
 * Фильтрует невалидные правила.
 * @param rules Массив правил валидации из API.
 * @returns Массив ValidationSpec.
 */
const convertValidationRules = (rules: ZValidationRule[]): ValidationSpec[] => {
  return rules
    .map(rule => convertValidationRule(rule))
    .filter((spec): spec is ValidationSpec => spec !== null);
};

/**
 * Преобразует поле схемы Blueprint в FieldSchema.
 * Рекурсивно обрабатывает вложенные поля для типа json.
 * @param _fieldName Имя поля (не используется, но передается для совместимости).
 * @param field Поле схемы Blueprint из API.
 * @returns FieldSchema для формы.
 * @example
 * const fieldSchema = convertSchemaField('title', {
 *   type: 'string',
 *   required: true,
 *   indexed: true,
 *   cardinality: 'one',
 *   validation: []
 * });
 */
const convertSchemaField = (_fieldName: string, field: ZBlueprintSchemaField): FieldSchema => {
  const fieldSchema: FieldSchema = {
    type: field.type,
    required: field.required,
    indexed: field.indexed,
    cardinality: field.cardinality,
    validation: convertValidationRules(field.validation),
  };

  // Для json полей рекурсивно обрабатываем children
  if (field.children) {
    const children: Record<string, FieldSchema> = {};
    for (const [childName, childField] of Object.entries(field.children)) {
      children[childName] = convertSchemaField(childName, childField);
    }
    fieldSchema.children = children;
  }

  return fieldSchema;
};

/**
 * Преобразует JSON схему Blueprint в EntitySchema для формы.
 * Конвертирует структуру данных из API в формат, используемый FormModel.
 * @param blueprintSchema JSON схема Blueprint из API.
 * @returns EntitySchema для использования в форме.
 * @example
 * const blueprintSchema = await getBlueprintSchema(1);
 * const entitySchema = convertBlueprintSchemaToEntitySchema(blueprintSchema);
 * const model = new FormModel(entitySchema);
 */
export const convertBlueprintSchemaToEntitySchema = (
  blueprintSchema: ZBlueprintSchema
): EntitySchema => {
  const schema: Record<string, FieldSchema> = {};

  for (const [fieldName, field] of Object.entries(blueprintSchema.schema)) {
    schema[fieldName] = convertSchemaField(fieldName, field);
  }

  return {
    schema,
  };
};
