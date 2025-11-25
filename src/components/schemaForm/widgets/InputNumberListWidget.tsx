import { getValueByPath, pathToString } from '@/utils/pathUtils';
import { Button, InputNumber, Space } from 'antd';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import type { ZEditInputNumberList } from '../ZComponent';
import type { FieldRendererProps } from '../types';
import { FieldError } from '../FieldError';

/**
 * Пропсы компонента InputNumberListWidget.
 */
type PropsInputNumberListWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditInputNumberList;
};

/**
 * Виджет для списка числовых полей (InputNumber для массива).
 * Рендерит список InputNumber полей для работы с массивом числовых значений.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент для работы со списком числовых полей.
 */
export const InputNumberListWidget: React.FC<PropsInputNumberListWidget> = observer(
  ({ model, namePath, componentConfig }) => {
    const value = getValueByPath(model.values, namePath);
    const pathStr = pathToString(namePath);
    const error = model.errorFor(pathStr);
    // Значение должно быть массивом
    const arrayValue = Array.isArray(value) ? value : [];

    const handleItemChange = (index: number, newValue: number | null) => {
      const newArray = [...arrayValue];
      newArray[index] = newValue;
      model.setValue(namePath, newArray);
    };

    const handleAdd = () => {
      model.addArrayItem(namePath, undefined);
    };

    const handleRemove = (index: number) => {
      model.removeArrayItem(namePath, index);
    };

    return (
      <div>
        {arrayValue.map((item, index) => {
          const itemPath = [...namePath, index];
          const itemPathStr = pathToString(itemPath);
          const itemError = model?.errorFor(itemPathStr);

          return (
            <div key={itemPathStr} className="mb-2">
              <Space className="flex" align="baseline">
                <div className="flex-1">
                  <InputNumber
                    value={item}
                    onChange={val => handleItemChange(index, val)}
                    placeholder={componentConfig?.props.placeholder}
                    min={componentConfig?.props.min}
                    max={componentConfig?.props.max}
                    step={componentConfig?.props.step}
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
