import type React from 'react';
import type { FieldNode, ScalarDataType } from '../types/formField';
import { PathStringFieldNode } from './PathStringFieldNode';
import { PathTextAreaFieldNode } from './PathTextAreaFieldNode';
import { PathIntFieldNode } from './PathIntFieldNode';
import { PathFloatFieldNode } from './PathFloatFieldNode';
import { PathBoolFieldNode } from './PathBoolFieldNode';
import { PathDateFieldNode } from './PathDateFieldNode';
import { PathDateTimeFieldNode } from './PathDateTimeFieldNode';
import { PathRefFieldNode } from './PathRefFieldNode';
import { PathJsonGroupField } from './PathJsonGroupField';
import type { Rule } from 'antd/es/form';

/**
 * Пропсы компонента поля формы (используется на уровне PathField).
 */
export interface FieldComponentProps {
  /** Узел поля формы. */
  node: FieldNode;
  /** Имя поля в форме (массив сегментов пути). */
  name: (string | number)[];
  /** Флаг режима только для чтения. */
  readonly?: boolean;
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
 * Все типы из ScalarDataType | 'json' должны быть представлены в реестре.
 */
export const fieldRegistry: Record<ScalarDataType | 'json', FieldDefinition> = {
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
};

/**
 * Проверка, что все типы данных имеют реализацию в реестре.
 * Эта проверка выполняется на этапе компиляции TypeScript.
 */
type RegistryKeys = keyof typeof fieldRegistry;
type DataTypeKeys = ScalarDataType | 'json';
// Если эта проверка не проходит, значит какой-то тип данных не представлен в реестре
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _AssertRegistryComplete = RegistryKeys extends DataTypeKeys
  ? DataTypeKeys extends RegistryKeys
    ? true
    : never
  : never;
