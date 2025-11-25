import { Card } from 'antd';
import type React from 'react';
import { observer } from 'mobx-react-lite';
import type { FieldRendererProps } from '../types';
import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import { pathToString } from '@/utils/pathUtils';
import { renderComponentFromConfig } from '../componentRenderer';
import type { ZEditJsonObject } from '../ZComponent';
import { FieldError } from '../FieldError';

/**
 * Пропсы компонента JsonObjectWidget.
 */
type PropsJsonObjectWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent (опционально, так как json рендерит children). */
  componentConfig?: ZEditJsonObject;
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
      <Card title={labelText} className="mb-4">
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
                <div key={childPathStr} className="mb-4">
                  <label className="block mb-1 font-medium">{childLabelText}</label>
                  {widgetElement}
                  <FieldError error={childError} />
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
              <div key={childPathStr} className="mb-4">
                <label className="block mb-1 font-medium">{arrayLabelText}</label>
                {widgetElement}
                <FieldError error={childError} />
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
        <FieldError error={error} />
      </Card>
    );
  }
);
