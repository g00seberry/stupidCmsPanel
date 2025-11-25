import { DatePicker, Button, Space } from 'antd';
import type React from 'react';
import type { Dayjs } from 'dayjs';
import type { FieldRendererProps } from '../FieldRendererProps';
import type { ZEditDatePicker } from '../componentDefs/ZComponent';
import { viewDate } from '@/utils/dateUtils';
import { pathToString } from '@/utils/pathUtils';

/**
 * Пропсы компонента DatePickerListWidget.
 */
type PropsDatePickerListWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditDatePicker;
};

/**
 * Виджет для списка полей выбора даты (DatePicker для массива).
 * Рендерит список DatePicker полей для работы с массивом дат.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент для работы со списком полей выбора даты.
 */
export const DatePickerListWidget: React.FC<PropsDatePickerListWidget> = ({
  value,
  onChange,
  componentConfig,
  namePath,
  model,
}) => {
  // Значение должно быть массивом
  const arrayValue = Array.isArray(value) ? value : [];

  const handleItemChange = (index: number, newValue: Dayjs | null) => {
    const newArray = [...arrayValue];
    newArray[index] = newValue;
    onChange?.(newArray);
  };

  const handleAdd = () => {
    onChange?.([...arrayValue, null]);
  };

  const handleRemove = (index: number) => {
    const newArray = arrayValue.filter((_, i) => i !== index);
    onChange?.(newArray);
  };

  return (
    <div>
      {arrayValue.map((item, index) => {
        // Преобразуем строку в dayjs объект, если значение - строка
        const dayjsValue: Dayjs | null = typeof item === 'string' ? viewDate(item) : (item ?? null);
        const itemPath = [...namePath, index];
        const itemPathStr = pathToString(itemPath);
        const itemError = model?.errorFor(itemPathStr);

        return (
          <div key={index} style={{ marginBottom: 8 }}>
            <Space style={{ display: 'flex' }} align="baseline">
              <div style={{ flex: 1 }}>
                <DatePicker
                  value={dayjsValue}
                  onChange={value => handleItemChange(index, value)}
                  placeholder={componentConfig?.props.placeholder}
                  format={componentConfig?.props.format}
                  style={{ width: '100%' }}
                />
                {itemError && (
                  <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 4 }}>{itemError}</div>
                )}
              </div>
              <Button onClick={() => handleRemove(index)}>Удалить</Button>
            </Space>
          </div>
        );
      })}
      <Button onClick={handleAdd} style={{ marginTop: 8 }}>
        Добавить
      </Button>
    </div>
  );
};
