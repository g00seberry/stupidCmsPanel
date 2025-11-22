import type { FieldNode } from '../types/formField';

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
 * Генерирует placeholder для поля.
 * @param node Узел поля формы.
 * @param action Действие (по умолчанию "Введите").
 * @returns Текст placeholder.
 */
export const getFieldPlaceholder = (node: FieldNode): string => {
  if (node.dataType === 'date' || node.dataType === 'datetime') {
    return 'Выберите';
  }
  const actionText = 'Введите';
  const label = node.label;
  return `${actionText} ${label.toLowerCase()}`;
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
