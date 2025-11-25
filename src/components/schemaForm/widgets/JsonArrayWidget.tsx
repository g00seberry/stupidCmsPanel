import { Card, Button } from 'antd';
import type React from 'react';
import type { FieldRendererProps } from '../widgetRegistry';
import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import { getValueByPath, pathToString, type PathSegment } from '@/utils/pathUtils';
import { renderComponentFromConfig } from '../componentRenderer';
import type { ZEditComponent } from '../componentDefs/ZComponent';
import type { FormModel } from '../FormModel';
import { JsonObjectWidget } from './JsonObjectWidget';

/**
 * Пропсы компонента JsonArrayWidget.
 */
type PropsJsonArrayWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent (опционально, так как json рендерит children). */
  componentConfig?: ZEditComponent;
  /** Модель формы для доступа к formConfig и ошибкам. */
  model?: FormModel;
  /** Флаг режима только для чтения. */
  readonly?: boolean;
  /** Обработчик добавления элемента в массив. */
  onAddItem?: (path: PathSegment[], defaultValue: any) => void;
  /** Обработчик удаления элемента из массива. */
  onRemoveItem?: (path: PathSegment[], index: number) => void;
};

/**
 * Виджет для массива JSON объектов (cardinality: 'many').
 * Рендерит массив вложенных объектов как Card с кнопками добавления/удаления.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Card с массивом вложенных объектов.
 */
export const JsonArrayWidget: React.FC<PropsJsonArrayWidget> = ({
  schema,
  namePath,
  value,
  onChange,
  disabled,
  readOnly,
  componentConfig,
  model,
  onAddItem,
  onRemoveItem,
}) => {
  const field = schema as ZBlueprintSchemaField;
  const pathStr = pathToString(namePath);
  const arrayValue = Array.isArray(value) ? value : [];
  const error = model?.errorFor(pathStr);
  const isReadonly = readOnly || disabled;

  if (!field.children) {
    return null;
  }

  // Используем label из конфигурации компонента, если есть
  const labelText = componentConfig?.props.label || pathStr.split('.').pop() || '';

  const handleAddItem = () => {
    if (onAddItem) {
      onAddItem(namePath, {});
    } else {
      onChange?.([...arrayValue, {}]);
    }
  };

  const handleRemoveItem = (index: number) => {
    if (onRemoveItem) {
      onRemoveItem(namePath, index);
    } else {
      const newArray = arrayValue.filter((_, i) => i !== index);
      onChange?.(newArray);
    }
  };

  return (
    <Card
      title={labelText}
      extra={!isReadonly ? <Button onClick={handleAddItem}>Добавить</Button> : null}
      style={{ marginBottom: 16 }}
    >
      {arrayValue.map((item, index) => {
        const itemPath = [...namePath, index];
        const itemPathStr = pathToString(itemPath);
        const itemError = model?.errorFor(itemPathStr);

        return (
          <Card
            key={itemPathStr}
            size="small"
            style={{ marginBottom: 8 }}
            extra={
              !isReadonly ? <Button onClick={() => handleRemoveItem(index)}>Удалить</Button> : null
            }
          >
            {Object.entries(field.children!).map(([childKey, childField]) => {
              const childPath = [...itemPath, childKey];
              const childPathStr = pathToString(childPath);
              const childValue = getValueByPath(item, [childKey]);
              const childError = model?.errorFor(childPathStr);

              // Проверяем, есть ли конфигурация компонента для дочернего поля
              const childComponentConfig = model?.formConfig?.[childPathStr];

              // Для примитивных полей
              if (childField.type !== 'json') {
                if (childField.cardinality === 'one') {
                  const widgetElement = renderComponentFromConfig(childComponentConfig, {
                    schema: childField,
                    namePath: childPath,
                    value: childValue,
                    onChange: (newValue: any) => {
                      const newArray = [...arrayValue];
                      newArray[index] = { ...item, [childKey]: newValue };
                      onChange?.(newArray);
                    },
                    disabled: isReadonly,
                    readOnly: isReadonly,
                  });

                  const childLabelText = childComponentConfig?.props.label || childKey;

                  return (
                    <div key={childPathStr} style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                        {childLabelText}
                      </label>
                      {widgetElement}
                      {childError && (
                        <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 4 }}>
                          {childError}
                        </div>
                      )}
                    </div>
                  );
                }

                // Для массивов примитивов
                const arrayValue = Array.isArray(childValue) ? childValue : [];
                const arrayLabelText = childComponentConfig?.props.label || childKey;
                const widgetElement = renderComponentFromConfig(childComponentConfig, {
                  schema: childField,
                  namePath: childPath,
                  value: arrayValue,
                  onChange: (newValue: any) => {
                    const newArray = [...arrayValue];
                    newArray[index] = { ...item, [childKey]: newValue };
                    onChange?.(newArray);
                  },
                  disabled: isReadonly,
                  readOnly: isReadonly,
                });

                return (
                  <div key={childPathStr} style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                      {arrayLabelText}
                    </label>
                    {widgetElement}
                    {childError && (
                      <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 4 }}>
                        {childError}
                      </div>
                    )}
                  </div>
                );
              }

              // Для вложенных json полей рекурсивно используем JsonObjectWidget
              return (
                <JsonObjectWidget
                  key={childPathStr}
                  schema={childField}
                  namePath={childPath}
                  value={childValue}
                  onChange={(newValue: any) => {
                    const newArray = [...arrayValue];
                    newArray[index] = { ...item, [childKey]: newValue };
                    onChange?.(newArray);
                  }}
                  disabled={isReadonly}
                  readOnly={isReadonly}
                  model={model}
                />
              );
            })}
            {itemError && (
              <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 4 }}>{itemError}</div>
            )}
          </Card>
        );
      })}
      {error && <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 4 }}>{error}</div>}
    </Card>
  );
};
