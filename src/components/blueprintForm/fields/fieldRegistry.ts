import type { ZDataType } from '@/types/path';
import type { Rule } from 'antd/es/form';
import type React from 'react';
import type { SchemaFormStore } from '../SchemaFormStore';
import type { FieldNode } from '../types/formField';
import { PathBoolFieldNode } from './PathBoolFieldNode';
import { PathDateFieldNode } from './PathDateFieldNode';
import { PathDateTimeFieldNode } from './PathDateTimeFieldNode';
import { PathFloatFieldNode } from './PathFloatFieldNode';
import { PathIntFieldNode } from './PathIntFieldNode';
import { PathJsonGroupField } from './PathJsonGroupField';
import { PathRefFieldNode } from './PathRefFieldNode';
import { PathStringFieldNode } from './PathStringFieldNode';
import { PathTextAreaFieldNode } from './PathTextAreaFieldNode';

/**
 * Пропсы компонента поля формы (используется на уровне PathField).
 * Компоненты должны принимать value и onChange для совместимости с Form.Item.
 */
export interface FieldComponentProps {
  /** Узел поля формы. */
  node: FieldNode;
  /** Имя поля в форме (массив сегментов пути). */
  name: (string | number)[];
  /** Флаг режима только для чтения. */
  readonly?: boolean;
  /** Store для управления формой. */
  store: SchemaFormStore;
  /** Флаг отключения поля. */
  disabled: boolean;
  /** Placeholder для поля. */
  placeholder?: string;
  /** Текущее значение поля. Передаётся Form.Item автоматически. */
  value?: unknown;
  /** Обработчик изменения значения. Передаётся Form.Item автоматически. */
  onChange?: (value: unknown) => void;
}

/**
 * Пропсы контрола поля формы (value, onChange, disabled).
 * Используется компонентами полей для рендеринга только контрола без Form.Item.
 */
export interface FieldControlProps<T = unknown> {
  /** Текущее значение поля. */
  value?: T;
  /** Обработчик изменения значения. */
  onChange?: (value: T) => void;
  /** Флаг отключения контрола. */
  disabled?: boolean;
}

/**
 * Определение типа поля в реестре.
 * Содержит компонент для рендеринга и опциональные функции для правил валидации и дефолтных значений.
 */
export interface FieldDefinition {
  /** React-компонент для рендеринга поля. */
  Component: React.ComponentType<FieldComponentProps>;
  /** Функция для генерации правил валидации на основе узла поля. */
  getRules?: (node: FieldNode) => Rule[];
  /** Функция для получения дефолтного значения поля. */
  getDefaultValue?: (node: FieldNode) => unknown | unknown[];
}

/**
 * Реестр типов полей формы.
 * Связывает типы данных (dataType) с компонентами и функциями для работы с полями.
 * Все типы из DataType должны быть представлены в реестре.
 * Использует `satisfies` для проверки полноты реестра на этапе компиляции.
 */
export const fieldRegistry = {
  string: {
    Component: PathStringFieldNode,
  },
  text: {
    Component: PathTextAreaFieldNode,
  },
  int: {
    Component: PathIntFieldNode,
  },
  float: {
    Component: PathFloatFieldNode,
  },
  bool: {
    Component: PathBoolFieldNode,
  },
  date: {
    Component: PathDateFieldNode,
  },
  datetime: {
    Component: PathDateTimeFieldNode,
  },
  ref: {
    Component: PathRefFieldNode,
  },
  json: {
    Component: PathJsonGroupField,
  },
} satisfies Record<ZDataType, FieldDefinition>;
