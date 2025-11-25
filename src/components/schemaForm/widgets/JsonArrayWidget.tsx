import { Card, Button } from 'antd';
import type React from 'react';
import { observer } from 'mobx-react-lite';
import type { FieldRendererProps } from '../types';
import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import { getValueByPath, pathToString } from '@/utils/pathUtils';
import { renderComponentFromConfig } from '../componentRenderer';
import type { ZEditComponent } from '../ZComponent';
import { JsonObjectWidget } from './JsonObjectWidget';

/**
 * Пропсы компонента JsonArrayWidget.
 */
type PropsJsonArrayWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent (опционально, так как json рендерит children). */
  componentConfig?: ZEditComponent;
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
        style={{ marginBottom: 16 }}
      >
        {arrayValue.map((_, index) => {
          const itemPath = [...namePath, index];
          const itemPathStr = pathToString(itemPath);
          const itemError = model.errorFor(itemPathStr);

          return (
            <Card
              key={itemPathStr}
              size="small"
              style={{ marginBottom: 8 }}
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
  }
);
