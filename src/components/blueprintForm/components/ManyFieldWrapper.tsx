import { Form, Button } from 'antd';
import type React from 'react';
import type { FieldNode } from '../types/formField';
import type { Rule } from 'antd/es/form';
import { getDefaultValueForDataType } from '../utils/fieldNodeUtils';

/**
 * Пропсы компонента-обёртки для множества полей.
 */
export interface PropsManyFieldWrapper {
  /** Узел поля формы. */
  node: FieldNode;
  /** Имя поля в форме. */
  name: (string | number)[];
  /** Флаг режима только для чтения. */
  readonly?: boolean;
  /** Label для Form.Item. */
  label?: string;
  /** Правила валидации для Form.Item. */
  rules?: Rule[];
  /** Функция для рендеринга контрола (без Form.Item). */
  children: (itemName: (string | number)[]) => React.ReactNode;
}

/**
 * Компонент-обёртка для множества полей (cardinality === 'many').
 * Использует Form.List для управления списком полей.
 */
export const ManyFieldWrapper: React.FC<PropsManyFieldWrapper> = ({
  node,
  name,
  readonly,
  label,
  rules,
  children,
}) => {
  const disabled = node.readonly || readonly;

  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name: itemName }) => {
            const itemIndex = typeof itemName === 'number' ? itemName : Number(itemName);
            if (isNaN(itemIndex) || itemIndex < 0) {
              console.error('Invalid itemName in Form.List:', itemName);
              return null;
            }

            const fullName: (string | number)[] = [...name, itemIndex];

            return (
              <div key={key} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">
                    {label || node.label} {itemIndex + 1}
                  </span>
                  {!disabled && (
                    <Button type="text" danger size="small" onClick={() => remove(itemIndex)}>
                      Удалить
                    </Button>
                  )}
                </div>
                <Form.Item name={fullName} rules={rules}>
                  {children(fullName)}
                </Form.Item>
              </div>
            );
          })}
          {!disabled && (
            <Form.Item>
              <Button
                type="dashed"
                block
                onClick={() => {
                  const defaultValue = getDefaultValueForDataType(node);
                  add(defaultValue);
                }}
              >
                Добавить {node.label.toLowerCase()}
              </Button>
            </Form.Item>
          )}
        </>
      )}
    </Form.List>
  );
};
