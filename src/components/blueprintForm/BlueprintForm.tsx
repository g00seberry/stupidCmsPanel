import type { ZPathTreeNode } from '@/types/path';
import type React from 'react';
import { useEffect, useMemo } from 'react';
import { buildFormSchema } from './utils/buildFormSchema';
import { PathField } from './fields/PathField';
import { useZodValidation } from './hooks/useZodValidation';

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
  /** Callback для получения Zod-схемы валидации (опционально). */
  onSchemaReady?: (schema: ReturnType<typeof useZodValidation>) => void;
}

/**
 * Главный компонент формы для редактирования данных Blueprint.
 * Генерирует поля формы на основе дерева Path через промежуточную форменную модель FieldNode.
 * Также генерирует Zod-схему для валидации формы.
 * @example
 * <BlueprintForm
 *   paths={paths}
 *   fieldNamePrefix={['blueprint_data']}
 *   readonly={false}
 *   onSchemaReady={(schema) => { /* использовать схему для валидации *\/ }}
 * />
 */
export const BlueprintForm: React.FC<PropsBlueprintForm> = ({
  paths,
  fieldNamePrefix = [],
  readonly = false,
  onSchemaReady,
}) => {
  // Преобразуем ZPathTreeNode[] в FieldNode[] через buildFormSchema
  const fieldNodes = useMemo(() => buildFormSchema(paths), [paths]);

  // Генерируем Zod-схему для валидации
  const zodSchema = useZodValidation(fieldNodes);

  // Передаём схему в callback, если он предоставлен
  useEffect(() => {
    if (onSchemaReady) {
      onSchemaReady(zodSchema);
    }
  }, [zodSchema, onSchemaReady]);

  return (
    <>
      {fieldNodes.map(node => (
        <PathField key={node.id} node={node} name={fieldNamePrefix} readonly={readonly} />
      ))}
    </>
  );
};
