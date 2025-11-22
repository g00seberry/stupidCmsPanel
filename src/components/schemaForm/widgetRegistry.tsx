import { DatePicker, Input, InputNumber, Switch } from 'antd';
import type React from 'react';
import type { FieldSchema } from '@/types/schemaForm';
import type { PathSegment } from '@/utils/pathUtils';
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
  string: ({ schema }) => <Input placeholder={schema.placeholder} {...schema.uiProps} />,

  /** Рендерер для текстовых полей (многострочный текст). */
  text: ({ schema }) => (
    <Input.TextArea autoSize placeholder={schema.placeholder} {...schema.uiProps} />
  ),

  /** Рендерер для целочисленных полей. */
  int: ({ schema }) => (
    <InputNumber style={{ width: '100%' }} placeholder={schema.placeholder} {...schema.uiProps} />
  ),

  /** Рендерер для чисел с плавающей точкой. */
  float: ({ schema }) => (
    <InputNumber style={{ width: '100%' }} placeholder={schema.placeholder} {...schema.uiProps} />
  ),

  /** Рендерер для булевых полей. */
  bool: ({ schema }) => <Switch {...schema.uiProps} />,

  /** Рендерер для полей даты. */
  date: ({ schema }) => (
    <DatePicker style={{ width: '100%' }} placeholder={schema.placeholder} {...schema.uiProps} />
  ),

  /** Рендерер для полей даты и времени. */
  datetime: ({ schema }) => (
    <DatePicker
      showTime
      style={{ width: '100%' }}
      placeholder={schema.placeholder}
      {...schema.uiProps}
    />
  ),

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
  return ({ schema: fallbackSchema }) => (
    <Input placeholder={fallbackSchema.placeholder} {...fallbackSchema.uiProps} />
  );
};

// Регистрируем кастомные виджеты по умолчанию
registerWidget('title', props => <TitleWidget {...props} />);
registerWidget('price', props => <PriceWidget {...props} />);
