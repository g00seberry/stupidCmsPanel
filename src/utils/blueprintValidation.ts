import type { ZPath } from '@/types/path';

/**
 * Регулярное выражение для валидации кода/имени (a-z0-9_).
 */
const CODE_NAME_PATTERN = /^[a-z0-9_]+$/;

/**
 * Максимальная длина кода/имени.
 */
const MAX_CODE_NAME_LENGTH = 255;

/**
 * Валидация формата кода/имени (a-z0-9_).
 * @param value Значение для валидации.
 * @returns `true`, если значение валидно, иначе `false`.
 */
const validateCodeName = (value: string): boolean => {
  return CODE_NAME_PATTERN.test(value) && value.length <= MAX_CODE_NAME_LENGTH;
};

/**
 * Валидация формата code Blueprint (a-z0-9_).
 * Максимальная длина: 255 символов.
 * @param code Код Blueprint для валидации.
 * @returns `true`, если код валиден, иначе `false`.
 */
export const validateBlueprintCode = (code: string): boolean => {
  return validateCodeName(code);
};

/**
 * Валидация формата name поля (a-z0-9_).
 * Максимальная длина: 255 символов.
 * @param name Имя поля для валидации.
 * @returns `true`, если имя валидно, иначе `false`.
 */
export const validateFieldName = (name: string): boolean => {
  return validateCodeName(name);
};

/**
 * Форматирование code Blueprint (приведение к нижнему регистру и удаление недопустимых символов).
 * @param code Исходный код для форматирования.
 * @returns Отформатированный код (только строчные буквы, цифры и подчёркивание).
 * @example
 * formatBlueprintCode('My-Article_123') // 'myarticle_123'
 */
export const formatBlueprintCode = (code: string): string => {
  return code.toLowerCase().replace(/[^a-z0-9_]/g, '');
};

/**
 * Проверить, может ли host_path содержать встраивание.
 * Встраивание возможно только в поля типа JSON.
 * ⚠️ ВАЖНО: Эта проверка ДУБЛИРУЕТ валидацию бэкенда для лучшего UX.
 * @param path Поле, в которое планируется встраивание. `null` означает корневое встраивание.
 * @returns `true`, если встраивание разрешено, иначе `false`.
 */
export const canEmbedInPath = (path: ZPath | null): boolean => {
  if (!path) return true; // Корневое встраивание разрешено
  return path.data_type === 'json';
};

/**
 * Проверить уникальность имени поля на уровне (клиентская валидация).
 * ⚠️ ВАЖНО: Бэкенд гарантирует уникальность через full_path, но клиент может
 * предупредить пользователя заранее.
 * @param name Имя поля для проверки.
 * @param parentId Идентификатор родительского поля. `null` означает корневой уровень.
 * @param existingPaths Список существующих полей для проверки.
 * @returns `true`, если имя уникально на данном уровне, иначе `false`.
 */
export const isNameUniqueAtLevel = (
  name: string,
  parentId: number | null,
  existingPaths: ZPath[]
): boolean => {
  return !existingPaths.some(p => p.name === name && p.parent_id === parentId);
};
