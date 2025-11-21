import type { Rule } from 'antd/es/form';
import type { FieldNode } from '../types/formField';
import { t } from './i18n';

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
      message: t('blueprint.field.required', { field: label }),
    });
  }

  // Правила из validation_rules (из ui.validationRules)
  if (node.ui?.validationRules && Array.isArray(node.ui.validationRules)) {
    node.ui.validationRules.forEach(rule => {
      if (typeof rule === 'object' && rule.type) {
        switch (rule.type) {
          case 'max':
            if (typeof rule.value === 'number') {
              rules.push({
                max: rule.value,
                message: t('blueprint.field.maxLength', { max: String(rule.value) }),
              });
            }
            break;
          case 'min':
            if (typeof rule.value === 'number') {
              rules.push({
                min: rule.value,
                message: t('blueprint.field.minLength', { min: String(rule.value) }),
              });
            }
            break;
          case 'regex':
            if (typeof rule.pattern === 'string') {
              try {
                const regex = new RegExp(rule.pattern);
                rules.push({
                  pattern: regex,
                  message: t('blueprint.field.invalidFormat'),
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
      rules.push({ max: 500, message: t('blueprint.field.maxLength', { max: '500' }) });
      break;
    case 'int':
      rules.push({ type: 'number', message: t('blueprint.field.mustBeInteger') });
      break;
    case 'float':
      rules.push({ type: 'number', message: t('blueprint.field.mustBeNumber') });
      break;
    case 'date':
    case 'datetime':
      // Валидация дат обрабатывается DatePicker
      break;
  }

  return rules;
};

