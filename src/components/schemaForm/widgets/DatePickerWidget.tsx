import { DatePicker } from 'antd';
import type React from 'react';
import { observer } from 'mobx-react-lite';
import type { Dayjs } from 'dayjs';
import type { FieldRendererProps } from '../types';
import type { ZEditDatePicker } from '../ZComponent';
import { viewDate } from '@/utils/dateUtils';
import { getValueByPath, pathToString } from '@/utils/pathUtils';
import { FormField } from './common/FormField';

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
export const DatePickerWidget: React.FC<PropsDatePickerWidget> = observer(
  ({ model, namePath, componentConfig }) => {
    const value = getValueByPath(model.values, namePath);
    const pathStr = pathToString(namePath);
    const error = model.errorFor(pathStr);
    const labelText = String(componentConfig?.props.label || namePath[namePath.length - 1]);
    // Преобразуем строку в dayjs объект, если значение - строка
    const dayjsValue: Dayjs | null = typeof value === 'string' ? viewDate(value) : (value ?? null);

    return (
      <FormField label={labelText} error={error}>
        <DatePicker
          value={dayjsValue}
          onChange={val => model.setValue(namePath, val)}
          placeholder={componentConfig?.props.placeholder}
          format={componentConfig?.props.format}
          className="w-full"
        />
      </FormField>
    );
  }
);
