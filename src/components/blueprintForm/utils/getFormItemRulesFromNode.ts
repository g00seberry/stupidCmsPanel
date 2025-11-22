import type { Rule } from 'antd/es/form';
import type { FieldNode } from '../types/formField';

/**
 * Генерирует правила валидации для Form.Item на основе FieldNode.
 * @param node Узел поля формы.
 * @returns Массив правил валидации Ant Design Form.
 */
export const getFormItemRulesFromNode = (node: FieldNode): Rule[] => {
  const rules: Rule[] = [];
  const label = node.label;

  // Обязательность
  if (node.required) {
    rules.push({
      required: true,
      message: `Поле "${label}" обязательно для заполнения`,
    });
  }

  // Правила из validation_rules
  if (node.validationRules && Array.isArray(node.validationRules)) {
    node.validationRules.forEach(rule => {
      if (typeof rule === 'object' && rule.type) {
        switch (rule.type) {
          case 'max':
            if (typeof rule.value === 'number') {
              rules.push({
                max: rule.value,
                message: `Максимум ${rule.value} символов`,
              });
            }
            break;
          case 'min':
            if (typeof rule.value === 'number') {
              rules.push({
                min: rule.value,
                message: `Минимум ${rule.value} символов`,
              });
            }
            break;
          case 'regex':
            if (typeof rule.pattern === 'string') {
              try {
                const regex = new RegExp(rule.pattern);
                rules.push({
                  pattern: regex,
                  message: 'Неверный формат',
                });
              } catch {
                // Игнорируем невалидные regex
              }
            }
            break;
        }
      }
    });
  }

  // Тип-специфичные правила
  switch (node.dataType) {
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
