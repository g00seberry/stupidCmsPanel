import type { FormInstance } from 'antd/es/form';
import type { ZValidationRules } from '@/types/path';
import type { RuleCategory, RuleKey } from './types';

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

  const remainingActiveRules = Object.keys(newRules).filter(
    key => newRules[key as RuleKey] !== null
  );
  form.setFieldValue('validation_rules', remainingActiveRules.length === 0 ? null : newRules);
};

/**
 * Получает отображаемое название категории правила на русском языке.
 * @param category Ключ категории правила.
 * @returns Отображаемое название категории.
 */
export const getCategoryLabel = (category: RuleCategory): string => {
  const labels: Record<RuleCategory, string> = {
    basic: 'Основные',
    array: 'Массивы',
    conditional: 'Условные',
    comparison: 'Сравнение',
  };
  return labels[category] || category;
};
