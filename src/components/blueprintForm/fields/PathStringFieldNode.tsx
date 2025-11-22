import { Input } from 'antd';
import type React from 'react';
import type { FieldComponentProps } from './fieldRegistry';

/**
 * Компонент поля типа string для работы с FieldNode.
 * Возвращает только контрол Input, без Form.Item и CardinalityWrapper.
 */
export const PathStringFieldNode: React.FC<FieldComponentProps> = ({
  disabled,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <Input
      placeholder={placeholder}
      disabled={disabled}
      value={value as string}
      onChange={e => onChange?.(e.target.value)}
    />
  );
};
