import { observer } from 'mobx-react-lite';
import React from 'react';
import type { ZBlueprintSchema, ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { FormModel } from '@/components/schemaForm/FormModel';
import { getValueByPath, pathToString, type PathSegment } from '@/utils/pathUtils';
import { renderComponentFromConfig } from './componentRenderer';

/**
 * Пропсы компонента SchemaForm.
 */
export interface PropsSchemaForm {
  /** Модель формы на MobX для управления состоянием. */
  model: FormModel;
  /** Схема сущности для формы. */
  schema: ZBlueprintSchema;
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
export const SchemaForm = observer(({ model, schema, readonly = false }: PropsSchemaForm) => {
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

    // Получаем конфигурацию компонента (кастомную или дефолтную)
    const componentConfig = model.formConfig[pathStr];

    // Всегда используем renderComponentFromConfig для рендеринга
    // Если конфигурации нет, она будет создана автоматически на основе типа данных
    const widgetElement = renderComponentFromConfig(componentConfig, {
      schema: field,
      namePath,
      value: currentValue,
      onChange: (value: any) => handleFieldChange(namePath, value),
      disabled: isReadonly,
      readOnly: isReadonly,
      model,
      onAddArrayItem: handleAddArrayItem,
      onRemoveArrayItem: handleRemoveArrayItem,
    });

    // Для примитивных полей добавляем label и ошибки
    const labelText = componentConfig?.props.label || key;

    return (
      <div key={pathStr} style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>{labelText}</label>
        {widgetElement ?? <div>No widget found</div>}
        {error && <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 4 }}>{error}</div>}
      </div>
    );
  };

  return <div>{Object.entries(schema.schema).map(([key, field]) => renderField(key, field))}</div>;
});
