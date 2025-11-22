import type React from 'react';
import type { FieldNode } from '../types/formField';
import type { Rule } from 'antd/es/form';
import { SingleFieldWrapper } from './SingleFieldWrapper';
import { ManyFieldWrapper } from './ManyFieldWrapper';

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
  // Для bool полей используем valuePropName="checked"
  const useChecked = node.dataType === 'bool';

  // Для одного поля используем SingleFieldWrapper
  if (node.cardinality === 'one') {
    return (
      <SingleFieldWrapper name={name} label={label} rules={rules} useChecked={useChecked}>
        {children(name)}
      </SingleFieldWrapper>
    );
  }

  // Для множества полей используем ManyFieldWrapper
  return (
    <ManyFieldWrapper node={node} name={name} readonly={readonly} label={label} rules={rules}>
      {children}
    </ManyFieldWrapper>
  );
};
