import type { ZPathTreeNode } from '@/types/path';
import type React from 'react';
import { PathField } from './fields/PathField';

/**
 * Пропсы компонента формы Blueprint.
 */
export interface PropsBlueprintForm {
  /** Дерево полей Path для генерации формы. */
  paths: ZPathTreeNode[];
  /** Префикс для имён полей формы (по умолчанию ['blueprint_data']). */
  fieldNamePrefix?: (string | number)[];
  /** Флаг режима только для чтения. */
  readonly?: boolean;
}

/**
 * Главный компонент формы для редактирования данных Blueprint.
 * Генерирует поля формы на основе дерева Path.
 * @example
 * <BlueprintForm
 *   paths={paths}
 *   fieldNamePrefix={['blueprint_data']}
 *   readonly={false}
 * />
 */
export const BlueprintForm: React.FC<PropsBlueprintForm> = ({
  paths,
  fieldNamePrefix = [],
  readonly = false,
}) => {
  return (
    <>
      {paths.map(path => (
        <PathField
          key={path.id}
          path={path}
          fieldNamePrefix={fieldNamePrefix}
          readonly={readonly}
        />
      ))}
    </>
  );
};
