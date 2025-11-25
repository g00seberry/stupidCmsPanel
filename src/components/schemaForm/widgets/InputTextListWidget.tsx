import { getValueByPath, pathToString } from '@/utils/pathUtils';
import { Button, Input, Space } from 'antd';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import type { ZEditInputTextList } from '../ZComponent';
import type { FieldRendererProps } from '../types';
import { FieldError } from '../FieldError';

/**
 * Пропсы компонента InputTextListWidget.
 */
type PropsInputTextListWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditInputTextList;
};

/**
 * Виджет для списка текстовых полей (Input для массива).
 * Рендерит список Input полей для работы с массивом строковых значений.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент для работы со списком текстовых полей.
 */
export const InputTextListWidget: React.FC<PropsInputTextListWidget> = observer(
  ({ model, namePath, componentConfig }) => {
    const value = getValueByPath(model.values, namePath);
    const pathStr = pathToString(namePath);
    const error = model.errorFor(pathStr);
    // Значение должно быть массивом
    const arrayValue = Array.isArray(value) ? value : [];

    const handleItemChange = (index: number, newValue: string) => {
      const newArray = [...arrayValue];
      newArray[index] = newValue;
      model.setValue(namePath, newArray);
    };

    const handleAdd = () => {
      model.addArrayItem(namePath, '');
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
                  <Input
                    value={item}
                    onChange={e => handleItemChange(index, e.target.value)}
                    placeholder={componentConfig?.props.placeholder}
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
