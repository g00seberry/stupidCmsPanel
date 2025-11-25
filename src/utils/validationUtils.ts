import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { ZValidationRule, ZValidationRuleObject } from '@/types/path';
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
 * Парсит строковое правило валидации в объект.
 * Поддерживает формат "type:value" (старый формат).
 * @param rule Строковое правило валидации.
 * @returns Объект правила или null, если формат не распознан.
 */
const parseStringValidationRule = (rule: string): ZValidationRuleObject | null => {
  const parts = rule.split(':');
  if (parts.length !== 2) {
    return null;
  }

  const [type, valueStr] = parts;
  if (type === 'min' || type === 'max') {
    const numValue = Number(valueStr);
    if (!isNaN(numValue)) {
      return { type, value: numValue };
    }
  } else if (type === 'regex') {
    return { type: 'regex', pattern: valueStr };
  }

  return null;
};

/**
 * Валидирует значение по правилу валидации.
 * Поддерживает как объектный формат (ZValidationRuleObject), так и строковый.
 * @param value Значение для валидации.
 * @param rule Правило валидации (может быть строкой или объектом).
 * @returns Сообщение об ошибке или `null`, если валидация прошла успешно.
 */
const validateRule = (value: any, rule: ZValidationRule): string | null => {
  // Если это строка, парсим её
  let ruleObj: ZValidationRuleObject | null = null;
  if (typeof rule === 'string') {
    ruleObj = parseStringValidationRule(rule);
    if (!ruleObj) {
      return null;
    }
  } else {
    ruleObj = rule;
  }

  switch (ruleObj.type) {
    case 'min':
      if (typeof value === 'number' && value < ruleObj.value) {
        return `Значение должно быть не менее ${ruleObj.value}`;
      }
      break;

    case 'max':
      if (typeof value === 'number' && value > ruleObj.value) {
        return `Значение должно быть не более ${ruleObj.value}`;
      }
      break;

    case 'regex':
      if (typeof value === 'string' && ruleObj.pattern) {
        try {
          const regex = new RegExp(ruleObj.pattern);
          if (!regex.test(value)) {
            return 'Значение не соответствует формату';
          }
        } catch (error) {
          // Некорректное регулярное выражение
          return 'Ошибка в правиле валидации';
        }
      }
      break;

    case 'length':
      if (typeof value === 'string') {
        if (ruleObj.min !== undefined && value.length < ruleObj.min) {
          return `Минимальная длина: ${ruleObj.min}`;
        }
        if (ruleObj.max !== undefined && value.length > ruleObj.max) {
          return `Максимальная длина: ${ruleObj.max}`;
        }
      }
      break;

    case 'enum':
      if (ruleObj.values && !ruleObj.values.includes(value)) {
        return 'Недопустимое значение';
      }
      break;

    case 'custom':
      if (ruleObj.validator) {
        const validator = getValidator(ruleObj.validator);
        if (validator) {
          return validator(value, ruleObj) ?? null;
        }
        return ruleObj.message || `Валидатор '${ruleObj.validator}' не найден`;
      }
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

  // Проверка правил валидации
  for (const rule of field.validation) {
    const error = validateRule(value, rule);
    if (error) {
      errors.push(error);
    }
  }

  return errors;
};

