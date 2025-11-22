import type { FieldNode } from '../types/formField';
import { t, tWithDefault } from './i18n';

/**
 * Проверяет, должно ли поле быть отключено.
 * @param node Узел поля формы.
 * @param readonly Флаг режима только для чтения из пропсов.
 * @returns `true`, если поле должно быть отключено.
 */
export const isFieldDisabled = (node: FieldNode, readonly?: boolean): boolean => {
  return Boolean(readonly || node.readonly);
};

/**
 * Генерирует tooltip для поля, если оно скопировано из другого Blueprint.
 * @param node Узел поля формы.
 * @returns Текст tooltip или `undefined`.
 */
export const getFieldTooltip = (node: FieldNode): string | undefined => {
  // TODO: добавить поддержку source_blueprint в FieldNode, если понадобится
  return undefined;
};

/**
 * Генерирует placeholder для поля с поддержкой локализации.
 * @param node Узел поля формы.
 * @param action Действие (по умолчанию используется ключ локализации).
 * @returns Текст placeholder.
 */
export const getFieldPlaceholder = (node: FieldNode, action?: string): string => {
  // Используем переданное действие или дефолтное
  const actionText = action || t('blueprint.field.enter');
  const label = node.label;
  return `${actionText} ${label.toLowerCase()}`;
};

/**
 * Получает локализованный label для поля.
 * @param node Узел поля формы.
 * @returns Локализованный label или дефолтный label.
 */
export const getLocalizedLabel = (node: FieldNode): string => {
  return node.label;
};

/**
 * Получает локализованный help text для поля.
 * @param node Узел поля формы.
 * @returns Локализованный help text или дефолтный.
 */
export const getLocalizedHelpText = (node: FieldNode): string | undefined => {
  return node.helpText;
};

/**
 * Создаёт полное имя поля для формы.
 * @param fieldNamePrefix Префикс имени поля.
 * @param fieldName Имя поля.
 * @returns Массив для использования в Form.Item name.
 */
export const createFieldName = (
  fieldNamePrefix: (string | number)[],
  fieldName: string
): (string | number)[] => {
  return [...fieldNamePrefix, fieldName];
};

