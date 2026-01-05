/**
 * Максимальная длина строкового поля.
 */
const MAX_STRING_LENGTH = 255;

import type { Rule } from 'antd/es/form';

/**
 * Правила валидации для поля "Тип узла".
 */
export const kindRules: Rule[] = [{ required: true, message: 'Выберите тип узла' }];

/**
 * Правила валидации для поля "Тип действия".
 */
export const actionTypeRules: Rule[] = [{ required: true, message: 'Выберите тип действия' }];

/**
 * Правила валидации для поля "URI".
 */
export const uriRules: Rule[] = [
  { required: true, message: 'URI обязателен для маршрута' },
  { max: MAX_STRING_LENGTH, message: `Максимум ${MAX_STRING_LENGTH} символов` },
];

/**
 * Правила валидации для поля "HTTP методы".
 */
export const methodsRules: Rule[] = [{ required: true, message: 'Выберите хотя бы один метод' }];

/**
 * Правила валидации для поля "Действие" (controller action).
 */
export const actionRules: Rule[] = [
  { max: MAX_STRING_LENGTH, message: `Максимум ${MAX_STRING_LENGTH} символов` },
  {
    pattern: /^(App\\Http\\Controllers\\.+|view:|redirect:)/,
    message: 'Неверный формат действия',
  },
];

/**
 * Правила валидации для поля "ID Entry".
 */
export const entryIdRules: Rule[] = [{ required: true, message: 'ID Entry обязателен' }];

/**
 * Правила валидации для полей группы (prefix, domain, namespace).
 */
export const groupFieldRules: Rule[] = [
  { max: MAX_STRING_LENGTH, message: `Максимум ${MAX_STRING_LENGTH} символов` },
];

/**
 * Нормализация значения для числового поля (entry_id).
 * Преобразует строку в число или возвращает null.
 */
export const normalizeNumber = (value: unknown): number | null => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  const num = Number.parseInt(String(value), 10);
  return Number.isNaN(num) ? null : num;
};
