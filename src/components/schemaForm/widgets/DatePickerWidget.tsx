import { DatePicker } from 'antd';
import type React from 'react';
import { observer } from 'mobx-react-lite';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
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

    // Преобразуем значение в dayjs объект
    let dayjsValue: Dayjs | null = null;
    if (value === null || value === undefined) {
      dayjsValue = null;
    } else if (typeof value === 'string') {
      dayjsValue = viewDate(value);
    } else if (dayjs.isDayjs(value)) {
      dayjsValue = value;
    } else if (value instanceof Date) {
      dayjsValue = dayjs(value);
    } else {
      // Пытаемся преобразовать в dayjs, если это не dayjs объект
      const parsed = dayjs(value);
      dayjsValue = parsed.isValid() ? parsed : null;
    }

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
