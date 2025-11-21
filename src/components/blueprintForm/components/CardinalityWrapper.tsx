import { Form, Button } from 'antd';
import type React from 'react';
import type { FieldNode } from '../types/formField';
import type { Rule } from 'antd/es/form';
import { t } from '../utils/i18n';

/**
 * Пропсы компонента-обёртки для обработки cardinality.
 */
export interface PropsCardinalityWrapper {
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
 * Компонент-обёртка для единой обработки cardinality (one/many).
 * Если cardinality === 'one', вызывает children(name) один раз и оборачивает в Form.Item.
 * Если cardinality === 'many', использует Form.List для списка полей и оборачивает каждый элемент в Form.Item.
 * @example
 * <CardinalityWrapper node={node} name={['field']} readonly={false} label="Field" rules={[]}>
 *   {itemName => <Input />}
 * </CardinalityWrapper>
 */
export const CardinalityWrapper: React.FC<PropsCardinalityWrapper> = ({
  node,
  name,
  readonly,
  label,
  rules,
  children,
}) => {
  if (node.cardinality === 'one') {
    // Для 'one' оборачиваем children в Form.Item
    return (
      <Form.Item name={name} label={label} rules={rules}>
        {children(name)}
      </Form.Item>
    );
  }

  // Для 'many' используем Form.List
  const disabled = node.readonly || readonly;

  // Убеждаемся, что name - это массив и нормализуем его
  const nameArray: (string | number)[] = (() => {
    if (!name) {
      return [];
    }
    if (Array.isArray(name)) {
      // Фильтруем и проверяем, что все элементы валидны
      return name.filter((item): item is string | number => {
        return typeof item === 'string' || typeof item === 'number';
      });
    }
    // Если name не массив, создаём массив из одного элемента
    if (typeof name === 'string' || typeof name === 'number') {
      return [name];
    }
    return [];
  })();

  // Определяем начальное значение для нового элемента в зависимости от типа данных
  const getDefaultValue = (): unknown => {
    switch (node.dataType) {
      case 'string':
      case 'text':
        return '';
      case 'int':
      case 'float':
        return undefined;
      case 'bool':
        return false;
      case 'date':
      case 'datetime':
        return undefined;
      case 'ref':
        return node.cardinality === 'many' ? [] : undefined;
      case 'json':
        return {};
      default:
        return undefined;
    }
  };

  return (
    <Form.List name={nameArray}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name: itemName }) => {
            // Убеждаемся, что itemName - это число (индекс в Form.List)
            const itemIndex = typeof itemName === 'number' ? itemName : Number(itemName);
            if (isNaN(itemIndex) || itemIndex < 0) {
              console.error('Invalid itemName in Form.List:', itemName);
              return null;
            }
            // Создаём полное имя поля
            const fullName: (string | number)[] = nameArray.concat(itemIndex);
            return (
              <div key={key} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">
                    {label || node.label} {itemIndex + 1}
                  </span>
                  {!disabled && (
                    <Button type="text" danger size="small" onClick={() => remove(itemIndex)}>
                      {t('blueprint.removeItem')}
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
                  try {
                    const defaultValue = getDefaultValue();
                    add(defaultValue);
                  } catch (error) {
                    console.error('Error adding item to Form.List:', error, {
                      nameArray,
                      node: node.dataType,
                    });
                  }
                }}
              >
                {t('blueprint.addItem')} {node.label.toLowerCase()}
              </Button>
            </Form.Item>
          )}
        </>
      )}
    </Form.List>
  );
};
