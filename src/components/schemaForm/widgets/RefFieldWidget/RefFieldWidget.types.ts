import type { FieldRendererProps } from '../../types';
import type { ZEditRefField } from '../../ZComponent';
import type { FormModel } from '../../FormModel';
import type { PathSegment } from '@/utils/pathUtils';

/**
 * Пропсы компонента RefFieldWidget.
 */
export type RefFieldWidgetProps = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditRefField;
};

/**
 * Опции для создания RefFieldWidgetStore.
 */
export type RefFieldWidgetStoreOptions = {
  /** Модель формы. */
  model: FormModel;
  /** Путь к полю в форме. */
  namePath: PathSegment[];
};
