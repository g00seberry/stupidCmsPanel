import { viewDate } from '@/utils/dateUtils';
import { getValueByPath, pathToString } from '@/utils/pathUtils';
import { Button, DatePicker, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import type { ZEditDatePickerList } from '../ZComponent';
import type { FieldRendererProps } from '../types';

/**
 * Пропсы компонента DatePickerListWidget.
 */
type PropsDatePickerListWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditDatePickerList;
};

/**
 * Виджет для списка полей выбора даты (DatePicker для массива).
 * Рендерит список DatePicker полей для работы с массивом дат.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент для работы со списком полей выбора даты.
 */
export const DatePickerListWidget: React.FC<PropsDatePickerListWidget> = observer(
  ({ model, namePath, componentConfig }) => {
    const value = getValueByPath(model.values, namePath);
    // Значение должно быть массивом
    const arrayValue = Array.isArray(value) ? value : [];

    const handleItemChange = (index: number, newValue: Dayjs | null) => {
      const newArray = [...arrayValue];
      newArray[index] = newValue;
      model.setValue(namePath, newArray);
    };

    const handleAdd = () => {
      model.addArrayItem(namePath, null);
    };

    const handleRemove = (index: number) => {
      model.removeArrayItem(namePath, index);
    };

    return (
      <div>
        {arrayValue.map((item, index) => {
          // Преобразуем строку в dayjs объект, если значение - строка
          const dayjsValue: Dayjs | null =
            typeof item === 'string' ? viewDate(item) : (item ?? null);
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
  }
);
