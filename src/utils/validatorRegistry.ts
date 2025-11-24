import type { ZValidationRuleObject } from '@/types/path';

/**
 * Тип функции кастомного валидатора.
 * Принимает значение и правило валидации типа 'custom'.
 * Возвращает сообщение об ошибке или `undefined`, если валидация прошла успешно.
 */
export type CustomValidator = (
  value: any,
  rule: Extract<ZValidationRuleObject, { type: 'custom' }>
) => string | undefined;

/**
 * Реестр кастомных валидаторов.
 * Хранит функции валидации по ключам для использования в ZValidationRuleObject с type: 'custom'.
 */
const validatorRegistry: Map<string, CustomValidator> = new Map();

/**
 * Регистрирует кастомный валидатор в реестре.
 * @param key Ключ валидатора (должен совпадать с validator в правиле валидации).
 * @param validator Функция валидатора.
 * @example
 * registerValidator('email', (value, rule) => {
 *   if (typeof value === 'string' && !value.includes('@')) {
 *     return rule.message || 'Некорректный email';
 *   }
 *   return undefined;
 * });
 */
export const registerValidator = (key: string, validator: CustomValidator): void => {
  validatorRegistry.set(key, validator);
};

/**
 * Получает кастомный валидатор из реестра.
 * @param key Ключ валидатора.
 * @returns Функция валидатора или `undefined`, если валидатор не найден.
 * @example
 * const emailValidator = getValidator('email');
 * if (emailValidator) {
 *   const error = emailValidator('invalid-email', { type: 'custom', validator: 'email' });
 * }
 */
export const getValidator = (key: string): CustomValidator | undefined => {
  return validatorRegistry.get(key);
};

/**
 * Удаляет валидатор из реестра.
 * @param key Ключ валидатора для удаления.
 */
export const unregisterValidator = (key: string): void => {
  validatorRegistry.delete(key);
};

/**
 * Очищает весь реестр валидаторов.
 * Полезно для тестирования или сброса состояния.
 */
export const clearValidators = (): void => {
  validatorRegistry.clear();
};

