import type { ZBlueprintSchema, ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { ZEntry } from '@/types/entries';
import type { EntitySchema, FieldSchema, FormValues } from '@/types/schemaForm';

/**
 * Преобразует значение из Entry в значение для формы на основе схемы поля.
 * Рекурсивно обрабатывает вложенные структуры и массивы.
 * @param value Значение из Entry (может быть из content_json).
 * @param field Схема поля для преобразования.
 * @returns Значение в формате, соответствующем FormValues.
 */
const convertEntryValueToFormValue = (value: any, field: ZBlueprintSchemaField): any => {
  // Если значение null или undefined, возвращаем как есть
  if (value === null || value === undefined) {
    return value;
  }

  // Для json полей рекурсивно обрабатываем children
  if (field.type === 'json' && field.children) {
    if (field.cardinality === 'many') {
      // Массив json объектов
      if (Array.isArray(value)) {
        return value.map(item =>
          typeof item === 'object' && item !== null
            ? convertEntryValueToFormValue(item, field)
            : item
        );
      }
      return [];
    } else {
      // Один json объект
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const result: Record<string, any> = {};
        for (const [childName, childField] of Object.entries(field.children)) {
          result[childName] = convertEntryValueToFormValue(value[childName], childField);
        }
        return result;
      }
      return {};
    }
  }

  // Для примитивных полей с cardinality: 'many'
  if (field.cardinality === 'many') {
    if (Array.isArray(value)) {
      return value;
    }
    return [];
  }

  // Для примитивных полей с cardinality: 'one' - возвращаем значение как есть
  return value;
};

/**
 * Инициализирует значения формы из данных Entry.
 * Преобразует content_json из Entry в формат FormValues на основе схемы Blueprint.
 * @param entry Запись CMS с данными.
 * @param blueprintSchema Схема Blueprint для преобразования данных.
 * @returns Частичные значения формы для передачи в FormModel конструктор.
 * @example
 * const entry = await getEntry(1);
 * const blueprintSchema = await getBlueprintSchema(entry.blueprint.id);
 * const initialValues = initializeFormFromEntry(entry, blueprintSchema);
 * const model = new FormModel(entitySchema, initialValues);
 */
export const initializeFormFromEntry = <E extends EntitySchema>(
  entry: ZEntry,
  blueprintSchema: ZBlueprintSchema
): Partial<FormValues<E>> => {
  // Получаем content_json из Entry (это данные Blueprint)
  const contentJson = entry.content_json;

  if (!contentJson || typeof contentJson !== 'object') {
    return {};
  }

  const formValues: Record<string, any> = {};

  // Преобразуем каждое поле из content_json в формат формы
  for (const [fieldName, fieldSchema] of Object.entries(blueprintSchema.schema)) {
    const entryValue = contentJson[fieldName];
    if (entryValue !== undefined) {
      formValues[fieldName] = convertEntryValueToFormValue(entryValue, fieldSchema);
    }
  }

  return formValues as Partial<FormValues<E>>;
};
