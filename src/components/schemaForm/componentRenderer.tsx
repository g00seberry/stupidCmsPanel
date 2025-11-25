import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { PathSegment } from '@/utils/pathUtils';
import type React from 'react';
import { getAllowedComponents } from './componentDefs/getAllowedComponents';
import type { ZEditComponent } from './componentDefs/ZComponent';
import type { FieldRendererProps } from './types/FieldRendererProps';
import { CheckboxGroupWidget } from './widgets/CheckboxGroupWidget';
import { CheckboxWidget } from './widgets/CheckboxWidget';
import { DatePickerListWidget } from './widgets/DatePickerListWidget';
import { DatePickerWidget } from './widgets/DatePickerWidget';
import { DateTimePickerListWidget } from './widgets/DateTimePickerListWidget';
import { DateTimePickerWidget } from './widgets/DateTimePickerWidget';
import { InputNumberListWidget } from './widgets/InputNumberListWidget';
import { InputNumberWidget } from './widgets/InputNumberWidget';
import { InputTextListWidget } from './widgets/InputTextListWidget';
import { InputTextWidget } from './widgets/InputTextWidget';
import { JsonArrayWidget } from './widgets/JsonArrayWidget';
import { JsonObjectWidget } from './widgets/JsonObjectWidget';
import { SelectMultipleWidget } from './widgets/SelectMultipleWidget';
import { SelectWidget } from './widgets/SelectWidget';
import { TextareaListWidget } from './widgets/TextareaListWidget';
import { TextareaWidget } from './widgets/TextareaWidget';

/**
 * Регистр компонентов по имени компонента из formConfig.
 * Ключ - имя компонента из ZEditComponent, значение - функция рендеринга.
 * Каждая функция рендеринга получает типизированный config в зависимости от ключа.
 */
const componentRendererRegistry: {
  [K in ZEditComponent['name']]: (
    config: Extract<ZEditComponent, { name: K }>,
    rendererProps: FieldRendererProps
  ) => React.ReactNode;
} = {
  /** Компонент ввода текста. */
  inputText: (config, props) => <InputTextWidget {...props} componentConfig={config} />,
  /** Компонент списка текстовых полей. */
  inputTextList: (config, props) => <InputTextListWidget {...props} componentConfig={config} />,
  /** Компонент ввода многострочного текста. */
  textarea: (config, props) => <TextareaWidget {...props} componentConfig={config} />,
  /** Компонент списка многострочных текстовых полей. */
  textareaList: (config, props) => <TextareaListWidget {...props} componentConfig={config} />,
  /** Компонент ввода числа. */
  inputNumber: (config, props) => <InputNumberWidget {...props} componentConfig={config} />,
  /** Компонент списка числовых полей. */
  inputNumberList: (config, props) => <InputNumberListWidget {...props} componentConfig={config} />,
  /** Компонент чекбокса. */
  checkbox: (config, props) => <CheckboxWidget {...props} componentConfig={config} />,
  /** Компонент группы чекбоксов. */
  checkboxGroup: (config, props) => <CheckboxGroupWidget {...props} componentConfig={config} />,
  /** Компонент выбора даты. */
  datePicker: (config, props) => <DatePickerWidget {...props} componentConfig={config} />,
  /** Компонент списка полей выбора даты. */
  datePickerList: (config, props) => <DatePickerListWidget {...props} componentConfig={config} />,
  /** Компонент выбора даты и времени. */
  dateTimePicker: (config, props) => <DateTimePickerWidget {...props} componentConfig={config} />,
  /** Компонент списка полей выбора даты и времени. */
  dateTimePickerList: (config, props) => (
    <DateTimePickerListWidget {...props} componentConfig={config} />
  ),
  /** Компонент выбора из списка. */
  select: (config, props) => <SelectWidget {...props} componentConfig={config} />,
  /** Компонент множественного выбора из списка. */
  selectMultiple: (config, props) => <SelectMultipleWidget {...props} componentConfig={config} />,
  /** Компонент JSON объекта. */
  jsonObject: (config, props) => <JsonObjectWidget {...props} componentConfig={config} />,
  /** Компонент массива JSON объектов. */
  jsonArray: (config, props) => <JsonArrayWidget {...props} componentConfig={config} />,
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
 * Вызывает рендерер компонента с правильной типизацией.
 * @param config Конфигурация компонента.
 * @param rendererProps Пропсы рендерера поля.
 * @returns Результат рендеринга компонента или `null`.
 */
const renderComponent = <K extends ZEditComponent['name']>(
  config: Extract<ZEditComponent, { name: K }>,
  rendererProps: FieldRendererProps
): React.ReactNode => {
  const renderer = componentRendererRegistry[config.name];
  return renderer ? renderer(config, rendererProps) : null;
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

  // Если конфигурация передана, используем её для определения компонента
  if (componentConfig) {
    return renderComponent(componentConfig, rendererProps);
  }

  // Если конфигурация не передана, используем fallback
  const config = createDefaultComponentConfig(schema, rendererProps.namePath);
  if (!config) return null;

  return renderComponent(config, rendererProps);
};
