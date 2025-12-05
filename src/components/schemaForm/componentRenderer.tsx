import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { PathSegment } from '@/utils/pathUtils';
import type React from 'react';
import { getAllowedComponents } from './getAllowedComponents';
import type { ZEditComponent } from './ZComponent';
import type {
  ComponentRendererProps,
  ExtractedComponentConfig,
  FieldRendererProps,
  RenderFunctionDef,
} from './types';
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
  [K in ZEditComponent['name']]: RenderFunctionDef<K>;
} = {
  /** Компонент ввода текста. */
  inputText: InputTextWidget,
  /** Компонент списка текстовых полей. */
  inputTextList: InputTextListWidget,
  /** Компонент ввода многострочного текста. */
  textarea: TextareaWidget,
  /** Компонент списка многострочных текстовых полей. */
  textareaList: TextareaListWidget,
  /** Компонент ввода числа. */
  inputNumber: InputNumberWidget,
  /** Компонент списка числовых полей. */
  inputNumberList: InputNumberListWidget,
  /** Компонент чекбокса. */
  checkbox: CheckboxWidget,
  /** Компонент группы чекбоксов. */
  checkboxGroup: CheckboxGroupWidget,
  /** Компонент выбора даты. */
  datePicker: DatePickerWidget,
  /** Компонент списка полей выбора даты. */
  datePickerList: DatePickerListWidget,
  /** Компонент выбора даты и времени. */
  dateTimePicker: DateTimePickerWidget,
  /** Компонент списка полей выбора даты и времени. */
  dateTimePickerList: DateTimePickerListWidget,
  /** Компонент выбора из списка. */
  select: SelectWidget,
  /** Компонент множественного выбора из списка. */
  selectMultiple: SelectMultipleWidget,
  /** Компонент JSON объекта. */
  jsonObject: JsonObjectWidget,
  /** Компонент массива JSON объектов. */
  jsonArray: JsonArrayWidget,
};

/**
 * Создаёт дефолтную конфигурацию компонента на основе типа данных.
 * Используется, когда для поля нет кастомной конфигурации.
 * @param schema Схема поля для генерации дефолтной конфигурации.
 * @param namePath Путь к полю для получения имени поля.
 * @returns Дефолтная конфигурация компонента или `null`, если тип не поддерживается.
 */
const createDefaultComponentConfig = <K extends ZEditComponent['name']>(
  schema: ZBlueprintSchemaField,
  namePath: PathSegment[]
): ExtractedComponentConfig<K> | null => {
  const { type, cardinality } = schema;
  const allowedComponents = getAllowedComponents(type, cardinality);
  if (allowedComponents.length === 0) return null;
  const componentName = allowedComponents[0];
  const fieldName = (namePath[namePath.length - 1] as string) || '';
  const props = { label: fieldName };
  return { name: componentName ?? 'inputText', props } as ExtractedComponentConfig<K>;
};

/**
 * Вызывает рендерер компонента с правильной типизацией.
 * @param config Конфигурация компонента.
 * @param rendererProps Пропсы рендерера поля.
 * @returns Результат рендеринга компонента или `null`.
 */
const renderComponent = <K extends ZEditComponent['name']>(
  Component: React.FC<ComponentRendererProps<K>>,
  rendererProps: FieldRendererProps,
  config: ExtractedComponentConfig<K>
): React.ReactNode => {
  return <Component {...rendererProps} componentConfig={config} />;
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
export const renderComponentFromConfig = <K extends ZEditComponent['name']>(
  componentConfig: ExtractedComponentConfig<K> | undefined,
  rendererProps: FieldRendererProps
): React.ReactNode => {
  const finalComponentConfig =
    componentConfig ?? createDefaultComponentConfig(rendererProps.schema, rendererProps.namePath);
  if (!finalComponentConfig) return null;
  const Component = componentRendererRegistry[finalComponentConfig.name];
  return renderComponent(Component, rendererProps, finalComponentConfig);
};
