import type { ZDataType } from '@/types/path';

/**
 * Узел поля формы.
 * Содержит все свойства поля, включая опциональные дочерние поля.
 */
export interface FieldNode {
  /** Уникальный идентификатор поля. */
  id: number;
  /** Имя поля (URL-friendly строка). */
  name: string;
  /** Полный путь поля в виде массива сегментов (например, ['author', 'contacts', 'email']). */
  fullPath: string[];
  /** Тип данных поля. */
  dataType: ZDataType;
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
  /** Правила валидации поля. */
  validationRules?: Array<{ type: string; [key: string]: unknown }>;
  /** Порядок сортировки поля среди полей одного уровня. */
  sortOrder: number;
  /** Дочерние поля (для полей типа json). Опциональны для всех типов. */
  children?: FieldNode[];
}
