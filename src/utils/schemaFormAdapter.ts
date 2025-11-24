import { getBlueprintSchema } from '@/api/blueprintApi';
import { FormModel } from '@/stores/FormModel';
import type { ZBlueprintSchema } from '@/types/blueprintSchema';
import type { FormValues } from '@/types/schemaForm';

/**
 * Создаёт FormModel из Blueprint схемы.
 * Загружает схему Blueprint из API, преобразует её в EntitySchema
 * и создаёт готовый FormModel для использования в компонентах.
 * @param blueprintId Идентификатор Blueprint.
 * @param initial Опциональные начальные значения (частичные).
 * @returns Готовый FormModel для использования в SchemaForm.
 * @example
 * const model = await createFormModelFromBlueprintSchema(1, { title: 'Initial Title' });
 * <SchemaForm model={model} schema={model.schema} />
 */
export const createFormModelFromBlueprintSchema = async (
  blueprintId: number,
  initial?: Partial<FormValues<ZBlueprintSchema>>
): Promise<FormModel<ZBlueprintSchema>> => {
  // Загружаем схему Blueprint из API
  const blueprintSchema = await getBlueprintSchema(blueprintId);
  return new FormModel(blueprintSchema, initial);
};
