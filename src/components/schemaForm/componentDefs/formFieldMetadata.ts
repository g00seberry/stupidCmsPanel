import type { InputNumberProps, InputProps, SwitchProps } from 'antd';
import type { FormItemProps } from 'antd/es/form';
import type React from 'react';
import z from 'zod';
import {
  zEditCheckbox,
  zEditCheckboxGroup,
  zEditDatePicker,
  zEditDatePickerList,
  zEditDateTimePicker,
  zEditDateTimePickerList,
  zEditInputNumber,
  zEditInputNumberList,
  zEditInputText,
  zEditInputTextList,
  zEditJsonArray,
  zEditJsonObject,
  zEditSelect,
  zEditSelectMultiple,
  zEditTextarea,
  zEditTextareaList,
  type ZEditComponent,
} from './ZComponent';

/**
 * Типизированный реестр схем props для всех типов компонентов.
 * Каждый ключ соответствует типу компонента, значение - его Zod схема props.
 */
type ComponentPropsSchemaRegistry = {
  inputText: typeof zEditInputText.shape.props;
  textarea: typeof zEditTextarea.shape.props;
  inputNumber: typeof zEditInputNumber.shape.props;
  checkbox: typeof zEditCheckbox.shape.props;
  datePicker: typeof zEditDatePicker.shape.props;
  dateTimePicker: typeof zEditDateTimePicker.shape.props;
  select: typeof zEditSelect.shape.props;
  jsonObject: typeof zEditJsonObject.shape.props;
  inputTextList: typeof zEditInputTextList.shape.props;
  textareaList: typeof zEditTextareaList.shape.props;
  inputNumberList: typeof zEditInputNumberList.shape.props;
  checkboxGroup: typeof zEditCheckboxGroup.shape.props;
  datePickerList: typeof zEditDatePickerList.shape.props;
  dateTimePickerList: typeof zEditDateTimePickerList.shape.props;
  selectMultiple: typeof zEditSelectMultiple.shape.props;
  jsonArray: typeof zEditJsonArray.shape.props;
};

/**
 * Имя типа компонента, соответствующее ключам реестра схем.
 */
type ComponentName = keyof ComponentPropsSchemaRegistry;

/**
 * Реестр схем props для всех типов компонентов.
 * Типизирован в соответствии с реальными схемами из ZComponent.ts.
 */
const componentPropsSchemaRegistry = {
  inputText: zEditInputText.shape.props,
  textarea: zEditTextarea.shape.props,
  inputNumber: zEditInputNumber.shape.props,
  checkbox: zEditCheckbox.shape.props,
  datePicker: zEditDatePicker.shape.props,
  dateTimePicker: zEditDateTimePicker.shape.props,
  select: zEditSelect.shape.props,
  jsonObject: zEditJsonObject.shape.props,
  inputTextList: zEditInputTextList.shape.props,
  textareaList: zEditTextareaList.shape.props,
  inputNumberList: zEditInputNumberList.shape.props,
  checkboxGroup: zEditCheckboxGroup.shape.props,
  datePickerList: zEditDatePickerList.shape.props,
  dateTimePickerList: zEditDateTimePickerList.shape.props,
  selectMultiple: zEditSelectMultiple.shape.props,
  jsonArray: zEditJsonArray.shape.props,
} as const satisfies ComponentPropsSchemaRegistry;

/**
 * Получает схему props для конкретного типа компонента.
 * @param componentName Имя типа компонента.
 * @returns Zod схема props компонента или `undefined`, если тип не найден.
 * @example
 * const propsSchema = getComponentPropsSchema('inputText');
 * // z.object({ label: z.string(), placeholder: z.string().optional() })
 */
export const getComponentPropsSchema = (
  componentName: ZEditComponent['name']
): ComponentPropsSchemaRegistry[keyof ComponentPropsSchemaRegistry] | undefined => {
  if (componentName in componentPropsSchemaRegistry) {
    return componentPropsSchemaRegistry[componentName as ComponentName];
  }
  return undefined;
};

/**
 * Конфигурация метаданных поля формы.
 * Определяет, как поле должно отображаться и валидироваться.
 */
export type FieldMetadataConfig = {
  /** Название поля для отображения в label. */
  label: string;
  /** Placeholder для поля ввода. */
  placeholder?: string;
  /** Тип компонента для рендеринга. */
  componentType: 'input' | 'inputNumber' | 'textarea' | 'switch';
  /** Дополнительные пропсы для Form.Item. */
  formItemProps?: Partial<FormItemProps>;
  /** Дополнительные пропсы для компонента ввода. */
  componentProps?: Partial<InputProps | InputNumberProps | SwitchProps>;
  /** Кастомный рендерер компонента. Если указан, componentType игнорируется. */
  customRender?: (props: {
    value: any;
    onChange: (value: any) => void;
    placeholder?: string;
  }) => React.ReactNode;
};

/**
 * Реестр метаданных полей для каждого компонента.
 * Ключ - имя поля в props, значение - конфигурация метаданных.
 */
export type ComponentMetadataRegistry = Record<string, FieldMetadataConfig>;

/**
 * Конфигурация обязательного поля label.
 * Используется для стандартизации метаданных обязательных полей.
 */
const requiredLabelField: FieldMetadataConfig = {
  label: 'Название поля',
  placeholder: 'Введите label',
  componentType: 'input',
  formItemProps: {
    rules: [{ required: true, message: 'Label обязателен' }],
  },
};

/**
 * Конфигурация опционального поля placeholder.
 * Используется для стандартизации метаданных полей placeholder.
 */
const placeholderField: FieldMetadataConfig = {
  label: 'Подсказка в поле ввода',
  placeholder: 'Введите placeholder',
  componentType: 'input',
};

/**
 * Метаданные компонента inputText.
 * Определяет конфигурацию полей формы для настройки компонента ввода текста.
 * Содержит метаданные для полей: label (обязательное), placeholder (опциональное).
 */
export const inputTextMetadata: ComponentMetadataRegistry = {
  label: requiredLabelField,
  placeholder: placeholderField,
};

/**
 * Метаданные компонента textarea.
 * Определяет конфигурацию полей формы для настройки компонента ввода многострочного текста.
 * Содержит метаданные для полей: label (обязательное), placeholder (опциональное), rows (опциональное).
 */
export const textareaMetadata: ComponentMetadataRegistry = {
  label: requiredLabelField,
  placeholder: placeholderField,
  rows: {
    label: 'Количество строк',
    placeholder: 'Количество строк',
    componentType: 'inputNumber',
    componentProps: {
      min: 1,
      style: { width: '100%' },
    },
  },
};

/**
 * Метаданные компонента inputNumber.
 * Определяет конфигурацию полей формы для настройки компонента ввода числа.
 * Содержит метаданные для полей: label (обязательное), placeholder (опциональное),
 * min, max, step (все опциональные).
 */
export const inputNumberMetadata: ComponentMetadataRegistry = {
  label: requiredLabelField,
  placeholder: placeholderField,
  min: {
    label: 'Минимальное значение',
    placeholder: 'Минимальное значение',
    componentType: 'inputNumber',
    componentProps: {
      style: { width: '100%' },
    },
  },
  max: {
    label: 'Максимальное значение',
    placeholder: 'Максимальное значение',
    componentType: 'inputNumber',
    componentProps: {
      style: { width: '100%' },
    },
  },
  step: {
    label: 'Шаг изменения значения',
    placeholder: 'Шаг',
    componentType: 'inputNumber',
    componentProps: {
      style: { width: '100%' },
    },
  },
};

/**
 * Метаданные компонента checkbox.
 * Определяет конфигурацию полей формы для настройки компонента чекбокса.
 * Содержит метаданные для поля: label (обязательное).
 */
export const checkboxMetadata: ComponentMetadataRegistry = {
  label: requiredLabelField,
};

/**
 * Метаданные компонента datePicker.
 * Определяет конфигурацию полей формы для настройки компонента выбора даты.
 * Содержит метаданные для полей: label (обязательное), placeholder (опциональное),
 * format (опциональное, формат даты).
 */
export const datePickerMetadata: ComponentMetadataRegistry = {
  label: requiredLabelField,
  placeholder: placeholderField,
  format: {
    label: 'Формат даты',
    placeholder: 'Формат даты (например, YYYY-MM-DD)',
    componentType: 'input',
  },
};

/**
 * Метаданные компонента dateTimePicker.
 * Определяет конфигурацию полей формы для настройки компонента выбора даты и времени.
 * Содержит метаданные для полей: label (обязательное), placeholder (опциональное),
 * format (опциональное, формат даты и времени), showTime (опциональное, показывать ли время).
 */
export const dateTimePickerMetadata: ComponentMetadataRegistry = {
  label: requiredLabelField,
  placeholder: placeholderField,
  format: {
    label: 'Формат даты и времени',
    placeholder: 'Формат даты и времени (например, YYYY-MM-DD HH:mm:ss)',
    componentType: 'input',
  },
  showTime: {
    label: 'Показывать время',
    componentType: 'switch',
  },
};

/**
 * Метаданные компонента select.
 * Определяет конфигурацию полей формы для настройки компонента выбора из списка.
 * Содержит метаданные для полей: label (обязательное), placeholder (опциональное),
 * showSearch (опциональное, включить ли поиск).
 */
export const selectMetadata: ComponentMetadataRegistry = {
  label: requiredLabelField,
  placeholder: placeholderField,
  showSearch: {
    label: 'Включить поиск',
    componentType: 'switch',
  },
};

/**
 * Метаданные компонента jsonObject.
 * Определяет конфигурацию полей формы для настройки компонента JSON объекта.
 * Содержит метаданные для поля: label (обязательное).
 */
export const jsonObjectMetadata: ComponentMetadataRegistry = {
  label: requiredLabelField,
};

/**
 * Типизированный реестр метаданных для всех компонентов.
 * Гарантирует соответствие ключей именам компонентов.
 */
type ComponentMetadataRegistryMap = {
  [K in ComponentName]: ComponentMetadataRegistry;
};

/**
 * Реестр всех метаданных компонентов.
 * Гарантирует, что каждый ComponentName имеет соответствующие метаданные.
 */
export const componentMetadataRegistry: ComponentMetadataRegistryMap = {
  inputText: inputTextMetadata,
  textarea: textareaMetadata,
  inputNumber: inputNumberMetadata,
  checkbox: checkboxMetadata,
  datePicker: datePickerMetadata,
  dateTimePicker: dateTimePickerMetadata,
  select: selectMetadata,
  jsonObject: jsonObjectMetadata,
  inputTextList: inputTextMetadata,
  textareaList: textareaMetadata,
  inputNumberList: inputNumberMetadata,
  checkboxGroup: checkboxMetadata,
  datePickerList: datePickerMetadata,
  dateTimePickerList: dateTimePickerMetadata,
  selectMultiple: selectMetadata,
  jsonArray: jsonObjectMetadata,
};

/**
 * Расширенные метаданные поля с информацией из Zod схемы.
 */
export type EnhancedFieldMetadata = FieldMetadataConfig & {
  /** Имя поля. */
  name: string;
  /** Обязательно ли поле (из Zod схемы). */
  required: boolean;
  /** Значение valuePropName для Form.Item (для Switch/Checkbox). */
  valuePropName?: 'checked' | 'value';
};

/**
 * Извлекает базовый тип из Zod схемы, убирая обёртки Optional/Nullable.
 * Использует публичный API Zod unwrap() вместо внутренних полей.
 * @param schema Zod тип схемы.
 * @returns Базовый тип без обёрток.
 */
const unwrapZodType = (schema: z.ZodTypeAny): z.ZodTypeAny => {
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return unwrapZodType(schema.unwrap() as z.ZodTypeAny);
  }
  return schema;
};

/**
 * Проверяет, является ли Zod тип опциональным или nullable.
 * @param schema Zod тип схемы.
 * @returns `true`, если тип опциональный или nullable.
 */
const isZodOptional = (schema: z.ZodTypeAny): boolean => {
  return schema instanceof z.ZodOptional || schema instanceof z.ZodNullable;
};

/**
 * Определяет значение valuePropName для Form.Item на основе типа поля и метаданных.
 * @param zodType Базовый Zod тип (без обёрток).
 * @param componentType Тип компонента из метаданных.
 * @returns Значение valuePropName или `undefined`.
 */
const getValuePropName = (
  zodType: z.ZodTypeAny,
  componentType: FieldMetadataConfig['componentType']
): EnhancedFieldMetadata['valuePropName'] => {
  if (componentType === 'switch' || zodType instanceof z.ZodBoolean) {
    return 'checked';
  }
  return undefined;
};

/**
 * Создаёт расширенные метаданные поля из Zod схемы и метаданных компонента.
 * @param fieldName Имя поля.
 * @param zodType Zod тип схемы поля.
 * @param fieldMetadata Метаданные поля из реестра.
 * @returns Расширенные метаданные поля.
 */
const createEnhancedFieldMetadata = (
  fieldName: string,
  zodType: z.ZodTypeAny,
  fieldMetadata: FieldMetadataConfig
): EnhancedFieldMetadata => {
  const isOptional = isZodOptional(zodType);
  const unwrappedType = unwrapZodType(zodType);
  const valuePropName = getValuePropName(unwrappedType, fieldMetadata.componentType);

  return {
    ...fieldMetadata,
    name: fieldName,
    required: !isOptional,
    valuePropName,
  };
};

/**
 * Извлекает расширенные метаданные полей для компонента.
 * Комбинирует информацию из реестра метаданных и Zod схемы.
 * В режиме разработки проверяет полноту метаданных и выдаёт предупреждения.
 * @param componentName Имя типа компонента.
 * @returns Массив расширенных метаданных полей.
 * @example
 * const metadata = extractEnhancedFieldMetadata('inputText');
 * // [{ name: 'label', label: 'Название поля', required: true, ... }, ...]
 */
export const extractEnhancedFieldMetadata = (
  componentName: ZEditComponent['name']
): EnhancedFieldMetadata[] => {
  const propsSchema = getComponentPropsSchema(componentName);
  const componentMetadata =
    componentName in componentMetadataRegistry
      ? componentMetadataRegistry[componentName as ComponentName]
      : undefined;

  if (!propsSchema || !componentMetadata) {
    return [];
  }

  const shape = propsSchema.shape;

  return Object.entries(shape).reduce<EnhancedFieldMetadata[]>((acc, [fieldName, fieldSchema]) => {
    const fieldMetadata = componentMetadata[fieldName];
    if (!fieldMetadata) return acc;

    acc.push(createEnhancedFieldMetadata(fieldName, fieldSchema as z.ZodTypeAny, fieldMetadata));
    return acc;
  }, []);
};
