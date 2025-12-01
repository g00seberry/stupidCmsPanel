import type { ZBlueprintSchema, ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { FormValues } from './types';

/**
 * Создаёт значение по умолчанию для поля на основе его типа.
 * @param field Схема поля.
 * @returns Значение по умолчанию для поля.
 * @example
 * getDefaultFieldValue({ type: 'string', ... }); // ''
 * getDefaultFieldValue({ type: 'float', ... }); // 0
 * getDefaultFieldValue({ type: 'bool', ... }); // false
 */
const getDefaultFieldValue = (field: ZBlueprintSchemaField): any => {
  switch (field.type) {
    case 'string':
    case 'text':
    case 'datetime':
      return '';
    case 'int':
    case 'float':
      return 0;
    case 'bool':
      return false;
    case 'ref':
      return null;
    case 'json':
      // Для json полей создаём объект из children
      if (field.children) {
        return createDefaultValuesFromSchema(field.children);
      }
      return {};
    default:
      return null;
  }
};

/**
 * Создаёт значения по умолчанию из схемы полей.
 * Рекурсивно обрабатывает все поля, включая вложенные json поля.
 * @param schema Объект с полями схемы.
 * @returns Объект со значениями по умолчанию.
 * @example
 * const schema = {
 *   title: { type: 'string', cardinality: 'one', ... },
 *   tags: { type: 'string', cardinality: 'many', ... },
 *   author: {
 *     type: 'json',
 *     cardinality: 'one',
 *     children: {
 *       name: { type: 'string', cardinality: 'one', ... }
 *     }
 *   }
 * };
 * createDefaultValuesFromSchema(schema);
 * // { title: '', tags: [], author: { name: '' } }
 */
const createDefaultValuesFromSchema = (
  schema: Record<string, ZBlueprintSchemaField>
): Record<string, any> => {
  const values: Record<string, any> = {};

  for (const [fieldName, field] of Object.entries(schema)) {
    const defaultValue = getDefaultFieldValue(field);

    if (field.cardinality === 'many') {
      values[fieldName] = [];
    } else {
      values[fieldName] = defaultValue;
    }
  }

  return values;
};

/**
 * Рекурсивно объединяет начальные значения со значениями по умолчанию.
 * Приоритет отдаётся начальным значениям, если они указаны.
 * @param schema Объект с полями схемы.
 * @param initial Начальные значения (частичные).
 * @returns Объект со значениями, объединяющий defaults и initial.
 */
const mergeWithInitial = (
  schema: Record<string, ZBlueprintSchemaField>,
  initial?: Record<string, any>
): Record<string, any> => {
  const defaults = createDefaultValuesFromSchema(schema);
  const result: Record<string, any> = { ...defaults };

  if (!initial) {
    return result;
  }

  // Рекурсивно объединяем начальные значения
  for (const [fieldName, field] of Object.entries(schema)) {
    if (fieldName in initial) {
      const initialValue = initial[fieldName];

      // Если это json поле с children, рекурсивно объединяем
      if (
        field.type === 'json' &&
        field.children &&
        typeof initialValue === 'object' &&
        initialValue !== null &&
        !Array.isArray(initialValue)
      ) {
        result[fieldName] = mergeWithInitial(field.children, initialValue);
      } else {
        // Для массивов и примитивов просто используем начальное значение
        result[fieldName] = initialValue;
      }
    }
  }

  return result;
};

/**
 * Создаёт значения по умолчанию для формы на основе схемы сущности.
 * Рекурсивно обходит схему и создаёт значения по умолчанию для всех полей,
 * учитывая их типы и cardinality. Объединяет с начальными значениями, если они указаны.
 * @param schema Схема сущности.
 * @param initial Опциональные начальные значения (частичные).
 * @returns Значения формы с заполненными значениями по умолчанию.
 * @example
 * const schema: EntitySchema = {
 *   schema: {
 *     title: { type: 'string', cardinality: 'one', indexed: true, validation: { required: true } },
 *     price: { type: 'float', cardinality: 'one', indexed: true, validation: { required: true } },
 *     tags: { type: 'string', cardinality: 'many', indexed: true, validation: null }
 *   }
 * };
 * const values = createDefaultValues(schema);
 * // { title: '', price: 0, tags: [] }
 * const valuesWithInitial = createDefaultValues(schema, { title: 'Product' });
 * // { title: 'Product', price: 0, tags: [] }
 */
export const createDefaultValues = (
  schema: ZBlueprintSchema,
  initial?: Partial<FormValues>
): FormValues => {
  return mergeWithInitial(schema.schema, initial as Record<string, any>) as FormValues;
};
