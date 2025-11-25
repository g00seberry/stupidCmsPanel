import { Card } from 'antd';
import type React from 'react';
import type { FieldRendererProps } from '../FieldRendererProps';
import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import { getValueByPath, pathToString } from '@/utils/pathUtils';
import { renderComponentFromConfig } from '../componentRenderer';
import type { ZEditComponent } from '../componentDefs/ZComponent';
import type { FormModel } from '../FormModel';

/**
 * Пропсы компонента JsonObjectWidget.
 */
type PropsJsonObjectWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent (опционально, так как json рендерит children). */
  componentConfig?: ZEditComponent;
  /** Модель формы для доступа к formConfig и ошибкам. */
  model?: FormModel;
  /** Флаг режима только для чтения. */
  readonly?: boolean;
};

/**
 * Виджет для JSON объекта (cardinality: 'one').
 * Рендерит вложенные поля как Card с children.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Card с вложенными полями.
 */
export const JsonObjectWidget: React.FC<PropsJsonObjectWidget> = ({
  schema,
  namePath,
  value,
  onChange,
  componentConfig,
  model,
}) => {
  const field = schema as ZBlueprintSchemaField;
  const pathStr = pathToString(namePath);
  const currentValue = value ?? {};
  const error = model?.errorFor(pathStr);

  if (!field.children) {
    return null;
  }

  // Используем label из конфигурации компонента, если есть
  const labelText = componentConfig?.props.label || pathStr.split('.').pop() || '';

  return (
    <Card title={labelText} style={{ marginBottom: 16 }}>
      {Object.entries(field.children).map(([childKey, childField]) => {
        const childPath = [...namePath, childKey];
        const childPathStr = pathToString(childPath);
        const childValue = getValueByPath(currentValue, [childKey]);
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
                const newObject = { ...currentValue, [childKey]: newValue };
                onChange?.(newObject);
              },
            });

            const childLabelText = childComponentConfig?.props.label || childKey;

            return (
              <div key={childPathStr} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  {childLabelText}
                </label>
                {widgetElement}
                {childError && (
                  <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 4 }}>{childError}</div>
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
              const newObject = { ...currentValue, [childKey]: newValue };
              onChange?.(newObject);
            },
          });

          return (
            <div key={childPathStr} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                {arrayLabelText}
              </label>
              {widgetElement}
              {childError && (
                <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 4 }}>{childError}</div>
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
              const newObject = { ...currentValue, [childKey]: newValue };
              onChange?.(newObject);
            }}
            model={model}
          />
        );
      })}
      {error && <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 4 }}>{error}</div>}
    </Card>
  );
};
