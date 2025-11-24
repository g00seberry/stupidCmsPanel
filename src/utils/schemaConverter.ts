import type { ZBlueprintSchema } from '@/types/blueprintSchema';

/**
 * Преобразует JSON схему Blueprint в EntitySchema для формы.
 * Поскольку EntitySchema теперь использует ZBlueprintSchemaField,
 * схема Blueprint уже совместима и может быть использована напрямую.
 * @param blueprintSchema JSON схема Blueprint из API.
 * @returns EntitySchema для использования в форме.
 * @example
 * const blueprintSchema = await getBlueprintSchema(1);
 * const entitySchema = convertBlueprintSchemaToEntitySchema(blueprintSchema);
 * const model = new FormModel(entitySchema);
 */
export const convertBlueprintSchemaToEntitySchema = (
  blueprintSchema: ZBlueprintSchema
): ZBlueprintSchema => {
  // ZBlueprintSchema уже совместим с EntitySchema, так как оба используют ZBlueprintSchemaField
  return blueprintSchema;
};
