import type { ZCardinality, ZDataType } from './path';

/**
 * Тип данных поля в схеме формы.
 * Определяет допустимые типы данных для полей формы.
 * @example
 * const fieldType: FieldType = 'string';
 */
export type FieldType = ZDataType;

/**
 * Мощность поля в схеме формы.
 * Определяет, может ли поле содержать одно значение или множество.
 * @example
 * const cardinality: Cardinality = 'one';
 */
export type Cardinality = ZCardinality;

/**
 * Спецификация правила валидации поля.
 * Описывает одно правило валидации с типом, значением и сообщением об ошибке.
 * @example
 * const validationSpec: ValidationSpec = {
 *   type: 'min',
 *   value: 0,
 *   message: 'Цена не может быть отрицательной'
 * };
 */
export interface ValidationSpec {
  /** Тип правила валидации. */
  type: 'required' | 'min' | 'max' | 'regex' | 'enum' | 'custom';
  /** Значение правила (для min/max - число, для regex - паттерн, для enum - массив значений). */
  value?: any;
  /** Сообщение об ошибке при нарушении правила. */
  message?: string;
  /** Имя кастомного валидатора в реестре (только для type: 'custom'). */
  validatorKey?: string;
}

/**
 * Схема поля в форме.
 * Описывает структуру и валидацию одного поля формы.
 * @example
 * const fieldSchema: FieldSchema = {
 *   type: 'string',
 *   required: true,
 *   indexed: true,
 *   cardinality: 'one',
 *   validation: []
 * };
 */
export interface FieldSchema {
  /** Тип данных поля. */
  type: FieldType;
  /** Флаг обязательности поля. */
  required: boolean;
  /** Флаг индексации поля для поиска. */
  indexed: boolean;
  /** Мощность поля: одно значение или множество. */
  cardinality: Cardinality;
  /** Массив правил валидации поля. */
  validation: ValidationSpec[];
  /** Вложенные поля (только для типа json). */
  children?: Record<string, FieldSchema>;
}

/**
 * Схема сущности для формы.
 * Описывает полную структуру данных формы через набор полей.
 * @example
 * const entitySchema: EntitySchema = {
 *   schema: {
 *     title: {
 *       type: 'string',
 *       required: true,
 *       indexed: true,
 *       cardinality: 'one',
 *       validation: []
 *     },
 *     author: {
 *       type: 'json',
 *       required: false,
 *       indexed: false,
 *       cardinality: 'one',
 *       validation: [],
 *       children: {
 *         name: {
 *           type: 'string',
 *           required: true,
 *           indexed: false,
 *           cardinality: 'one',
 *           validation: []
 *         }
 *       }
 *     }
 *   }
 * };
 */
export interface EntitySchema {
  /** Объект с полями схемы, где ключ - имя поля, значение - описание поля. */
  schema: Record<string, FieldSchema>;
}

/**
 * Выводит тип значения поля на основе его схемы.
 * Рекурсивно обрабатывает вложенные json поля и учитывает cardinality.
 * @template F Схема поля.
 * @example
 * type StringValue = InferFieldValue<{ type: 'string', ... }>;
 * // string
 * type NumberValue = InferFieldValue<{ type: 'float', ... }>;
 * // number
 * type JsonValue = InferFieldValue<{ type: 'json', children: { name: { type: 'string', ... } } }>;
 * // { name: string }
 */
export type InferFieldValue<F extends FieldSchema> = F['type'] extends 'json'
  ? F['children'] extends Record<string, FieldSchema>
    ? InferFormValues<F['children']>
    : unknown
  : F['type'] extends 'string' | 'text'
    ? string
    : F['type'] extends 'int' | 'float'
      ? number
      : F['type'] extends 'bool'
        ? boolean
        : F['type'] extends 'date' | 'datetime'
          ? string
          : F['type'] extends 'ref'
            ? string | number
            : unknown;

/**
 * Выводит тип значений формы на основе схемы полей.
 * Рекурсивно обрабатывает все поля и учитывает cardinality для массивов.
 * @template S Объект с полями схемы.
 * @example
 * const schema = {
 *   title: { type: 'string', cardinality: 'one', ... },
 *   tags: { type: 'string', cardinality: 'many', ... },
 *   author: {
 *     type: 'json',
 *     cardinality: 'one',
 *     children: {
 *       name: { type: 'string', cardinality: 'one', ... }
 *     }
 *   }
 * } as const;
 * type FormValues = InferFormValues<typeof schema>;
 * // { title: string; tags: string[]; author: { name: string } }
 */
export type InferFormValues<S extends Record<string, FieldSchema>> = {
  [K in keyof S]: S[K]['cardinality'] extends 'many'
    ? Array<InferFieldValue<S[K]>>
    : InferFieldValue<S[K]>;
};

/**
 * Выводит тип значений формы на основе схемы сущности.
 * Удобный алиас для работы с EntitySchema.
 * @template E Схема сущности.
 * @example
 * const productSchema: EntitySchema = {
 *   schema: {
 *     title: { type: 'string', cardinality: 'one', ... },
 *     price: { type: 'float', cardinality: 'one', ... }
 *   }
 * };
 * type ProductFormValues = FormValues<typeof productSchema>;
 * // { title: string; price: number }
 */
export type FormValues<E extends EntitySchema> = InferFormValues<E['schema']>;
