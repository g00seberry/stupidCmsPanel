import type { ZPathTreeNode } from '@/types/path';

/**
 * Общие пропсы для всех компонентов полей Path.
 */
export interface PropsPathFieldBase {
  /** Поле Path. */
  path: ZPathTreeNode;
  /** Префикс для имени поля в форме. */
  fieldNamePrefix: (string | number)[];
  /** Флаг режима только для чтения. */
  readonly?: boolean;
}

