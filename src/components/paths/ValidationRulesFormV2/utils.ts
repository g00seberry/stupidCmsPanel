import type { FormInstance } from 'antd/es/form';
import type { ZValidationRules } from '@/types/path';
import type { RuleKey } from './types';
import { getActiveRules as getActiveRulesList } from './utils/rules';

export { getActiveRulesList as getActiveRules };

/**
 * Добавляет правило в форму.
 * @param form Экземпляр формы Ant Design.
 * @param ruleKey Ключ правила для добавления.
 * @param defaultValue Значение по умолчанию для правила.
 */
export const addRuleToForm = (
  form: FormInstance<any>,
  ruleKey: RuleKey,
  defaultValue: ZValidationRules[RuleKey]
): void => {
  const currentRules = form.getFieldValue('validation_rules') || {};
  form.setFieldValue('validation_rules', { ...currentRules, [ruleKey]: defaultValue });
};

/**
 * Удаляет правило из формы.
 * Если после удаления не остаётся активных правил, устанавливает validation_rules в null.
 * @param form Экземпляр формы Ant Design.
 * @param ruleKey Ключ правила для удаления.
 */
export const removeRuleFromForm = (form: FormInstance<any>, ruleKey: RuleKey): void => {
  const currentRules = form.getFieldValue('validation_rules') || {};
  const newRules = { ...currentRules };
  delete newRules[ruleKey];

  const remainingActiveRules = getActiveRulesList(newRules);
  form.setFieldValue('validation_rules', remainingActiveRules.length === 0 ? null : newRules);
};
