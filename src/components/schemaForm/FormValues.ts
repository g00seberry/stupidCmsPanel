import type { ZBlueprintSchema, ZBlueprintSchemaField } from '../../types/blueprintSchema';

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
type InferFieldValue<F extends ZBlueprintSchemaField> = F['type'] extends 'json'
  ? F['children'] extends Record<string, ZBlueprintSchemaField>
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
type InferFormValues<S extends Record<string, ZBlueprintSchemaField>> = {
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
export type FormValues = InferFormValues<ZBlueprintSchema['schema']>;
