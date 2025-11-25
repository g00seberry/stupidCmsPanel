import type React from 'react';
import type { FieldRendererProps } from './types/FieldRendererProps';
import type {
  ZEditCheckbox,
  ZEditCheckboxGroup,
  ZEditComponent,
  ZEditDatePicker,
  ZEditDatePickerList,
  ZEditDateTimePicker,
  ZEditDateTimePickerList,
  ZEditInputNumber,
  ZEditInputNumberList,
  ZEditInputText,
  ZEditInputTextList,
  ZEditJsonArray,
  ZEditJsonObject,
  ZEditSelect,
  ZEditSelectMultiple,
  ZEditTextarea,
  ZEditTextareaList,
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
 * Регистр компонентов по имени компонента из formConfig.
 * Ключ - имя компонента из ZEditComponent, значение - функция рендеринга.
 */
const componentRendererRegistry: Record<ZEditComponent['name'], ComponentRenderer> = {
  /** Компонент ввода текста. */
  inputText: (config, props) => (
    <InputTextWidget {...props} componentConfig={config as ZEditInputText} />
  ),
  /** Компонент списка текстовых полей. */
  inputTextList: (config, props) => (
    <InputTextListWidget
      {...props}
      componentConfig={config as ZEditInputTextList | ZEditInputText as ZEditInputText}
    />
  ),
  /** Компонент ввода многострочного текста. */
  textarea: (config, props) => (
    <TextareaWidget {...props} componentConfig={config as ZEditTextarea} />
  ),
  /** Компонент списка многострочных текстовых полей. */
  textareaList: (config, props) => (
    <TextareaListWidget
      {...props}
      componentConfig={config as ZEditTextareaList | ZEditTextarea as ZEditTextarea}
    />
  ),
  /** Компонент ввода числа. */
  inputNumber: (config, props) => (
    <InputNumberWidget {...props} componentConfig={config as ZEditInputNumber} />
  ),
  /** Компонент списка числовых полей. */
  inputNumberList: (config, props) => (
    <InputNumberListWidget
      {...props}
      componentConfig={config as ZEditInputNumberList | ZEditInputNumber as ZEditInputNumber}
    />
  ),
  /** Компонент чекбокса. */
  checkbox: (config, props) => (
    <CheckboxWidget {...props} componentConfig={config as ZEditCheckbox} />
  ),
  /** Компонент группы чекбоксов. */
  checkboxGroup: (config, props) => (
    <CheckboxGroupWidget
      {...props}
      componentConfig={config as ZEditCheckboxGroup | ZEditCheckbox as ZEditCheckbox}
    />
  ),
  /** Компонент выбора даты. */
  datePicker: (config, props) => (
    <DatePickerWidget {...props} componentConfig={config as ZEditDatePicker} />
  ),
  /** Компонент списка полей выбора даты. */
  datePickerList: (config, props) => (
    <DatePickerListWidget
      {...props}
      componentConfig={config as ZEditDatePickerList | ZEditDatePicker as ZEditDatePicker}
    />
  ),
  /** Компонент выбора даты и времени. */
  dateTimePicker: (config, props) => (
    <DateTimePickerWidget {...props} componentConfig={config as ZEditDateTimePicker} />
  ),
  /** Компонент списка полей выбора даты и времени. */
  dateTimePickerList: (config, props) => (
    <DateTimePickerListWidget
      {...props}
      componentConfig={
        config as ZEditDateTimePickerList | ZEditDateTimePicker as ZEditDateTimePicker
      }
    />
  ),
  /** Компонент выбора из списка. */
  select: (config, props) => <SelectWidget {...props} componentConfig={config as ZEditSelect} />,
  /** Компонент множественного выбора из списка. */
  selectMultiple: (config, props) => (
    <SelectMultipleWidget
      {...props}
      componentConfig={config as ZEditSelectMultiple | ZEditSelect as ZEditSelect}
    />
  ),
  /** Компонент JSON объекта. */
  jsonObject: (config, props) => (
    <JsonObjectWidget {...props} componentConfig={config as ZEditJsonObject} />
  ),
  /** Компонент массива JSON объектов. */
  jsonArray: (config, props) => (
    <JsonArrayWidget
      {...props}
      componentConfig={config as ZEditJsonArray | ZEditJsonObject as ZEditJsonObject}
    />
  ),
};

/**
 * Регистр компонентов по типу данных и кардинальности (fallback).
 * Используется, когда компонент не указан в formConfig.
 */
const fallbackComponentRendererRegistry: Partial<
  Record<ZDataType, Record<ZCardinality, ComponentRenderer>>
> = {
  /** Строковые поля. */
  string: {
    one: (config, props) => (
      <InputTextWidget {...props} componentConfig={config as ZEditInputText} />
    ),
    many: (config, props) => (
      <InputTextListWidget
        {...props}
        componentConfig={config as ZEditInputTextList | ZEditInputText as ZEditInputText}
      />
    ),
  },
  /** Многострочные текстовые поля. */
  text: {
    one: (config, props) => <TextareaWidget {...props} componentConfig={config as ZEditTextarea} />,
    many: (config, props) => (
      <TextareaListWidget
        {...props}
        componentConfig={config as ZEditTextareaList | ZEditTextarea as ZEditTextarea}
      />
    ),
  },
  /** Целочисленные поля. */
  int: {
    one: (config, props) => (
      <InputNumberWidget {...props} componentConfig={config as ZEditInputNumber} />
    ),
    many: (config, props) => (
      <InputNumberListWidget
        {...props}
        componentConfig={config as ZEditInputNumberList | ZEditInputNumber as ZEditInputNumber}
      />
    ),
  },
  /** Числа с плавающей точкой. */
  float: {
    one: (config, props) => (
      <InputNumberWidget {...props} componentConfig={config as ZEditInputNumber} />
    ),
    many: (config, props) => (
      <InputNumberListWidget
        {...props}
        componentConfig={config as ZEditInputNumberList | ZEditInputNumber as ZEditInputNumber}
      />
    ),
  },
  /** Булевы поля. */
  bool: {
    one: (config, props) => <CheckboxWidget {...props} componentConfig={config as ZEditCheckbox} />,
    many: (config, props) => (
      <CheckboxGroupWidget
        {...props}
        componentConfig={config as ZEditCheckboxGroup | ZEditCheckbox as ZEditCheckbox}
      />
    ),
  },
  /** Поля даты. */
  date: {
    one: (config, props) => (
      <DatePickerWidget {...props} componentConfig={config as ZEditDatePicker} />
    ),
    many: (config, props) => (
      <DatePickerListWidget
        {...props}
        componentConfig={config as ZEditDatePickerList | ZEditDatePicker as ZEditDatePicker}
      />
    ),
  },
  /** Поля даты и времени. */
  datetime: {
    one: (config, props) => (
      <DateTimePickerWidget {...props} componentConfig={config as ZEditDateTimePicker} />
    ),
    many: (config, props) => (
      <DateTimePickerListWidget
        {...props}
        componentConfig={
          config as ZEditDateTimePickerList | ZEditDateTimePicker as ZEditDateTimePicker
        }
      />
    ),
  },
  /** Ссылочные поля (ref). */
  ref: {
    one: (config, props) => <SelectWidget {...props} componentConfig={config as ZEditSelect} />,
    many: (config, props) => (
      <SelectMultipleWidget
        {...props}
        componentConfig={config as ZEditSelectMultiple | ZEditSelect as ZEditSelect}
      />
    ),
  },
  /** JSON объекты. */
  json: {
    one: (config, props) => (
      <JsonObjectWidget {...props} componentConfig={config as ZEditJsonObject} />
    ),
    many: (config, props) => (
      <JsonArrayWidget
        {...props}
        componentConfig={config as ZEditJsonArray | ZEditJsonObject as ZEditJsonObject}
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
    case 'inputTextList':
      return { name: 'inputTextList', props: { label: fieldName } };
    case 'textareaList':
      return { name: 'textareaList', props: { label: fieldName } };
    case 'inputNumberList':
      return { name: 'inputNumberList', props: { label: fieldName } };
    case 'checkboxGroup':
      return { name: 'checkboxGroup', props: { label: fieldName } };
    case 'datePickerList':
      return { name: 'datePickerList', props: { label: fieldName } };
    case 'dateTimePickerList':
      return { name: 'dateTimePickerList', props: { label: fieldName } };
    case 'selectMultiple':
      return { name: 'selectMultiple', props: { label: fieldName } };
    case 'jsonArray':
      return { name: 'jsonArray', props: { label: fieldName } };
    default:
      return null;
  }
};

/**
 * Рендерит компонент формы на основе конфигурации ZEditComponent из formConfig.
 * Выбирает соответствующий виджет из регистра по имени компонента из formConfig.
 * Если конфигурация не передана, использует fallback на основе типа данных и кардинальности.
 * @param componentConfig Конфигурация компонента из ZEditComponent (опционально).
 * @param rendererProps Пропсы рендерера поля (должны содержать schema с типом данных и кардинальностью).
 * @returns React-компонент для рендеринга поля формы или `null`, если компонент не найден.
 * @example
 * const component = renderComponentFromConfig(
 *   { name: 'inputText', props: { label: 'Заголовок', placeholder: 'Введите заголовок' } },
 *   { schema: { type: 'string', cardinality: 'one', ... }, namePath: ['title'], model: formModel }
 * );
 */
export const renderComponentFromConfig = (
  componentConfig: ZEditComponent | undefined,
  rendererProps: FieldRendererProps
): React.ReactNode => {
  const { schema } = rendererProps;
  const dataType = schema.type;
  const cardinality = schema.cardinality;

  // Если конфигурация передана, используем её для определения компонента
  if (componentConfig) {
    const renderer = componentRendererRegistry[componentConfig.name];
    if (renderer) {
      return renderer(componentConfig, rendererProps);
    }
  }

  // Если конфигурация не передана или компонент не найден, используем fallback
  const config = componentConfig || createDefaultComponentConfig(schema, rendererProps.namePath);

  if (!config) {
    return null;
  }

  // Используем fallback регистр по типу данных и кардинальности
  const typeConfig = fallbackComponentRendererRegistry[dataType as ZDataType];

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
