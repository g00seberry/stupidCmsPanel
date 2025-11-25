// getPropsFormConfig.ts
import { z } from 'zod';
import { type EditComponentName, getPropsSchemaByName } from './editPropsSchemas';

export type FieldPrimitiveType = 'string' | 'number' | 'boolean';

export interface FormFieldConfig {
  name: string; // имя ключа в props (label, placeholder, min, ...)
  type: FieldPrimitiveType; // базовый тип для выбора input-компонента
  label: string; // подпись в форме
  helperText?: string; // подсказка под полем
  required: boolean; // обязательность
}

// 'Label|Название поля|Введите label' → { key, label, helper }
export function parseDescription(desc?: string) {
  if (!desc) return { key: '', label: '', helper: '' };
  const [key, label, helper] = desc.split('|');
  return {
    key: key?.trim() ?? '',
    label: label?.trim() ?? '',
    helper: helper?.trim() ?? '',
  };
}

/**
 * Генерация описания полей формы для props компонента по его name.
 * Использует публичный API z.toJSONSchema, без обращения к ._def/.def.
 */
export function getPropsFormConfig(name: EditComponentName): FormFieldConfig[] {
  const propsSchema = getPropsSchemaByName(name);

  // Преобразуем схему props в JSON Schema
  const json = z.toJSONSchema(propsSchema) as {
    properties?: Record<string, { type?: string; description?: string }>;
    required?: string[];
  };

  const properties = json.properties ?? {};
  const requiredSet = new Set(json.required ?? []);

  return Object.entries(properties).map(([fieldName, node]) => {
    const desc = typeof node.description === 'string' ? node.description : undefined;
    const { label, helper } = parseDescription(desc);

    let type: FieldPrimitiveType = 'string';
    if (node.type === 'boolean') type = 'boolean';
    else if (node.type === 'number' || node.type === 'integer') type = 'number';

    return {
      name: fieldName,
      type,
      label: label || fieldName,
      helperText: helper || undefined,
      required: requiredSet.has(fieldName),
    };
  });
}
