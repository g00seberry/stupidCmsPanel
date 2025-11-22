import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import type React from 'react';
import type { FieldComponentProps } from './fieldRegistry';

/**
 * Компонент поля типа date (дата без времени) для работы с FieldNode.
 * Возвращает только контрол DatePicker, без Form.Item и CardinalityWrapper.
 */
export const PathDateFieldNode: React.FC<FieldComponentProps> = ({
  disabled,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <DatePicker
      style={{ width: '100%' }}
      format="YYYY-MM-DD"
      placeholder={placeholder}
      disabled={disabled}
      value={value as Dayjs | null}
      onChange={date => onChange?.(date)}
    />
  );
};
