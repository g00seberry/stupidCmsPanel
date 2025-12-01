import { getValueByPath, pathToString } from '@/utils/pathUtils';
import { Button, Input, Space } from 'antd';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import type { ZEditTextareaList } from '../ZComponent';
import type { FieldRendererProps } from '../types';
import { FieldError } from '../FieldError';
import { FormField } from './common/FormField';

/**
 * Пропсы компонента TextareaListWidget.
 */
type PropsTextareaListWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditTextareaList;
};

/**
 * Виджет для списка многострочных текстовых полей (TextArea для массива).
 * Рендерит список TextArea полей для работы с массивом текстовых значений.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент для работы со списком многострочных текстовых полей.
 */
export const TextareaListWidget: React.FC<PropsTextareaListWidget> = observer(
  ({ model, namePath, componentConfig }) => {
    const value = getValueByPath(model.values, namePath);
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
      <FormField model={model} namePath={namePath} componentConfig={componentConfig}>
        {arrayValue.map((item, index) => {
          const itemPath = [...namePath, index];
          const itemPathStr = pathToString(itemPath);
          const itemError = model?.errorFor(itemPathStr);

          return (
            <div key={itemPathStr} className="mb-2">
              <Space direction="vertical" className="flex w-full">
                <Input.TextArea
                  value={item}
                  onChange={e => handleItemChange(index, e.target.value)}
                  placeholder={componentConfig?.props.placeholder}
                  rows={componentConfig?.props.rows}
                  autoSize={!componentConfig?.props.rows}
                  className="w-full"
                />
                <FieldError error={itemError} />
                <Button onClick={() => handleRemove(index)}>Удалить</Button>
              </Space>
            </div>
          );
        })}
        <Button onClick={handleAdd} className="mt-2">
          Добавить
        </Button>
      </FormField>
    );
  }
);
