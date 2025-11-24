import { Button, Card, Space } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import type { ZBlueprintSchema, ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { FormModel } from '@/components/schemaForm/FormModel';
import { getFieldRenderer } from './widgetRegistry';
import { getValueByPath, pathToString, type PathSegment } from '@/utils/pathUtils';

/**
 * Пропсы компонента SchemaForm.
 */
export interface PropsSchemaForm<E extends ZBlueprintSchema> {
  /** Модель формы на MobX для управления состоянием. */
  model: FormModel<E>;
  /** Схема сущности для формы. */
  schema: E;
  /** Флаг режима только для чтения. */
  readonly?: boolean;
}

/**
 * Компонент формы на основе схемы сущности.
 * Рендерит форму напрямую через контролируемые компоненты, синхронизированные с FormModel на MobX.
 * Поддерживает примитивные поля и json поля с cardinality 'one' и 'many'.
 * Поддерживает режим только для чтения через проп `readonly`.
 * Все изменения сразу обновляют FormModel.values.
 * @template E Схема сущности.
 * @example
 * const model = new FormModel(schema, initialValues);
 * <SchemaForm model={model} schema={schema} readonly={false} />
 */
export const SchemaForm = observer(
  <E extends ZBlueprintSchema>({ model, schema, readonly = false }: PropsSchemaForm<E>) => {
    /**
     * Обработчик изменения значения поля.
     * Обновляет значение в FormModel по указанному пути.
     * @param path Путь к полю.
     * @param value Новое значение.
     */
    const handleFieldChange = (path: PathSegment[], value: any): void => {
      model.setValue(path, value);
    };

    /**
     * Обработчик добавления элемента в массив.
     * @param path Путь к массиву.
     * @param defaultValue Значение по умолчанию для нового элемента.
     */
    const handleAddArrayItem = (path: PathSegment[], defaultValue: any): void => {
      model.addArrayItem(path, defaultValue);
    };

    /**
     * Обработчик удаления элемента из массива.
     * @param path Путь к массиву.
     * @param index Индекс элемента для удаления.
     */
    const handleRemoveArrayItem = (path: PathSegment[], index: number): void => {
      model.removeArrayItem(path, index);
    };

    /**
     * Рекурсивно рендерит поле формы на основе его схемы.
     * @param key Имя поля.
     * @param field Схема поля.
     * @param parentPath Путь к родительскому полю (для вложенных полей).
     * @param isReadonly Флаг режима только для чтения.
     * @returns React-компонент поля формы.
     */
    const renderField = (
      key: string,
      field: ZBlueprintSchemaField,
      parentPath: PathSegment[] = [],
      isReadonly: boolean = readonly
    ): React.ReactNode => {
      const namePath = [...parentPath, key];
      const pathStr = pathToString(namePath);
      const currentValue = getValueByPath(model.values, namePath);
      const error = model.errorFor(pathStr);

      // Json поля
      if (field.type === 'json') {
        // Json поле с cardinality: 'one'
        if (field.cardinality === 'one') {
          return (
            <Card key={pathStr} title={key} style={{ marginBottom: 16 }}>
              {field.children &&
                Object.entries(field.children).map(([childKey, childField]) =>
                  renderField(childKey, childField, namePath, isReadonly)
                )}
            </Card>
          );
        }

        // Json поле с cardinality: 'many'
        const arrayValue = Array.isArray(currentValue) ? currentValue : [];
        return (
          <Card
            key={pathStr}
            title={key}
            extra={
              !isReadonly ? (
                <Button onClick={() => handleAddArrayItem(namePath, {})}>Добавить</Button>
              ) : null
            }
            style={{ marginBottom: 16 }}
          >
            {arrayValue.map((_item, index) => {
              const itemPath = [...namePath, index];
              const itemPathStr = pathToString(itemPath);

              return (
                <Card
                  key={itemPathStr}
                  size="small"
                  style={{ marginBottom: 8 }}
                  extra={
                    !isReadonly ? (
                      <Button onClick={() => handleRemoveArrayItem(namePath, index)}>
                        Удалить
                      </Button>
                    ) : null
                  }
                >
                  {field.children &&
                    Object.entries(field.children).map(([childKey, childField]) =>
                      renderField(childKey, childField, itemPath, isReadonly)
                    )}
                </Card>
              );
            })}
          </Card>
        );
      }

      // Для примитивных полей
      const renderer = getFieldRenderer(field);

      // Примитивное поле с cardinality: 'one'
      if (field.cardinality === 'one') {
        const widgetElement = renderer({
          schema: field,
          namePath,
          value: currentValue,
          onChange: (value: any) => handleFieldChange(namePath, value),
          disabled: isReadonly,
          readOnly: isReadonly,
        });

        return (
          <div key={pathStr} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>{key}</label>
            {widgetElement}
            {error && <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 4 }}>{error}</div>}
          </div>
        );
      }

      // Примитивное поле с cardinality: 'many'
      const arrayValue = Array.isArray(currentValue) ? currentValue : [];
      return (
        <Card
          key={pathStr}
          title={key}
          extra={
            !isReadonly ? (
              <Button onClick={() => handleAddArrayItem(namePath, undefined)}>Добавить</Button>
            ) : null
          }
          style={{ marginBottom: 16 }}
        >
          {arrayValue.map((item, index) => {
            const itemPath = [...namePath, index];
            const itemPathStr = pathToString(itemPath);
            const itemError = model.errorFor(itemPathStr);
            const widgetElement = renderer({
              schema: field,
              namePath: itemPath,
              value: item,
              onChange: (value: any) => handleFieldChange(itemPath, value),
              disabled: isReadonly,
              readOnly: isReadonly,
            });

            return (
              <Space
                key={itemPathStr}
                align="baseline"
                style={{ display: 'flex', marginBottom: 8, width: '100%' }}
              >
                <div style={{ flex: 1 }}>
                  {widgetElement}
                  {itemError && (
                    <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 4 }}>{itemError}</div>
                  )}
                </div>
                {!isReadonly && (
                  <Button onClick={() => handleRemoveArrayItem(namePath, index)}>Удалить</Button>
                )}
              </Space>
            );
          })}
        </Card>
      );
    };

    return (
      <div>{Object.entries(schema.schema).map(([key, field]) => renderField(key, field))}</div>
    );
  }
) as <E extends ZBlueprintSchema>(props: PropsSchemaForm<E>) => React.ReactElement;
