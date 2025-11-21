import type { ZPathTreeNode } from '@/types/path';
import { getFieldLabel } from './getFieldLabel';

/**
 * Проверяет, должно ли поле быть отключено.
 * @param path Поле Path.
 * @param readonly Флаг режима только для чтения из пропсов.
 * @returns `true`, если поле должно быть отключено.
 */
export const isFieldDisabled = (path: ZPathTreeNode, readonly?: boolean): boolean => {
  return Boolean(readonly || path.is_readonly);
};

/**
 * Генерирует tooltip для поля, если оно скопировано из другого Blueprint.
 * @param path Поле Path.
 * @returns Текст tooltip или `undefined`.
 */
export const getFieldTooltip = (path: ZPathTreeNode): string | undefined => {
  if (path.is_readonly && path.source_blueprint) {
    return `Скопировано из Blueprint: ${path.source_blueprint.name}`;
  }
  return undefined;
};

/**
 * Генерирует placeholder для поля.
 * @param path Поле Path.
 * @param action Действие (по умолчанию 'Введите').
 * @returns Текст placeholder.
 */
export const getFieldPlaceholder = (path: ZPathTreeNode, action: string = 'Введите'): string => {
  const label = getFieldLabel(path);
  return `${action} ${label.toLowerCase()}`;
};

/**
 * Создаёт полное имя поля для формы.
 * @param fieldNamePrefix Префикс имени поля.
 * @param pathName Имя поля Path.
 * @returns Массив для использования в Form.Item name.
 */
export const createFieldName = (
  fieldNamePrefix: (string | number)[],
  pathName: string
): (string | number)[] => {
  return [...fieldNamePrefix, pathName];
};

