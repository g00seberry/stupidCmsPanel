import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import { getValueByPath, pathToString } from '@/utils/pathUtils';
import { Button, Card } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { FieldError } from '../FieldError';
import type { FieldRendererProps } from '../types';
import type { ZEditJsonArray, ZEditJsonObject } from '../ZComponent';
import { JsonObjectWidget } from './JsonObjectWidget';
import { FieldTitle } from './common/FieldTitle';
import { getFieldLabel } from './common/getFieldLabel';

/**
 * Пропсы компонента JsonArrayWidget.
 */
type PropsJsonArrayWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent (опционально, так как json рендерит children). */
  componentConfig?: ZEditJsonArray;
};

/**
 * Виджет для массива JSON объектов (cardinality: 'many').
 * Рендерит массив вложенных объектов как Card с кнопками добавления/удаления.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Card с массивом вложенных объектов.
 */
export const JsonArrayWidget: React.FC<PropsJsonArrayWidget> = observer(
  ({ schema, namePath, componentConfig, model }) => {
    const field = schema as ZBlueprintSchemaField;
    const pathStr = pathToString(namePath);
    const value = getValueByPath(model.values, namePath);
    const arrayValue = Array.isArray(value) ? value : [];
    const error = model.errorFor(pathStr);
    const isOutdated = model.isOutdated(namePath);

    if (!field.children) {
      return null;
    }

    const labelText = getFieldLabel(componentConfig, namePath);

    const handleAddItem = () => {
      model.addArrayItem(namePath, {});
    };

    const handleRemoveItem = (index: number) => {
      model.removeArrayItem(namePath, index);
    };

    return (
      <Card
        title={<FieldTitle label={labelText} isOutdated={isOutdated} />}
        extra={<Button onClick={handleAddItem}>Добавить</Button>}
        className="mb-4"
      >
        {arrayValue.map((_, index) => {
          const itemPath = [...namePath, index];
          const itemPathStr = pathToString(itemPath);
          const childComponentConfig = {
            name: 'jsonObject',
            ...componentConfig,
          } as ZEditJsonObject;
          return (
            <JsonObjectWidget
              key={itemPathStr}
              schema={field}
              namePath={itemPath}
              componentConfig={childComponentConfig}
              model={model}
              extra={<Button onClick={() => handleRemoveItem(index)}>Удалить</Button>}
            />
          );
        })}
        <FieldError error={error} />
      </Card>
    );
  }
);
