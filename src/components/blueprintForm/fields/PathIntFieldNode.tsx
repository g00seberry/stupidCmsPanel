import { InputNumber } from 'antd';
import type React from 'react';
import type { FieldComponentProps } from './fieldRegistry';

/**
 * Компонент поля типа int (целое число) для работы с FieldNode.
 * Возвращает только контрол InputNumber, без Form.Item и CardinalityWrapper.
 */
export const PathIntFieldNode: React.FC<FieldComponentProps> = ({
  disabled,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <InputNumber
      style={{ width: '100%' }}
      step={1}
      placeholder={placeholder}
      disabled={disabled}
      value={value as number}
      onChange={val => onChange?.(val)}
    />
  );
};
