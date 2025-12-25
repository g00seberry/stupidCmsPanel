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
