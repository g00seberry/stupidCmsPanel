import type { FieldUIConfig } from './uiConfig';

/**
 * Скалярные типы данных полей формы.
 */
export type ScalarDataType =
  | 'string'
  | 'text'
  | 'int'
  | 'float'
  | 'bool'
  | 'date'
  | 'datetime'
  | 'ref';

/**
 * Базовый узел поля формы.
 * Содержит общие свойства для всех типов полей.
 */
export interface BaseFieldNode {
  /** Уникальный идентификатор поля. */
  id: number;
  /** Имя поля (URL-friendly строка). */
  name: string;
  /** Полный путь поля в виде массива сегментов (например, ['author', 'contacts', 'email']). */
  fullPath: string[];
  /** Тип данных поля. */
  dataType: ScalarDataType | 'json';
  /** Мощность поля: одно значение или множество. */
  cardinality: 'one' | 'many';
  /** Отображаемая метка поля. */
  label: string;
  /** Флаг обязательности поля. */
  required: boolean;
  /** Флаг только для чтения. */
  readonly: boolean;
  /** Текст подсказки для поля. */
  helpText?: string;
  /** UI-конфигурация поля. */
  ui?: FieldUIConfig;
  /** Порядок сортировки поля среди полей одного уровня. */
  sortOrder: number;
}

/**
 * Узел поля формы типа json.
 * Содержит дочерние поля.
 */
export interface JsonFieldNode extends BaseFieldNode {
  dataType: 'json';
  /** Дочерние поля (обязательны для json). */
  children: FieldNode[];
}

/**
 * Узел поля формы скалярного типа.
 * Не содержит дочерних полей.
 */
export type ScalarFieldNode = BaseFieldNode & {
  dataType: ScalarDataType;
  /** Дочерние поля отсутствуют для скалярных типов. */
  children?: never;
};

/**
 * Узел поля формы.
 * Дискриминированный union по dataType: для 'json' обязательны children, для остальных - нет.
 */
export type FieldNode = JsonFieldNode | ScalarFieldNode;
