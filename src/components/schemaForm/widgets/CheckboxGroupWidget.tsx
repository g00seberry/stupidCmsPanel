import { Button, Checkbox, Space } from 'antd';
import type React from 'react';
import type { FieldRendererProps } from '../FieldRendererProps';
import type { ZEditCheckbox } from '../componentDefs/ZComponent';
import { pathToString } from '@/utils/pathUtils';

/**
 * Пропсы компонента CheckboxGroupWidget.
 */
type PropsCheckboxGroupWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditCheckbox;
};

/**
 * Виджет для списка чекбоксов (Checkbox для массива).
 * Рендерит список чекбоксов для работы с массивом булевых значений.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент для работы со списком чекбоксов.
 */
export const CheckboxGroupWidget: React.FC<PropsCheckboxGroupWidget> = ({
  value,
  onChange,
  componentConfig,
  namePath,
  model,
}) => {
  // Значение должно быть массивом булевых значений
  const arrayValue = Array.isArray(value) ? value : [];

  const handleItemChange = (index: number, checked: boolean) => {
    const newArray = [...arrayValue];
    newArray[index] = checked;
    onChange?.(newArray);
  };

  const handleAdd = () => {
    onChange?.([...arrayValue, false]);
  };

  const handleRemove = (index: number) => {
    const newArray = arrayValue.filter((_, i) => i !== index);
    onChange?.(newArray);
  };

  return (
    <div>
      {arrayValue.map((item, index) => {
        const itemPath = [...namePath, index];
        const itemPathStr = pathToString(itemPath);
        const itemError = model?.errorFor(itemPathStr);

        return (
          <div key={index} style={{ marginBottom: 8 }}>
            <Space style={{ display: 'flex' }} align="baseline">
              <div style={{ flex: 1 }}>
                <Checkbox checked={item} onChange={e => handleItemChange(index, e.target.checked)}>
                  {componentConfig?.props.label || `Элемент ${index + 1}`}
                </Checkbox>
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
