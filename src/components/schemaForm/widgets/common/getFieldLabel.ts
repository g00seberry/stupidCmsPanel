import { pathToString } from '@/utils/pathUtils';
import type { ZEditComponent } from '../../ZComponent';

/**
 * Получает текст label для поля из конфигурации компонента или пути.
 * @param componentConfig Конфигурация компонента (опционально).
 * @param namePath Путь к полю в форме.
 * @returns Текст label для поля.
 * @example
 * const label = getFieldLabel(componentConfig, ['user', 'name']);
 * // 'Имя пользователя' или 'name'
 */
export const getFieldLabel = (
  componentConfig: ZEditComponent | undefined,
  namePath: Array<string | number>
): string => {
  const pathStr = pathToString(namePath);
  return String(
    componentConfig?.props?.label || namePath[namePath.length - 1] || pathStr.split('.').pop() || ''
  );
};
