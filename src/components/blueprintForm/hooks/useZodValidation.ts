import { useMemo } from 'react';
import type { FieldNode } from '../types/formField';
import { buildZodSchemaFromPaths } from '../utils/buildZodSchemaFromPaths';

/**
 * Хук для генерации Zod-схемы валидации на основе FieldNode[].
 * @param fieldNodes Массив узлов полей формы.
 * @returns Zod-схема для валидации формы.
 * @example
 * const schema = useZodValidation(fieldNodes);
 * const result = schema.safeParse(formData);
 */
export const useZodValidation = (fieldNodes: FieldNode[]) => {
  return useMemo(() => buildZodSchemaFromPaths(fieldNodes), [fieldNodes]);
};

