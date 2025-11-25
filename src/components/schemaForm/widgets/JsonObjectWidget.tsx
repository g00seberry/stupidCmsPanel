import { Card } from 'antd';
import type React from 'react';
import { observer } from 'mobx-react-lite';
import type { FieldRendererProps } from '../types';
import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import { pathToString } from '@/utils/pathUtils';
import { renderComponentFromConfig } from '../componentRenderer';
import type { ZEditComponent } from '../ZComponent';

/**
 * Пропсы компонента JsonObjectWidget.
 */
type PropsJsonObjectWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent (опционально, так как json рендерит children). */
  componentConfig?: ZEditComponent;
};

/**
 * Виджет для JSON объекта (cardinality: 'one').
 * Рендерит вложенные поля как Card с children.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Card с вложенными полями.
 */
export const JsonObjectWidget: React.FC<PropsJsonObjectWidget> = observer(
  ({ schema, namePath, componentConfig, model }) => {
    const field = schema as ZBlueprintSchemaField;
    const pathStr = pathToString(namePath);
    const error = model.errorFor(pathStr);

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
          const childError = model.errorFor(childPathStr);

          // Проверяем, есть ли конфигурация компонента для дочернего поля
          const childComponentConfig = model.formConfig[childPathStr];

          // Для примитивных полей
          if (childField.type !== 'json') {
            if (childField.cardinality === 'one') {
              const widgetElement = renderComponentFromConfig(childComponentConfig, {
                schema: childField,
                namePath: childPath,
                model,
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
            const arrayLabelText = childComponentConfig?.props.label || childKey;
            const widgetElement = renderComponentFromConfig(childComponentConfig, {
              schema: childField,
              namePath: childPath,
              model,
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
              model={model}
            />
          );
        })}
        {error && <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 4 }}>{error}</div>}
      </Card>
    );
  }
);
