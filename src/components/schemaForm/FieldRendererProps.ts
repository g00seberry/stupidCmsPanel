import type { ZBlueprintSchemaField } from '@/types/blueprintSchema';
import type { PathSegment } from '@/utils/pathUtils';
import type { FormModel } from './FormModel';

/**
 * Пропсы для рендерера поля формы.
 */
export interface FieldRendererProps {
  /** Схема поля для рендеринга. */
  schema: ZBlueprintSchemaField;
  /** Путь к полю в форме (массив сегментов). */
  namePath: PathSegment[];
  /** Модель формы для доступа к значениям, ошибкам и операциям. */
  model: FormModel;
}
