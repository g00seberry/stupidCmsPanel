import type { ZValidationRules } from '@/types/path';
import type { RuleKey } from './types';

/**
 * Получает список активных правил из объекта validation_rules.
 * Правило считается активным, если его значение не undefined и не null.
 * @param rules Объект правил валидации.
 * @returns Массив ключей активных правил.
 */
export const getActiveRules = (rules?: ZValidationRules | null): RuleKey[] => {
  if (!rules || typeof rules !== 'object') {
    return [];
  }

  return (Object.keys(rules) as RuleKey[]).filter(key => {
    const value = rules[key];
    if (value === undefined || value === null) return false;
    if (typeof value === 'object' && Object.keys(value).length === 0) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    return true;
  });
};

/**
 * Проверяет, есть ли правило в объекте validation_rules.
 * @param rules Объект правил валидации.
 * @param ruleKey Ключ правила.
 * @returns true, если правило активно.
 */
export const hasRule = (rules?: ZValidationRules | null, ruleKey?: RuleKey): boolean => {
  if (!rules || !ruleKey) return false;
  const value = rules[ruleKey];
  if (value === undefined || value === null) return false;
  if (typeof value === 'object' && Object.keys(value).length === 0) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
};

/**
 * Получает значение правила из объекта validation_rules.
 * @param rules Объект правил валидации.
 * @param ruleKey Ключ правила.
 * @returns Значение правила или undefined.
 */
export const getRuleValue = (rules?: ZValidationRules | null, ruleKey?: RuleKey): any => {
  if (!rules || !ruleKey) return undefined;
  return rules[ruleKey];
};
