import type { ZPath } from '@/types/path';
import type React from 'react';
import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { buildFormSchema } from './utils/buildFormSchema';
import { PathField } from './fields/PathField';
import { SchemaFormStore } from './SchemaFormStore';

/**
 * Пропсы компонента формы Blueprint.
 */
export interface PropsSchemaForm {
  /** Дерево полей Path для генерации формы. */
  paths: ZPath[];
  /** Префикс для имён полей формы (по умолчанию ['blueprint_data']). */
  fieldNamePrefix?: (string | number)[];
  /** Флаг режима только для чтения. */
  readonly?: boolean;
  /** Store для управления формой (опционально, создаётся автоматически). */
  store?: SchemaFormStore;
}

/**
 * Главный компонент формы для редактирования данных Blueprint.
 * Генерирует поля формы на основе дерева Path через промежуточную форменную модель FieldNode.
 * Также генерирует Zod-схему для валидации формы.
 * @example
 * <SchemaForm
 *   paths={paths}
 *   fieldNamePrefix={['blueprint_data']}
 *   readonly={false}
 * />
 */
export const SchemaForm: React.FC<PropsSchemaForm> = observer(
  ({ paths, fieldNamePrefix = [], readonly = false, store: externalStore }) => {
    // Создаём или используем переданный store
    const store = useMemo(() => externalStore || new SchemaFormStore(), [externalStore]);

    // Преобразуем ZPathTreeNode[] в FieldNode[] через buildFormSchema
    const fieldNodes = useMemo(() => buildFormSchema(paths), [paths]);

    // Генерируем Zod-схему для валидации
    useEffect(() => {
      store.buildSchema(fieldNodes);
    }, [store, fieldNodes]);

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
