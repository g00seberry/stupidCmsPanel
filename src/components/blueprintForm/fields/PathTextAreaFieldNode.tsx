import { Input } from 'antd';
import type React from 'react';
import type { FieldComponentProps } from './fieldRegistry';

/**
 * Компонент поля типа text (длинный текст) для работы с FieldNode.
 * Возвращает только контрол Input.TextArea, без Form.Item и CardinalityWrapper.
 */
export const PathTextAreaFieldNode: React.FC<FieldComponentProps> = ({
  disabled,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <Input.TextArea
      rows={4}
      placeholder={placeholder}
      disabled={disabled}
      value={value as string}
      onChange={e => onChange?.(e.target.value)}
    />
  );
};
