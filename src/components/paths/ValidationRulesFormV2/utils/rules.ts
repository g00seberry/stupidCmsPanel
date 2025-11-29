import type { ZValidationRules } from '@/types/path';
import type { RuleKey } from '../types';

/**
 * Получает список активных правил из объекта validation_rules.
 * Правило считается активным, если оно присутствует в объекте.
 * Пустые значения разрешены, так как правило может быть добавлено, но еще не настроено.
 * @param rules Объект правил валидации.
 * @returns Массив ключей активных правил.
 */
export const getActiveRules = (rules?: ZValidationRules | null): RuleKey[] => {
  if (!rules || typeof rules !== 'object') {
    return [];
  }

  return (Object.keys(rules) as RuleKey[]).filter(key => {
    const value = rules[key];
    // Правило не активно только если значение явно null
    // undefined значения могут существовать в объекте, но обычно не сохраняются
    if (value === null) return false;
    // Пустые объекты считаются активными (правило может быть настроено позже)
    // Все остальные значения (включая undefined, пустые строки, false, 0) считаются активными
    return true;
  });
};
