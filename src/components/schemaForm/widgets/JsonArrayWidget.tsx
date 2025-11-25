import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import { getValueByPath, pathToString } from '@/utils/pathUtils';
import { Button, Card } from 'antd';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { renderComponentFromConfig } from '../componentRenderer';
import { FieldError } from '../FieldError';
import type { FieldRendererProps } from '../types';
import type { ZEditJsonArray } from '../ZComponent';
import { JsonObjectWidget } from './JsonObjectWidget';

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

    if (!field.children) {
      return null;
    }

    // Используем label из конфигурации компонента, если есть
    const labelText = componentConfig?.props.label || pathStr.split('.').pop() || '';

    const handleAddItem = () => {
      model.addArrayItem(namePath, {});
    };

    const handleRemoveItem = (index: number) => {
      model.removeArrayItem(namePath, index);
    };

    return (
      <Card
        title={labelText}
        extra={<Button onClick={handleAddItem}>Добавить</Button>}
        className="mb-4"
      >
        {arrayValue.map((_, index) => {
          const itemPath = [...namePath, index];
          const itemPathStr = pathToString(itemPath);
          const itemError = model.errorFor(itemPathStr);

          return (
            <Card
              key={itemPathStr}
              size="small"
              className="mb-2"
              extra={<Button onClick={() => handleRemoveItem(index)}>Удалить</Button>}
            >
              {Object.entries(field.children!).map(([childKey, childField]) => {
                const childPath = [...itemPath, childKey];
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
              <FieldError error={itemError} />
            </Card>
          );
        })}
        <FieldError error={error} />
      </Card>
    );
  }
);
