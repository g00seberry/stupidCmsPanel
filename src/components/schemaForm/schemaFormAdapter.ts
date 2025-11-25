import { getFormConfig } from '@/api/apiFormConfig';
import { getBlueprintSchema } from '@/api/blueprintApi';
import { FormModel } from '@/components/schemaForm/FormModel';
import type { FormValues } from '@/components/schemaForm/FormValues';
import type { ZEditComponent } from './componentDefs/ZComponent';

/**
 * Создаёт FormModel из Blueprint схемы.
 * Загружает схему Blueprint из API, преобразует её в EntitySchema
 * и создаёт готовый FormModel для использования в компонентах.
 * @param blueprintId Идентификатор Blueprint.
 * @param initial Опциональные начальные значения (частичные).
 * @param postTypeSlug Опциональный slug типа контента для загрузки конфигурации формы.
 * @returns Готовый FormModel для использования в SchemaForm.
 * @example
 * const model = await createFormModelFromBlueprintSchema(1, { title: 'Initial Title' }, 'article');
 * <SchemaForm model={model} schema={model.schema} />
 */
export const createFormModelFromBlueprintSchema = async (
  blueprintId: number,
  initial?: Partial<FormValues>,
  postTypeSlug?: string
): Promise<FormModel> => {
  // Загружаем схему Blueprint из API
  const blueprintSchema = await getBlueprintSchema(blueprintId);

  // Загружаем конфигурацию формы, если передан postTypeSlug
  let formConfig: Record<string, ZEditComponent> | undefined;
  if (postTypeSlug) {
    try {
      formConfig = await getFormConfig(postTypeSlug, blueprintId);
    } catch {
      // Если конфигурация не найдена или произошла ошибка, используем пустой объект
      // Не показываем ошибку пользователю, так как конфигурация опциональна
      formConfig = {};
    }
  }

  return new FormModel(blueprintSchema, initial, formConfig);
};
