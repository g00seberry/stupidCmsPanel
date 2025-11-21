import { Card, Form } from 'antd';
import type React from 'react';
import type { ZPathTreeNode } from '@/types/path';
import { getFieldLabel } from '../utils/getFieldLabel';
import { isFieldDisabled, createFieldName } from '../utils/pathFieldUtils';
import { PathField } from './PathField';
import type { PropsPathFieldBase } from './PathField.types';

/**
 * Компонент группы полей типа json.
 * Рекурсивно рендерит дочерние поля через PathField.
 * Поддерживает cardinality: one и many через Form.List.
 */
export const PathJsonGroupField: React.FC<PropsPathFieldBase> = ({
  path,
  fieldNamePrefix,
  readonly,
}) => {
  const label = getFieldLabel(path);
  const fieldName = createFieldName(fieldNamePrefix, path.name);
  const disabled = isFieldDisabled(path, readonly);

  if (!path.children || path.children.length === 0) {
    return null;
  }

  if (path.cardinality === 'many') {
    return (
      <Form.List name={fieldName}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                title={`${label} ${name + 1}`}
                className="mb-4"
                extra={
                  !disabled && (
                    <button
                      type="button"
                      onClick={() => remove(name)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Удалить
                    </button>
                  )
                }
              >
                {path.children
                  ?.sort((a: ZPathTreeNode, b: ZPathTreeNode) => a.sort_order - b.sort_order)
                  .map((child: ZPathTreeNode) => (
                    <PathField
                      key={child.id}
                      path={child}
                      fieldNamePrefix={[...fieldName, name]}
                      readonly={readonly}
                    />
                  ))}
              </Card>
            ))}
            {!disabled && (
              <Form.Item>
                <button
                  type="button"
                  onClick={() => add()}
                  className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded hover:border-gray-400"
                >
                  Добавить {label.toLowerCase()}
                </button>
              </Form.Item>
            )}
          </>
        )}
      </Form.List>
    );
  }

  return (
    <Card title={label} className="mb-4">
      {path.children
        .sort((a: ZPathTreeNode, b: ZPathTreeNode) => a.sort_order - b.sort_order)
        .map((child: ZPathTreeNode) => (
          <PathField
            key={child.id}
            path={child}
            fieldNamePrefix={fieldNamePrefix}
            readonly={readonly}
          />
        ))}
    </Card>
  );
};
