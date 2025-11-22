import { Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useEffect } from 'react';
import { PathField } from './fields/PathField';
import { SchemaFormStore } from './SchemaFormStore';

/**
 * Пропсы компонента формы Blueprint.
 */
export interface PropsSchemaForm {
  /** Идентификатор Blueprint для получения схемы. */
  blueprintId: number;
  /** Префикс для имён полей формы (по умолчанию ['blueprint_data']). */
  fieldNamePrefix?: (string | number)[];
  /** Флаг режима только для чтения. */
  readonly?: boolean;
  /** Store для управления формой (опционально, создаётся автоматически). */
  store: SchemaFormStore;
}

/**
 * Главный компонент формы для редактирования данных Blueprint.
 * Получает схему Blueprint из API и генерирует поля формы через промежуточную форменную модель FieldNode.
 * Также генерирует Zod-схему для валидации формы.
 * @example
 * <SchemaForm
 *   blueprintId={1}
 *   fieldNamePrefix={['blueprint_data']}
 *   readonly={false}
 *   store={store}
 * />
 */
export const SchemaForm: React.FC<PropsSchemaForm> = observer(
  ({ blueprintId, fieldNamePrefix = [], readonly = false, store }) => {
    // Загружаем схему при изменении blueprintId
    useEffect(() => {
      void store.loadSchema(blueprintId);
    }, [store, blueprintId]);

    // Очищаем store при размонтировании, если он был создан внутри компонента
    useEffect(() => {
      return () => {
        store.cleanup();
      };
    }, [store]);

    if (store.loading) {
      return (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      );
    }

    return (
      <>
        {store.fieldNodes.map(node => (
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
