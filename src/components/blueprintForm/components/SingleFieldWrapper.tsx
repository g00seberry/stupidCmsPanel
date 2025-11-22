import { Form } from 'antd';
import type React from 'react';
import type { Rule } from 'antd/es/form';

/**
 * Пропсы компонента-обёртки для одного поля.
 */
export interface PropsSingleFieldWrapper {
  /** Имя поля в форме. */
  name: (string | number)[];
  /** Label для Form.Item. */
  label?: string;
  /** Правила валидации для Form.Item. */
  rules?: Rule[];
  /** Флаг использования valuePropName="checked" (для bool полей). */
  useChecked?: boolean;
  /** Функция для рендеринга контрола. */
  children: React.ReactNode;
}

/**
 * Компонент-обёртка для одного поля (cardinality === 'one').
 * Оборачивает контрол в Form.Item с указанными правилами валидации.
 */
export const SingleFieldWrapper: React.FC<PropsSingleFieldWrapper> = ({
  name,
  label,
  rules,
  useChecked,
  children,
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      valuePropName={useChecked ? 'checked' : undefined}
    >
      {children}
    </Form.Item>
  );
};
