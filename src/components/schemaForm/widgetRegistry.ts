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
  /** Текущее значение поля. */
  value?: any;
  /** Обработчик изменения значения поля. */
  onChange?: (value: any) => void;
  /** Флаг отключения поля. */
  disabled?: boolean;
  /** Флаг режима только для чтения. */
  readOnly?: boolean;
  /** Модель формы для доступа к formConfig и ошибкам (опционально, используется для json полей). */
  model?: FormModel;
  /** Обработчик добавления элемента в массив (опционально, используется для json полей). */
  onAddArrayItem?: (path: PathSegment[], defaultValue: any) => void;
  /** Обработчик удаления элемента из массива (опционально, используется для json полей). */
  onRemoveArrayItem?: (path: PathSegment[], index: number) => void;
}
