import { DatePicker } from 'antd';
import type React from 'react';
import type { Dayjs } from 'dayjs';
import type { FieldRendererProps } from '../FieldRendererProps';
import type { ZEditDatePicker } from '../componentDefs/ZComponent';
import { viewDate } from '@/utils/dateUtils';

/**
 * Пропсы компонента DatePickerWidget.
 */
type PropsDatePickerWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditDatePicker;
};

/**
 * Виджет для выбора даты (DatePicker).
 * Рендерит DatePicker с настройками из конфигурации компонента.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент DatePicker для выбора даты.
 */
export const DatePickerWidget: React.FC<PropsDatePickerWidget> = ({
  value,
  onChange,
  componentConfig,
}) => {
  // Преобразуем строку в dayjs объект, если значение - строка
  const dayjsValue: Dayjs | null = typeof value === 'string' ? viewDate(value) : (value ?? null);

  return (
    <DatePicker
      value={dayjsValue}
      onChange={onChange}
      placeholder={componentConfig?.props.placeholder}
      format={componentConfig?.props.format}
      style={{ width: '100%' }}
    />
  );
};
