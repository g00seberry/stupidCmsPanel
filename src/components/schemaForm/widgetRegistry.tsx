import { DatePicker, Input, InputNumber, Switch } from 'antd';
import type React from 'react';
import type { FieldSchema } from '@/types/schemaForm';
import type { PathSegment } from '@/utils/pathUtils';
import { viewDate } from '@/utils/dateUtils';
import type { Dayjs } from 'dayjs';
import { PriceWidget } from './widgets/PriceWidget';
import { RefFieldWidget } from './widgets/RefFieldWidget';
import { TitleWidget } from './widgets/TitleWidget';

/**
 * Пропсы для рендерера поля формы.
 */
export interface FieldRendererProps {
  /** Схема поля для рендеринга. */
  schema: FieldSchema;
  /** Путь к полю в форме (массив сегментов). */
  namePath: PathSegment[];
  /** Текущее значение поля. */
  value?: any;
  /** Обработчик изменения значения поля. */
  onChange?: (value: any) => void;
  /** Флаг отключения поля. */
  disabled?: boolean;
  /** Флаг режима только для чтения. */
  readOnly?: boolean;
}

/**
 * Тип функции рендерера поля формы.
 * Принимает схему поля и путь, возвращает React-компонент для рендеринга.
 */
export type FieldRenderer = (props: FieldRendererProps) => React.ReactNode;

/**
 * Реестр виджетов по умолчанию для каждого типа поля.
 * Содержит базовые рендереры для всех типов данных.
 */
export const defaultRenderers: Record<string, FieldRenderer> = {
  /** Рендерер для строковых полей. */
  string: ({ schema, value, onChange, disabled, readOnly }) => (
    <Input
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={schema.placeholder}
      disabled={disabled}
      readOnly={readOnly}
      {...schema.uiProps}
    />
  ),

  /** Рендерер для текстовых полей (многострочный текст). */
  text: ({ schema, value, onChange, disabled, readOnly }) => (
    <Input.TextArea
      value={value}
      onChange={e => onChange?.(e.target.value)}
      autoSize
      placeholder={schema.placeholder}
      disabled={disabled}
      readOnly={readOnly}
      {...schema.uiProps}
    />
  ),

  /** Рендерер для целочисленных полей. */
  int: ({ schema, value, onChange, disabled, readOnly }) => (
    <InputNumber
      value={value}
      onChange={onChange}
      style={{ width: '100%' }}
      placeholder={schema.placeholder}
      disabled={disabled}
      readOnly={readOnly}
      {...schema.uiProps}
    />
  ),

  /** Рендерер для чисел с плавающей точкой. */
  float: ({ schema, value, onChange, disabled, readOnly }) => (
    <InputNumber
      value={value}
      onChange={onChange}
      style={{ width: '100%' }}
      placeholder={schema.placeholder}
      disabled={disabled}
      readOnly={readOnly}
      {...schema.uiProps}
    />
  ),

  /** Рендерер для булевых полей. */
  bool: ({ schema, value, onChange, disabled, readOnly }) => (
    <Switch
      checked={value}
      onChange={onChange}
      disabled={disabled || readOnly}
      {...schema.uiProps}
    />
  ),

  /** Рендерер для полей даты. */
  date: ({ schema, value, onChange, disabled, readOnly }) => {
    // Преобразуем строку в dayjs объект, если значение - строка
    const dayjsValue: Dayjs | null =
      typeof value === 'string' ? viewDate(value) : value ?? null;
    return (
      <DatePicker
        value={dayjsValue}
        onChange={onChange}
        style={{ width: '100%' }}
        placeholder={schema.placeholder}
        disabled={disabled || readOnly}
        {...schema.uiProps}
      />
    );
  },

  /** Рендерер для полей даты и времени. */
  datetime: ({ schema, value, onChange, disabled, readOnly }) => {
    // Преобразуем строку в dayjs объект, если значение - строка
    const dayjsValue: Dayjs | null =
      typeof value === 'string' ? viewDate(value) : value ?? null;
    return (
      <DatePicker
        value={dayjsValue}
        onChange={onChange}
        showTime
        style={{ width: '100%' }}
        placeholder={schema.placeholder}
        disabled={disabled || readOnly}
        {...schema.uiProps}
      />
    );
  },

  /** Рендерер для ссылочных полей (Select с загрузкой данных). */
  ref: props => <RefFieldWidget {...props} />,

  /** Рендерер для json полей (json сам по себе не рендерится как инпут). */
  json: () => null,
};

/**
 * Реестр кастомных виджетов.
 * Хранит виджеты по ключам для использования через uiWidget в FieldSchema.
 */
const widgetRegistry: Map<string, FieldRenderer> = new Map();

/**
 * Регистрирует кастомный виджет в реестре.
 * @param key Ключ виджета (должен совпадать с uiWidget в FieldSchema).
 * @param renderer Функция рендерера виджета.
 * @example
 * registerWidget('title', ({ schema }) => (
 *   <Input maxLength={200} placeholder={schema.placeholder} />
 * ));
 */
export const registerWidget = (key: string, renderer: FieldRenderer): void => {
  widgetRegistry.set(key, renderer);
};

/**
 * Получает кастомный виджет из реестра.
 * @param key Ключ виджета.
 * @returns Функция рендерера или `undefined`, если виджет не найден.
 */
export const getWidget = (key: string): FieldRenderer | undefined => {
  return widgetRegistry.get(key);
};

/**
 * Получает рендерер для поля на основе его схемы.
 * Приоритет: uiWidget → defaultRenderers[type] → fallback (Input).
 * @param schema Схема поля.
 * @returns Функция рендерера для поля.
 * @example
 * const renderer = getFieldRenderer(fieldSchema);
 * const component = renderer({ schema: fieldSchema, namePath: ['title'] });
 */
export const getFieldRenderer = (schema: FieldSchema): FieldRenderer => {
  // Если указан кастомный виджет, используем его
  if (schema.uiWidget) {
    const customWidget = getWidget(schema.uiWidget);
    if (customWidget) {
      return customWidget;
    }
  }

  // Иначе используем виджет по умолчанию для типа поля
  const defaultRenderer = defaultRenderers[schema.type];
  if (defaultRenderer) {
    return defaultRenderer;
  }

  // Fallback - обычный Input
  return ({ schema: fallbackSchema, value, onChange, disabled, readOnly }) => (
    <Input
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={fallbackSchema.placeholder}
      disabled={disabled}
      readOnly={readOnly}
      {...fallbackSchema.uiProps}
    />
  );
};

// Регистрируем кастомные виджеты по умолчанию
registerWidget('title', props => <TitleWidget {...props} />);
registerWidget('price', props => <PriceWidget {...props} />);
