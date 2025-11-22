import type { Rule } from 'antd/es/form';
import type { FieldSchema } from '@/types/schemaForm';
import { getValidator } from './validatorRegistry';

/**
 * Генерирует правила валидации Ant Design Form из схемы поля.
 * Преобразует ValidationSpec в формат, понятный AntD Form.Item.
 * @param field Схема поля для генерации правил.
 * @returns Массив правил валидации для AntD Form.Item.
 * @example
 * const field: FieldSchema = {
 *   type: 'string',
 *   required: true,
 *   indexed: true,
 *   cardinality: 'one',
 *   validation: [
 *     { type: 'min', value: 5, message: 'Минимум 5 символов' },
 *     { type: 'regex', value: '^[a-z]+$', message: 'Только строчные буквы' }
 *   ]
 * };
 * const rules = buildAntdRules(field);
 * // [{ required: true, message: 'Обязательное поле' }, { pattern: /^[a-z]+$/, message: 'Только строчные буквы' }]
 */
export const buildAntdRules = (field: FieldSchema): Rule[] => {
  const rules: Rule[] = [];

  // Правило required
  if (field.required) {
    rules.push({ required: true, message: 'Обязательное поле' });
  }

  // Преобразуем ValidationSpec в AntD правила
  for (const spec of field.validation) {
    switch (spec.type) {
      case 'min':
        rules.push({
          type: 'number',
          min: spec.value,
          message: spec.message || `Значение должно быть не менее ${spec.value}`,
        });
        break;

      case 'max':
        rules.push({
          type: 'number',
          max: spec.value,
          message: spec.message || `Значение должно быть не более ${spec.value}`,
        });
        break;

      case 'regex':
        if (spec.value) {
          try {
            rules.push({
              pattern: new RegExp(spec.value),
              message: spec.message || 'Значение не соответствует формату',
            });
          } catch (error) {
            // Некорректное регулярное выражение - пропускаем правило
            console.warn('Некорректное регулярное выражение:', spec.value);
          }
        }
        break;

      case 'enum':
        if (spec.value && Array.isArray(spec.value)) {
          rules.push({
            validator: (_, value) => {
              if (!value || spec.value.includes(value)) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(spec.message || 'Недопустимое значение')
              );
            },
          });
        }
        break;

      case 'custom':
        if (spec.validatorKey) {
          const validator = getValidator(spec.validatorKey);
          if (validator) {
            rules.push({
              validator: (_, value) => {
                const error = validator(value, spec);
                if (error) {
                  return Promise.reject(new Error(error));
                }
                return Promise.resolve();
              },
            });
          }
        }
        break;

      case 'required':
        // required уже обработан выше через флаг field.required
        break;
    }
  }

  return rules;
};

