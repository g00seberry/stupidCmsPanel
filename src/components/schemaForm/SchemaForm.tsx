import { Button, Card, Form, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react';
import type { EntitySchema, FieldSchema } from '@/types/schemaForm';
import type { FormModel } from '@/stores/FormModel';
import { buildAntdRules } from '@/utils/antdRulesBuilder';
import { getFieldRenderer } from './widgetRegistry';
import { pathToString, type PathSegment } from '@/utils/pathUtils';

/**
 * Пропсы компонента SchemaForm.
 */
export interface PropsSchemaForm<E extends EntitySchema> {
  /** Экземпляр формы Ant Design. */
  form: FormInstance;
  /** Модель формы на MobX для управления состоянием. */
  model: FormModel<E>;
  /** Схема сущности для формы. */
  schema: E;
  /** Флаг режима только для чтения. */
  readonly?: boolean;
}

/**
 * Компонент формы на основе схемы сущности.
 * Рендерит форму Ant Design, синхронизированную с FormModel на MobX.
 * Поддерживает примитивные поля и json поля с cardinality 'one' и 'many'.
 * Поддерживает группировку полей через поле `group` в FieldSchema.
 * Поддерживает режим только для чтения через проп `readonly`.
 * Обеспечивает двустороннюю синхронизацию: изменения в форме обновляют модель,
 * изменения в модели обновляют форму (с защитой от циклических обновлений).
 * @template E Схема сущности.
 * @example
 * const [form] = Form.useForm();
 * const model = new FormModel(schema, initialValues);
 * <SchemaForm form={form} model={model} schema={schema} readonly={false} />
 */
export const SchemaForm = observer(
  <E extends EntitySchema>({ form, model, schema, readonly = false }: PropsSchemaForm<E>) => {
    // Флаг для предотвращения циклических обновлений
    const isUpdatingFromModel = useRef(false);
    const previousValuesRef = useRef(model.values);

    // Синхронизация значений из модели в форму
    useEffect(() => {
      // Проверяем, действительно ли значения изменились
      const currentValues = model.values;
      const previousValues = previousValuesRef.current;

      // Простое сравнение по ссылке (для глубокого сравнения можно использовать lodash.isEqual)
      if (currentValues !== previousValues && !isUpdatingFromModel.current) {
        isUpdatingFromModel.current = true;
        form.setFieldsValue(currentValues as any);
        previousValuesRef.current = currentValues;
        // Сбрасываем флаг после небольшой задержки, чтобы избежать конфликтов
        setTimeout(() => {
          isUpdatingFromModel.current = false;
        }, 0);
      }
    }, [form, model.values]);

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
      field: FieldSchema,
      parentPath: PathSegment[] = [],
      isReadonly: boolean = readonly
    ): React.ReactNode => {
      const namePath = [...parentPath, key];
      const pathStr = pathToString(namePath);
      const rules = buildAntdRules(field);

      // Json поля
      if (field.type === 'json') {
        // Json поле с cardinality: 'one'
        if (field.cardinality === 'one') {
          return (
            <Card key={pathStr} title={field.label ?? key} style={{ marginBottom: 16 }}>
              {field.children &&
                Object.entries(field.children).map(([childKey, childField]) =>
                  renderField(childKey, childField, namePath, isReadonly)
                )}
            </Card>
          );
        }

        // Json поле с cardinality: 'many'
        return (
          <Form.List key={pathStr} name={namePath}>
            {(fields, { add, remove }) => (
              <Card
                title={field.label ?? key}
                extra={!isReadonly ? <Button onClick={() => add()}>Добавить</Button> : null}
                style={{ marginBottom: 16 }}
              >
                {fields.map(f => {
                  const itemPath = [...namePath, f.name];
                  const itemPathStr = pathToString(itemPath);

                  return (
                    <Card
                      key={itemPathStr}
                      size="small"
                      style={{ marginBottom: 8 }}
                      extra={
                        !isReadonly ? <Button onClick={() => remove(f.name)}>Удалить</Button> : null
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
            )}
          </Form.List>
        );
      }

      // Для примитивных полей
      const renderer = getFieldRenderer(field);

      // Примитивное поле с cardinality: 'one'
      if (field.cardinality === 'one') {
        const widgetElement = renderer({ schema: field, namePath });
        // Добавляем disabled/readOnly для readonly полей
        const disabledWidget =
          isReadonly && React.isValidElement(widgetElement)
            ? React.cloneElement(widgetElement, { disabled: true, readOnly: true } as any)
            : widgetElement;

        return (
          <Form.Item
            key={pathStr}
            name={namePath}
            label={field.label ?? key}
            rules={rules}
            validateStatus={model.errorFor(pathStr) ? 'error' : undefined}
            help={model.errorFor(pathStr)}
          >
            {disabledWidget}
          </Form.Item>
        );
      }

      // Примитивное поле с cardinality: 'many'
      return (
        <Form.List key={pathStr} name={namePath}>
          {(fields, { add, remove }) => (
            <Card
              title={field.label ?? key}
              extra={!isReadonly ? <Button onClick={() => add()}>Добавить</Button> : null}
            >
              {fields.map(f => {
                const itemPath = [...namePath, f.name];
                const itemPathStr = pathToString(itemPath);
                const widgetElement = renderer({ schema: field, namePath: itemPath });
                // Добавляем disabled/readOnly для readonly полей
                const disabledWidget =
                  isReadonly && React.isValidElement(widgetElement)
                    ? React.cloneElement(widgetElement, { disabled: true, readOnly: true } as any)
                    : widgetElement;

                return (
                  <Space
                    key={itemPathStr}
                    align="baseline"
                    style={{ display: 'flex', marginBottom: 8 }}
                  >
                    <Form.Item
                      name={itemPath}
                      rules={rules}
                      validateStatus={model.errorFor(itemPathStr) ? 'error' : undefined}
                      help={model.errorFor(itemPathStr)}
                      style={{ flex: 1 }}
                    >
                      {disabledWidget}
                    </Form.Item>
                    {!isReadonly && <Button onClick={() => remove(f.name)}>Удалить</Button>}
                  </Space>
                );
              })}
            </Card>
          )}
        </Form.List>
      );
    };

    // Группируем поля по group
    const groupedFields = new Map<string, Array<[string, FieldSchema]>>();
    const ungroupedFields: Array<[string, FieldSchema]> = [];

    for (const [key, field] of Object.entries(schema.schema)) {
      if (field.group) {
        if (!groupedFields.has(field.group)) {
          groupedFields.set(field.group, []);
        }
        groupedFields.get(field.group)!.push([key, field]);
      } else {
        ungroupedFields.push([key, field]);
      }
    }

    return (
      <Form
        form={form}
        layout="vertical"
        initialValues={model.values}
        onValuesChange={(_, allValues) => {
          // Обновляем модель только если изменение идёт не из модели
          if (!isUpdatingFromModel.current) {
            model.setAll(allValues);
            previousValuesRef.current = model.values;
          }
        }}
      >
        {/* Поля без группы */}
        {ungroupedFields.map(([key, field]) => renderField(key, field))}

        {/* Группированные поля */}
        {Array.from(groupedFields.entries()).map(([groupName, fields]) => (
          <Card key={groupName} title={groupName} style={{ marginBottom: 16 }}>
            {fields.map(([key, field]) => renderField(key, field))}
          </Card>
        ))}
      </Form>
    );
  }
) as <E extends EntitySchema>(props: PropsSchemaForm<E>) => React.ReactElement;
