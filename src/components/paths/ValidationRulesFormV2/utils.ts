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
