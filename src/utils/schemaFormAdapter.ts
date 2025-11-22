import { getBlueprintSchema } from '@/api/blueprintApi';
import { FormModel } from '@/stores/FormModel';
import type { EntitySchema, FormValues } from '@/types/schemaForm';
import { convertBlueprintSchemaToEntitySchema } from './schemaConverter';

/**
 * Создаёт FormModel из Blueprint схемы.
 * Загружает схему Blueprint из API, преобразует её в EntitySchema
 * и создаёт готовый FormModel для использования в компонентах.
 * @param blueprintId Идентификатор Blueprint.
 * @param initial Опциональные начальные значения (частичные).
 * @returns Готовый FormModel для использования в SchemaForm.
 * @example
 * const model = await createFormModelFromBlueprintSchema(1, { title: 'Initial Title' });
 * const [form] = Form.useForm();
 * <SchemaForm form={form} model={model} schema={model.schema} />
 */
export const createFormModelFromBlueprintSchema = async <
  E extends EntitySchema = EntitySchema
>(
  blueprintId: number,
  initial?: Partial<FormValues<E>>
): Promise<FormModel<E>> => {
  // Загружаем схему Blueprint из API
  const blueprintSchema = await getBlueprintSchema(blueprintId);

  // Преобразуем в EntitySchema
  const entitySchema = convertBlueprintSchemaToEntitySchema(blueprintSchema) as E;

  // Создаём FormModel с начальными значениями
  const model = new FormModel(entitySchema, initial);

  return model;
};

