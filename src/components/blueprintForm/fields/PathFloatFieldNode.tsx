import { InputNumber } from 'antd';
import type React from 'react';
import type { FieldComponentProps } from './fieldRegistry';

/**
 * Компонент поля типа float (число с плавающей точкой) для работы с FieldNode.
 * Возвращает только контрол InputNumber, без Form.Item и CardinalityWrapper.
 */
export const PathFloatFieldNode: React.FC<FieldComponentProps> = ({
  disabled,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <InputNumber
      style={{ width: '100%' }}
      step={0.01}
      placeholder={placeholder}
      disabled={disabled}
      value={value as number}
      onChange={val => onChange?.(val)}
    />
  );
};
