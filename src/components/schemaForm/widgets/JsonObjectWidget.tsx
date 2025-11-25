import { Card } from 'antd';
import React from 'react';
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
  extra?: React.ReactNode;
};

/**
 * Виджет для JSON объекта (cardinality: 'one').
 * Рендерит вложенные поля как Card с children.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Card с вложенными полями.
 */
export const JsonObjectWidget: React.FC<PropsJsonObjectWidget> = observer(
  ({ schema, namePath, componentConfig, model, extra }) => {
    const field = schema as ZBlueprintSchemaField;
    const pathStr = pathToString(namePath);
    const error = model.errorFor(pathStr);

    if (!field.children) {
      return null;
    }

    // Используем label из конфигурации компонента, если есть
    const labelText = componentConfig?.props.label || pathStr.split('.').pop() || '';

    return (
      <Card title={labelText} className="mb-4" extra={extra}>
        {Object.entries(field.children).map(([childKey, childField]) => {
          const childPath = [...namePath, childKey];
          const childPathStr = pathToString(childPath);
          const childComponentConfig = model.formConfig[childPathStr];
          return (
            <React.Fragment key={childPathStr}>
              {renderComponentFromConfig(childComponentConfig, {
                schema: childField,
                namePath: childPath,
                model,
              })}
            </React.Fragment>
          );
        })}
        <FieldError error={error} />
      </Card>
    );
  }
);
