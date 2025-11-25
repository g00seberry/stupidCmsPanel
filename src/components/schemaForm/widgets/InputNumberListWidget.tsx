import { InputNumber, Button, Space } from 'antd';
import type React from 'react';
import type { FieldRendererProps } from '../widgetRegistry';
import type { ZEditInputNumber } from '../componentDefs/ZComponent';
import { pathToString } from '@/utils/pathUtils';

/**
 * Пропсы компонента InputNumberListWidget.
 */
type PropsInputNumberListWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditInputNumber;
};

/**
 * Виджет для списка числовых полей (InputNumber для массива).
 * Рендерит список InputNumber полей для работы с массивом числовых значений.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент для работы со списком числовых полей.
 */
export const InputNumberListWidget: React.FC<PropsInputNumberListWidget> = ({
  value,
  onChange,
  disabled,
  readOnly,
  componentConfig,
  namePath,
  model,
}) => {
  // Значение должно быть массивом
  const arrayValue = Array.isArray(value) ? value : [];

  const handleItemChange = (index: number, newValue: number | null) => {
    const newArray = [...arrayValue];
    newArray[index] = newValue;
    onChange?.(newArray);
  };

  const handleAdd = () => {
    onChange?.([...arrayValue, undefined]);
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
                <InputNumber
                  value={item}
                  onChange={handleItemChange.bind(null, index)}
                  placeholder={componentConfig?.props.placeholder}
                  min={componentConfig?.props.min}
                  max={componentConfig?.props.max}
                  step={componentConfig?.props.step}
                  disabled={disabled}
                  readOnly={readOnly}
                  style={{ width: '100%' }}
                />
                {itemError && (
                  <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 4 }}>{itemError}</div>
                )}
              </div>
              {!readOnly && (
                <Button onClick={() => handleRemove(index)} disabled={disabled}>
                  Удалить
                </Button>
              )}
            </Space>
          </div>
        );
      })}
      {!readOnly && (
        <Button onClick={handleAdd} disabled={disabled} style={{ marginTop: 8 }}>
          Добавить
        </Button>
      )}
    </div>
  );
};
