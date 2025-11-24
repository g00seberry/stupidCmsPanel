import { DatePicker, Input, InputNumber, Switch } from 'antd';
import type React from 'react';
import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { PathSegment } from '@/utils/pathUtils';
import { viewDate } from '@/utils/dateUtils';
import type { Dayjs } from 'dayjs';
import { RefFieldWidget } from './widgets/RefFieldWidget';

/**
 * Пропсы для рендерера поля формы.
 */
export interface FieldRendererProps {
  /** Схема поля для рендеринга. */
  schema: ZBlueprintSchemaField;
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
  string: ({ value, onChange, disabled, readOnly }) => (
    <Input
      value={value}
      onChange={e => onChange?.(e.target.value)}
      disabled={disabled}
      readOnly={readOnly}
    />
  ),

  /** Рендерер для текстовых полей (многострочный текст). */
  text: ({ value, onChange, disabled, readOnly }) => (
    <Input.TextArea
      value={value}
      onChange={e => onChange?.(e.target.value)}
      autoSize
      disabled={disabled}
      readOnly={readOnly}
    />
  ),

  /** Рендерер для целочисленных полей. */
  int: ({ value, onChange, disabled, readOnly }) => (
    <InputNumber
      value={value}
      onChange={onChange}
      style={{ width: '100%' }}
      disabled={disabled}
      readOnly={readOnly}
    />
  ),

  /** Рендерер для чисел с плавающей точкой. */
  float: ({ value, onChange, disabled, readOnly }) => (
    <InputNumber
      value={value}
      onChange={onChange}
      style={{ width: '100%' }}
      disabled={disabled}
      readOnly={readOnly}
    />
  ),

  /** Рендерер для булевых полей. */
  bool: ({ value, onChange, disabled, readOnly }) => (
    <Switch checked={value} onChange={onChange} disabled={disabled || readOnly} />
  ),

  /** Рендерер для полей даты. */
  date: ({ value, onChange, disabled, readOnly }) => {
    // Преобразуем строку в dayjs объект, если значение - строка
    const dayjsValue: Dayjs | null = typeof value === 'string' ? viewDate(value) : (value ?? null);
    return (
      <DatePicker
        value={dayjsValue}
        onChange={onChange}
        style={{ width: '100%' }}
        disabled={disabled || readOnly}
      />
    );
  },

  /** Рендерер для полей даты и времени. */
  datetime: ({ value, onChange, disabled, readOnly }) => {
    // Преобразуем строку в dayjs объект, если значение - строка
    const dayjsValue: Dayjs | null = typeof value === 'string' ? viewDate(value) : (value ?? null);
    return (
      <DatePicker
        value={dayjsValue}
        onChange={onChange}
        showTime
        style={{ width: '100%' }}
        disabled={disabled || readOnly}
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
 * Хранит виджеты по ключам для использования в системе виджетов.
 */
const widgetRegistry: Map<string, FieldRenderer> = new Map();

/**
 * Регистрирует кастомный виджет в реестре.
 * @param key Ключ виджета.
 * @param renderer Функция рендерера виджета.
 * @example
 * registerWidget('title', ({ schema }) => (
 *   <Input maxLength={200} />
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
 * Использует виджет по умолчанию для типа поля или fallback (Input).
 * @param schema Схема поля.
 * @returns Функция рендерера для поля.
 * @example
 * const renderer = getFieldRenderer(fieldSchema);
 * const component = renderer({ schema: fieldSchema, namePath: ['title'] });
 */
export const getFieldRenderer = (schema: ZBlueprintSchemaField): FieldRenderer => {
  // Используем виджет по умолчанию для типа поля
  const defaultRenderer = defaultRenderers[schema.type];
  if (defaultRenderer) {
    return defaultRenderer;
  }

  // Fallback - обычный Input
  return ({ value, onChange, disabled, readOnly }) => (
    <Input
      value={value}
      onChange={e => onChange?.(e.target.value)}
      disabled={disabled}
      readOnly={readOnly}
    />
  );
};
