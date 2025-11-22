import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import type React from 'react';
import type { FieldComponentProps } from './fieldRegistry';

/**
 * Компонент поля типа datetime (дата и время) для работы с FieldNode.
 * Возвращает только контрол DatePicker, без Form.Item и CardinalityWrapper.
 */
export const PathDateTimeFieldNode: React.FC<FieldComponentProps> = ({
  disabled,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <DatePicker
      showTime
      style={{ width: '100%' }}
      format="YYYY-MM-DD HH:mm:ss"
      placeholder={placeholder}
      disabled={disabled}
      value={value as Dayjs | null}
      onChange={date => onChange?.(date)}
    />
  );
};
