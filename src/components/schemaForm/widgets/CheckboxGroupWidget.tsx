import { getValueByPath, pathToString } from '@/utils/pathUtils';
import { Button, Checkbox, Space } from 'antd';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import type { ZEditCheckboxGroup } from '../ZComponent';
import type { FieldRendererProps } from '../types';
import { FieldError } from '../FieldError';
import { FormField } from './common/FormField';

/**
 * Пропсы компонента CheckboxGroupWidget.
 */
type PropsCheckboxGroupWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditCheckboxGroup;
};

/**
 * Виджет для списка чекбоксов (Checkbox для массива).
 * Рендерит список чекбоксов для работы с массивом булевых значений.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент для работы со списком чекбоксов.
 */
export const CheckboxGroupWidget: React.FC<PropsCheckboxGroupWidget> = observer(
  ({ model, namePath, componentConfig }) => {
    const value = getValueByPath(model.values, namePath);
    const pathStr = pathToString(namePath);
    const error = model.errorFor(pathStr);
    const labelText = String(componentConfig?.props.label || namePath[namePath.length - 1]);
    const arrayValue = Array.isArray(value) ? value : [];

    const handleItemChange = (index: number, checked: boolean) => {
      const newArray = [...arrayValue];
      newArray[index] = checked;
      model.setValue(namePath, newArray);
    };

    const handleAdd = () => {
      model.addArrayItem(namePath, false);
    };

    const handleRemove = (index: number) => {
      model.removeArrayItem(namePath, index);
    };

    return (
      <FormField label={labelText} error={error}>
        {arrayValue.map((item, index) => {
          const itemPath = [...namePath, index];
          const itemPathStr = pathToString(itemPath);
          const itemError = model?.errorFor(itemPathStr);

          return (
            <div key={itemPathStr} className="mb-2">
              <Space className="flex" align="baseline">
                <div className="flex-1">
                  <Checkbox
                    checked={item}
                    onChange={e => handleItemChange(index, e.target.checked)}
                  >
                    {componentConfig?.props.label || `Элемент ${index + 1}`}
                  </Checkbox>
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
      </FormField>
    );
  }
);
