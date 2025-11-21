import type { ZPathTreeNode } from '@/types/path';

/**
 * Генерирует метку поля для отображения в форме.
 * @param path Поле Path.
 * @returns Человекочитаемая метка поля.
 * @example
 * const label = getFieldLabel(path);
 * // 'Title' для path.name = 'title'
 */
export const getFieldLabel = (path: ZPathTreeNode): string => {
  // Преобразуем snake_case в Title Case
  return path.name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

