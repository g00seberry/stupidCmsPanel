import type { FieldSchema, ValidationSpec } from '@/types/schemaForm';
import type { PathSegment } from '@/utils/pathUtils';
import { getValidator } from './validatorRegistry';

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
 * Валидирует значение по правилу валидации.
 * @param value Значение для валидации.
 * @param spec Спецификация правила валидации.
 * @returns Сообщение об ошибке или `null`, если валидация прошла успешно.
 */
const validateRule = (value: any, spec: ValidationSpec): string | null => {
  switch (spec.type) {
    case 'min':
      if (typeof value === 'number' && value < spec.value) {
        return spec.message || `Значение должно быть не менее ${spec.value}`;
      }
      break;

    case 'max':
      if (typeof value === 'number' && value > spec.value) {
        return spec.message || `Значение должно быть не более ${spec.value}`;
      }
      break;

    case 'regex':
      if (typeof value === 'string' && spec.value) {
        try {
          const regex = new RegExp(spec.value);
          if (!regex.test(value)) {
            return spec.message || 'Значение не соответствует формату';
          }
        } catch (error) {
          // Некорректное регулярное выражение
          return spec.message || 'Ошибка в правиле валидации';
        }
      }
      break;

    case 'enum':
      if (spec.value && Array.isArray(spec.value)) {
        if (!spec.value.includes(value)) {
          return spec.message || 'Недопустимое значение';
        }
      }
      break;

    case 'custom':
      if (spec.validatorKey) {
        const validator = getValidator(spec.validatorKey);
        if (validator) {
          return validator(value, spec);
        }
        // Если валидатор не найден, возвращаем сообщение об ошибке
        return spec.message || `Валидатор '${spec.validatorKey}' не найден`;
      }
      break;

    case 'required':
      // required обрабатывается отдельно через флаг field.required
      break;
  }

  return null;
};

/**
 * Валидирует поле формы на основе его схемы.
 * Проверяет флаг required и все правила валидации из validation.
 * @param field Схема поля для валидации.
 * @param value Значение поля для проверки.
 * @param path Путь к полю (для контекста ошибок, опционально).
 * @returns Массив сообщений об ошибках. Пустой массив, если валидация прошла успешно.
 * @example
 * const field: FieldSchema = {
 *   type: 'string',
 *   required: true,
 *   indexed: true,
 *   cardinality: 'one',
 *   validation: [
 *     { type: 'min', value: 5, message: 'Минимум 5 символов' }
 *   ]
 * };
 * const errors = validateField(field, 'abc', ['title']);
 * // ['Минимум 5 символов']
 */
export const validateField = (
  field: FieldSchema,
  value: any,
  path: PathSegment[] = []
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

  // Проверка правил валидации
  for (const spec of field.validation) {
    const error = validateRule(value, spec);
    if (error) {
      errors.push(error);
    }
  }

  return errors;
};

