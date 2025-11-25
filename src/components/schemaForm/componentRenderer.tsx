import type React from 'react';
import type { FieldRendererProps } from './widgetRegistry';
import type {
  ZEditCheckbox,
  ZEditComponent,
  ZEditDatePicker,
  ZEditDateTimePicker,
  ZEditInputNumber,
  ZEditInputText,
  ZEditJsonObject,
  ZEditSelect,
  ZEditTextarea,
} from './componentDefs/ZComponent';
import type { ZCardinality, ZDataType } from '@/types/path';
import { InputTextWidget } from './widgets/InputTextWidget';
import { TextareaWidget } from './widgets/TextareaWidget';
import { InputNumberWidget } from './widgets/InputNumberWidget';
import { CheckboxWidget } from './widgets/CheckboxWidget';
import { DatePickerWidget } from './widgets/DatePickerWidget';
import { DateTimePickerWidget } from './widgets/DateTimePickerWidget';
import { SelectWidget } from './widgets/SelectWidget';
import { SelectMultipleWidget } from './widgets/SelectMultipleWidget';
import { CheckboxGroupWidget } from './widgets/CheckboxGroupWidget';
import { InputTextListWidget } from './widgets/InputTextListWidget';
import { InputNumberListWidget } from './widgets/InputNumberListWidget';
import { DatePickerListWidget } from './widgets/DatePickerListWidget';
import { DateTimePickerListWidget } from './widgets/DateTimePickerListWidget';
import { TextareaListWidget } from './widgets/TextareaListWidget';
import { JsonObjectWidget } from './widgets/JsonObjectWidget';
import { JsonArrayWidget } from './widgets/JsonArrayWidget';
import { getAllowedComponents } from './componentDefs/getAllowedComponents';
import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { PathSegment } from '@/utils/pathUtils';

/**
 * Тип функции рендеринга компонента.
 */
type ComponentRenderer = (
  componentConfig: ZEditComponent,
  rendererProps: FieldRendererProps
) => React.ReactNode;

/**
 * Регистр компонентов по типу данных и кардинальности.
 * Структура соответствует getAllowedComponents: ключ - тип данных, значение - объект с 'one' и 'many'.
 */
const componentRendererRegistry: Partial<
  Record<ZDataType, Record<ZCardinality, ComponentRenderer>>
> = {
  /** Строковые поля. */
  string: {
    one: (config, props) => (
      <InputTextWidget {...props} componentConfig={config as ZEditInputText} />
    ),
    many: (config, props) => (
      <InputTextListWidget {...props} componentConfig={config as ZEditInputText} />
    ),
  },
  /** Многострочные текстовые поля. */
  text: {
    one: (config, props) => <TextareaWidget {...props} componentConfig={config as ZEditTextarea} />,
    many: (config, props) => (
      <TextareaListWidget {...props} componentConfig={config as ZEditTextarea} />
    ),
  },
  /** Целочисленные поля. */
  int: {
    one: (config, props) => (
      <InputNumberWidget {...props} componentConfig={config as ZEditInputNumber} />
    ),
    many: (config, props) => (
      <InputNumberListWidget {...props} componentConfig={config as ZEditInputNumber} />
    ),
  },
  /** Числа с плавающей точкой. */
  float: {
    one: (config, props) => (
      <InputNumberWidget {...props} componentConfig={config as ZEditInputNumber} />
    ),
    many: (config, props) => (
      <InputNumberListWidget {...props} componentConfig={config as ZEditInputNumber} />
    ),
  },
  /** Булевы поля. */
  bool: {
    one: (config, props) => <CheckboxWidget {...props} componentConfig={config as ZEditCheckbox} />,
    many: (config, props) => (
      <CheckboxGroupWidget {...props} componentConfig={config as ZEditCheckbox} />
    ),
  },
  /** Поля даты. */
  date: {
    one: (config, props) => (
      <DatePickerWidget {...props} componentConfig={config as ZEditDatePicker} />
    ),
    many: (config, props) => (
      <DatePickerListWidget {...props} componentConfig={config as ZEditDatePicker} />
    ),
  },
  /** Поля даты и времени. */
  datetime: {
    one: (config, props) => (
      <DateTimePickerWidget {...props} componentConfig={config as ZEditDateTimePicker} />
    ),
    many: (config, props) => (
      <DateTimePickerListWidget {...props} componentConfig={config as ZEditDateTimePicker} />
    ),
  },
  /** Ссылочные поля (ref). */
  ref: {
    one: (config, props) => <SelectWidget {...props} componentConfig={config as ZEditSelect} />,
    many: (config, props) => (
      <SelectMultipleWidget {...props} componentConfig={config as ZEditSelect} />
    ),
  },
  /** JSON объекты. */
  json: {
    one: (config, props) => (
      <JsonObjectWidget
        {...props}
        componentConfig={config as ZEditJsonObject}
        model={props.model}
      />
    ),
    many: (config, props) => (
      <JsonArrayWidget
        {...props}
        componentConfig={config as ZEditJsonObject}
        model={props.model}
        onAddItem={props.onAddArrayItem}
        onRemoveItem={props.onRemoveArrayItem}
      />
    ),
  },
};

/**
 * Создаёт дефолтную конфигурацию компонента на основе типа данных.
 * Используется, когда для поля нет кастомной конфигурации.
 * @param schema Схема поля для генерации дефолтной конфигурации.
 * @param namePath Путь к полю для получения имени поля.
 * @returns Дефолтная конфигурация компонента или `null`, если тип не поддерживается.
 */
const createDefaultComponentConfig = (
  schema: ZBlueprintSchemaField,
  namePath: PathSegment[]
): ZEditComponent | null => {
  const { type, cardinality } = schema;
  const allowedComponents = getAllowedComponents(type, cardinality);

  if (allowedComponents.length === 0) {
    return null;
  }

  const componentName = allowedComponents[0];
  const fieldName = (namePath[namePath.length - 1] as string) || '';

  switch (componentName) {
    case 'inputText':
      return { name: 'inputText', props: { label: fieldName } };
    case 'textarea':
      return { name: 'textarea', props: { label: fieldName } };
    case 'inputNumber':
      return { name: 'inputNumber', props: { label: fieldName } };
    case 'checkbox':
      return { name: 'checkbox', props: { label: fieldName } };
    case 'datePicker':
      return { name: 'datePicker', props: { label: fieldName } };
    case 'dateTimePicker':
      return { name: 'dateTimePicker', props: { label: fieldName } };
    case 'select':
      return { name: 'select', props: { label: fieldName } };
    case 'jsonObject':
      return { name: 'jsonObject', props: { label: fieldName } };
    default:
      return null;
  }
};

/**
 * Рендерит компонент формы на основе конфигурации ZEditComponent, типа данных и кардинальности.
 * Выбирает соответствующий виджет из регистра в зависимости от типа данных и кардинальности.
 * Если конфигурация не передана, создаёт дефолтную на основе типа данных.
 * @param componentConfig Конфигурация компонента из ZEditComponent (опционально).
 * @param rendererProps Пропсы рендерера поля (должны содержать schema с типом данных и кардинальностью).
 * @returns React-компонент для рендеринга поля формы или `null`, если компонент не найден.
 * @example
 * const component = renderComponentFromConfig(
 *   { name: 'inputText', props: { label: 'Заголовок', placeholder: 'Введите заголовок' } },
 *   { schema: { type: 'string', cardinality: 'one', ... }, namePath: ['title'], value: '', onChange: (v) => {} }
 * );
 */
export const renderComponentFromConfig = (
  componentConfig: ZEditComponent | undefined,
  rendererProps: FieldRendererProps
): React.ReactNode => {
  const { schema } = rendererProps;
  const dataType = schema.type;
  const cardinality = schema.cardinality;

  // Если конфигурация не передана, создаём дефолтную
  const config = componentConfig || createDefaultComponentConfig(schema, rendererProps.namePath);

  if (!config) {
    return null;
  }

  // Получаем конфигурацию для типа данных
  const typeConfig = componentRendererRegistry[dataType as ZDataType];

  if (!typeConfig) {
    return null;
  }

  // Получаем рендерер для нужной кардинальности
  const renderer = typeConfig[cardinality as ZCardinality];

  if (!renderer) {
    return null;
  }

  return renderer(config, rendererProps);
};
