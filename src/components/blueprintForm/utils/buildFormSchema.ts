import { getBlueprintSchema } from '@/api/blueprintApi';
import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { FieldNode } from '../types/formField';

/**
 * Преобразует имя поля в массив сегментов пути.
 * @param fieldName Имя поля (например, "author").
 * @param parentPath Опциональный путь родительского поля.
 * @returns Массив сегментов пути.
 * @example
 * parseFullPath('email', ['author', 'contacts'])
 * // ['author', 'contacts', 'email']
 */
const parseFullPath = (fieldName: string, parentPath: string[] = []): string[] => {
  return parentPath.length > 0 ? [...parentPath, fieldName] : [fieldName];
};

/**
 * Преобразует имя поля в метку для отображения.
 * @param fieldName Имя поля (например, "author_name").
 * @returns Человекочитаемая метка поля.
 * @example
 * getFieldLabelFromName('author_name')
 * // 'Author Name'
 */
const getFieldLabelFromName = (fieldName: string): string => {
  return fieldName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Преобразует поле схемы API в узел поля формы.
 * @param fieldName Имя поля.
 * @param field Поле схемы API.
 * @param parentPath Опциональный путь родительского поля.
 * @param sortOrder Порядок сортировки поля.
 * @returns Узел поля формы.
 */
const convertSchemaFieldToFieldNode = (
  fieldName: string,
  field: ZBlueprintSchemaField,
  parentPath: string[] = [],
  sortOrder: number
): FieldNode => {
  const fullPath = parseFullPath(fieldName, parentPath);
  const label = getFieldLabelFromName(fieldName);

  const fieldNode: FieldNode = {
    id: sortOrder, // Используем sortOrder как временный ID, так как в схеме API нет ID
    name: fieldName,
    fullPath,
    dataType: field.type,
    cardinality: field.cardinality,
    label,
    required: field.required,
    readonly: false, // В схеме API нет информации о readonly
    helpText: undefined,
    validationRules: field.validation,
    sortOrder,
  };

  // Для json типов рекурсивно обрабатываем children
  if (field.type === 'json' && field.children) {
    const childrenEntries = Object.entries(field.children) as Array<
      [string, ZBlueprintSchemaField]
    >;
    fieldNode.children = childrenEntries.map(([childName, childField], index) =>
      convertSchemaFieldToFieldNode(childName, childField, fullPath, index)
    );
  }

  return fieldNode;
};

/**
 * Получает форменную модель из JSON схемы Blueprint через API.
 * Преобразует схему API в FieldNode[] с нормализацией данных.
 * @param blueprintId Идентификатор Blueprint.
 * @returns Массив узлов полей формы.
 * @example
 * const fieldNodes = await buildFormSchema(1);
 * // [{ id: 0, name: 'title', fullPath: ['title'], dataType: 'string', ... }, ...]
 */
export const buildFormSchema = async (blueprintId: number): Promise<FieldNode[]> => {
  const schema = await getBlueprintSchema(blueprintId);
  const schemaEntries = Object.entries(schema.schema) as Array<[string, ZBlueprintSchemaField]>;

  return schemaEntries.map(([fieldName, field], index) =>
    convertSchemaFieldToFieldNode(fieldName, field, [], index)
  );
};
