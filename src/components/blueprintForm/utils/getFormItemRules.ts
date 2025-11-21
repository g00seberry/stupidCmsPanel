import type { Rule } from 'antd/es/form';
import type { ZPathTreeNode } from '@/types/path';
import { getFieldLabel } from './getFieldLabel';

/**
 * Генерирует правила валидации для Form.Item на основе Path.
 * @param path Поле Path.
 * @returns Массив правил валидации Ant Design Form.
 */
export const getFormItemRules = (path: ZPathTreeNode): Rule[] => {
  const rules: Rule[] = [];
  const label = getFieldLabel(path);

  // Обязательность
  if (path.is_required) {
    rules.push({
      required: true,
      message: `Поле "${label}" обязательно для заполнения`,
    });
  }

  // Правила из validation_rules
  if (path.validation_rules && Array.isArray(path.validation_rules)) {
    path.validation_rules.forEach(rule => {
      if (typeof rule === 'string') {
        const [type, value] = rule.split(':');
        switch (type) {
          case 'max':
            rules.push({
              max: Number(value),
              message: `Максимум ${value} символов`,
            });
            break;
          case 'min':
            rules.push({
              min: Number(value),
              message: `Минимум ${value} символов`,
            });
            break;
          case 'pattern':
            try {
              const regex = new RegExp(value);
              rules.push({
                pattern: regex,
                message: 'Неверный формат',
              });
            } catch {
              // Игнорируем невалидные regex
            }
            break;
        }
      }
    });
  }

  // Тип-специфичные правила
  switch (path.data_type) {
    case 'string':
      rules.push({ max: 500, message: 'Максимум 500 символов' });
      break;
    case 'int':
      rules.push({ type: 'number', message: 'Должно быть целым числом' });
      break;
    case 'float':
      rules.push({ type: 'number', message: 'Должно быть числом' });
      break;
    case 'date':
    case 'datetime':
      // Валидация дат обрабатывается DatePicker
      break;
  }

  return rules;
};

