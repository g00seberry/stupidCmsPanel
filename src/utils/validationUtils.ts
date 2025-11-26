import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { ZValidationRules } from '@/types/path';
import type { PathSegment } from '@/utils/pathUtils';

/**
 * Проверяет, является ли значение пустым для валидации.
 * @param value Значение для проверки.
 * @returns `true`, если значение считается пустым.
 */
const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
};

/**
 * Валидирует значение по правилам валидации в новом формате (объект validation_rules).
 * @param value Значение для валидации.
 * @param rules Объект правил валидации.
 * @returns Массив сообщений об ошибках.
 */
const validateRules = (value: any, rules: ZValidationRules | null): string[] => {
  const errors: string[] = [];

  if (!rules) {
    return errors;
  }

  // Проверка min
  if (rules.min !== undefined && rules.min !== null) {
    if (typeof value === 'number' && value < rules.min) {
      errors.push(`Значение должно быть не менее ${rules.min}`);
    } else if (typeof value === 'string' && value.length < rules.min) {
      errors.push(`Минимальная длина: ${rules.min}`);
    }
  }

  // Проверка max
  if (rules.max !== undefined && rules.max !== null) {
    if (typeof value === 'number' && value > rules.max) {
      errors.push(`Значение должно быть не более ${rules.max}`);
    } else if (typeof value === 'string' && value.length > rules.max) {
      errors.push(`Максимальная длина: ${rules.max}`);
    }
  }

  // Проверка pattern
  if (rules.pattern !== undefined && rules.pattern !== null && typeof value === 'string') {
    try {
      const regex = new RegExp(rules.pattern);
      if (!regex.test(value)) {
        errors.push('Значение не соответствует формату');
      }
    } catch (error) {
      // Некорректное регулярное выражение
      errors.push('Ошибка в правиле валидации');
    }
  }

  // Проверка array_min_items
  if (rules.array_min_items !== undefined && rules.array_min_items !== null && Array.isArray(value)) {
    if (value.length < rules.array_min_items) {
      errors.push(`Минимальное количество элементов: ${rules.array_min_items}`);
    }
  }

  // Проверка array_max_items
  if (rules.array_max_items !== undefined && rules.array_max_items !== null && Array.isArray(value)) {
    if (value.length > rules.array_max_items) {
      errors.push(`Максимальное количество элементов: ${rules.array_max_items}`);
    }
  }

  // Проверка array_unique
  if (rules.array_unique === true && Array.isArray(value)) {
    const uniqueValues = new Set(value);
    if (uniqueValues.size !== value.length) {
      errors.push('Элементы массива должны быть уникальными');
    }
  }

  // Условные правила, unique, exists, field_comparison - это более сложные правила,
  // которые требуют контекста формы и других полей, поэтому их валидация
  // должна выполняться на уровне формы, а не отдельного поля.
  // Здесь мы валидируем только простые правила.

  return errors;
};

/**
 * Валидирует поле формы на основе его схемы.
 * Проверяет флаг required и все правила валидации из validation.
 * @param field Схема поля для валидации.
 * @param value Значение поля для проверки.
 * @param path Путь к полю (для контекста ошибок, опционально).
 * @returns Массив сообщений об ошибках. Пустой массив, если валидация прошла успешно.
 * @example
 * const field: ZBlueprintSchemaField = {
 *   type: 'string',
 *   required: true,
 *   indexed: true,
 *   cardinality: 'one',
 *   validation: [
 *     { type: 'min', value: 5 }
 *   ]
 * };
 * const errors = validateField(field, 'abc', ['title']);
 * // ['Значение должно быть не менее 5']
 */
export const validateField = (
  field: ZBlueprintSchemaField,
  value: any,
  _path: PathSegment[] = []
): string[] => {
  const errors: string[] = [];

  // Проверка required
  if (field.required && isEmpty(value)) {
    errors.push('Обязательное поле');
  }

  // Если поле пустое и не required, не проверяем остальные правила
  if (isEmpty(value) && !field.required) {
    return errors;
  }

  // Проверка правил валидации (новый формат - объект)
  if (field.validation) {
    const validationErrors = validateRules(value, field.validation);
    errors.push(...validationErrors);
  }

  return errors;
};
