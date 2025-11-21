import type { ZPathTreeNode } from '@/types/path';
import type React from 'react';
import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { buildFormSchema } from './utils/buildFormSchema';
import { PathField } from './fields/PathField';
import { BlueprintFormStore } from './stores/BlueprintFormStore';
import type { z } from 'zod';

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
  onSchemaReady?: (schema: z.ZodObject<Record<string, z.ZodTypeAny>> | null) => void;
  /** Store для управления формой (опционально, создаётся автоматически). */
  store?: BlueprintFormStore;
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
export const BlueprintForm: React.FC<PropsBlueprintForm> = observer(
  ({ paths, fieldNamePrefix = [], readonly = false, onSchemaReady, store: externalStore }) => {
    // Создаём или используем переданный store
    const store = useMemo(() => externalStore || new BlueprintFormStore(), [externalStore]);

    // Преобразуем ZPathTreeNode[] в FieldNode[] через buildFormSchema
    const fieldNodes = useMemo(() => buildFormSchema(paths), [paths]);

    // Генерируем Zod-схему для валидации
    useEffect(() => {
      store.buildSchema(fieldNodes);
    }, [store, fieldNodes]);

    // Передаём схему в callback, если он предоставлен
    useEffect(() => {
      if (onSchemaReady) {
        onSchemaReady(store.schema);
      }
    }, [store.schema, onSchemaReady]);

    // Очищаем store при размонтировании, если он был создан внутри компонента
    useEffect(() => {
      if (!externalStore) {
        return () => {
          store.cleanup();
        };
      }
    }, [externalStore, store]);

    return (
      <>
        {fieldNodes.map(node => (
          <PathField
            key={node.id}
            node={node}
            name={fieldNamePrefix}
            readonly={readonly}
            store={store}
          />
        ))}
      </>
    );
  }
);
