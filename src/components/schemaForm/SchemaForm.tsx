import { observer } from 'mobx-react-lite';
import React from 'react';
import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { FormModel } from '@/components/schemaForm/FormModel';
import { pathToString, type PathSegment } from '@/utils/pathUtils';
import { renderComponentFromConfig } from './componentRenderer';

/**
 * Пропсы компонента SchemaForm.
 */
export interface PropsSchemaForm {
  /** Модель формы на MobX для управления состоянием. */
  model: FormModel;
}

/**
 * Компонент формы на основе схемы сущности.
 * Рендерит форму напрямую через контролируемые компоненты, синхронизированные с FormModel на MobX.
 * Поддерживает примитивные поля и json поля с cardinality 'one' и 'many'.
 * Все изменения сразу обновляют FormModel.values.
 * @example
 * const model = new FormModel(schema, initialValues);
 * <SchemaForm model={model} />
 */
export const SchemaForm = observer(({ model }: PropsSchemaForm) => {
  /**
   * Рекурсивно рендерит поле формы на основе его схемы.
   * @param key Имя поля.
   * @param field Схема поля.
   * @param parentPath Путь к родительскому полю (для вложенных полей).
   * @returns React-компонент поля формы.
   */
  const renderField = (
    key: string,
    field: ZBlueprintSchemaField,
    parentPath: PathSegment[] = []
  ): React.ReactNode => {
    const namePath = [...parentPath, key];
    const pathStr = pathToString(namePath);
    const error = model.errorFor(pathStr);
    // Получаем конфигурацию компонента (кастомную или дефолтную)
    const componentConfig = model.formConfig[pathStr];

    // Всегда используем renderComponentFromConfig для рендеринга
    // Если конфигурации нет, она будет создана автоматически на основе типа данных
    const widgetElement = renderComponentFromConfig(componentConfig, {
      schema: field,
      namePath,
      model,
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

  return (
    <div>{Object.entries(model.schema.schema).map(([key, field]) => renderField(key, field))}</div>
  );
});
