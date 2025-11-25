import { Input, Button, Space } from 'antd';
import type React from 'react';
import type { FieldRendererProps } from '../widgetRegistry';
import type { ZEditComponent } from '../componentDefs/ZComponent';
import { pathToString } from '@/utils/pathUtils';

/**
 * Пропсы компонента TextareaListWidget.
 */
type PropsTextareaListWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: Extract<ZEditComponent, { name: 'textarea' }>;
};

/**
 * Виджет для списка многострочных текстовых полей (TextArea для массива).
 * Рендерит список TextArea полей для работы с массивом текстовых значений.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент для работы со списком многострочных текстовых полей.
 */
export const TextareaListWidget: React.FC<PropsTextareaListWidget> = ({
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

  const handleItemChange = (index: number, newValue: string) => {
    const newArray = [...arrayValue];
    newArray[index] = newValue;
    onChange?.(newArray);
  };

  const handleAdd = () => {
    onChange?.([...arrayValue, '']);
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
            <Space direction="vertical" style={{ display: 'flex', width: '100%' }}>
              <Input.TextArea
                value={item}
                onChange={e => handleItemChange(index, e.target.value)}
                placeholder={componentConfig?.props.placeholder}
                rows={componentConfig?.props.rows}
                autoSize={!componentConfig?.props.rows}
                disabled={disabled}
                readOnly={readOnly}
                style={{ width: '100%' }}
              />
              {itemError && (
                <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 4 }}>{itemError}</div>
              )}
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
