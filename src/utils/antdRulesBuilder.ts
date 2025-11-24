import type { Rule } from 'antd/es/form';
import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { ZValidationRuleObject } from '@/types/path';
import { getValidator } from './validatorRegistry';

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
 * Генерирует правила валидации Ant Design Form из схемы поля.
 * Преобразует ZValidationRule в формат, понятный AntD Form.Item.
 * @param field Схема поля для генерации правил.
 * @returns Массив правил валидации для AntD Form.Item.
 * @example
 * const field: ZBlueprintSchemaField = {
 *   type: 'string',
 *   required: true,
 *   indexed: true,
 *   cardinality: 'one',
 *   validation: [
 *     { type: 'min', value: 5 },
 *     { type: 'regex', pattern: '^[a-z]+$' }
 *   ]
 * };
 * const rules = buildAntdRules(field);
 * // [{ required: true, message: 'Обязательное поле' }, { pattern: /^[a-z]+$/, message: 'Значение не соответствует формату' }]
 */
export const buildAntdRules = (field: ZBlueprintSchemaField): Rule[] => {
  const rules: Rule[] = [];

  // Правило required
  if (field.required) {
    rules.push({ required: true, message: 'Обязательное поле' });
  }

  // Преобразуем ZValidationRule в AntD правила
  for (const rule of field.validation) {
    // Если это строка, парсим её
    let ruleObj: ZValidationRuleObject | null = null;
    if (typeof rule === 'string') {
      ruleObj = parseStringValidationRule(rule);
      if (!ruleObj) {
        continue;
      }
    } else {
      ruleObj = rule;
    }

    switch (ruleObj.type) {
      case 'min':
        rules.push({
          type: 'number',
          min: ruleObj.value,
          message: `Значение должно быть не менее ${ruleObj.value}`,
        });
        break;

      case 'max':
        rules.push({
          type: 'number',
          max: ruleObj.value,
          message: `Значение должно быть не более ${ruleObj.value}`,
        });
        break;

      case 'regex':
        if (ruleObj.pattern) {
          try {
            rules.push({
              pattern: new RegExp(ruleObj.pattern),
              message: 'Значение не соответствует формату',
            });
          } catch (error) {
            // Некорректное регулярное выражение - пропускаем правило
            console.warn('Некорректное регулярное выражение:', ruleObj.pattern);
          }
        }
        break;

      case 'length':
        if (ruleObj.min !== undefined || ruleObj.max !== undefined) {
          rules.push({
            type: 'string',
            min: ruleObj.min,
            max: ruleObj.max,
            message:
              ruleObj.min !== undefined && ruleObj.max !== undefined
                ? `Длина должна быть от ${ruleObj.min} до ${ruleObj.max} символов`
                : ruleObj.min !== undefined
                  ? `Минимальная длина: ${ruleObj.min}`
                  : `Максимальная длина: ${ruleObj.max}`,
          });
        }
        break;

      case 'enum':
        if (ruleObj.values) {
          rules.push({
            validator: (_, value) => {
              if (!value || ruleObj.values.includes(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Недопустимое значение'));
            },
          });
        }
        break;

      case 'custom':
        if (ruleObj.validator) {
          const validator = getValidator(ruleObj.validator);
          if (validator) {
            rules.push({
              validator: (_, value) => {
                const error = validator(value, ruleObj);
                if (error) {
                  return Promise.reject(new Error(error));
                }
                return Promise.resolve();
              },
            });
          }
        }
        break;
    }
  }

  return rules;
};
