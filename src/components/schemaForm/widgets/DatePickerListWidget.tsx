import { viewDate } from '@/utils/dateUtils';
import { getValueByPath, pathToString } from '@/utils/pathUtils';
import { Button, DatePicker, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import type { ZEditDatePickerList } from '../ZComponent';
import type { FieldRendererProps } from '../types';
import { FieldError } from '../FieldError';

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
    const pathStr = pathToString(namePath);
    const error = model.errorFor(pathStr);
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
            <div key={itemPathStr} className="mb-2">
              <Space className="flex" align="baseline">
                <div className="flex-1">
                  <DatePicker
                    value={dayjsValue}
                    onChange={value => handleItemChange(index, value)}
                    placeholder={componentConfig?.props.placeholder}
                    format={componentConfig?.props.format}
                    className="w-full"
                  />
                  <FieldError error={itemError} />
                </div>
                <Button onClick={() => handleRemove(index)}>Удалить</Button>
              </Space>
            </div>
          );
        })}
        <Button onClick={handleAdd} className="mt-2">
          Добавить
        </Button>
        <FieldError error={error} />
      </div>
    );
  }
);
