import type { FieldRendererProps } from '../../types';
import type { ZEditRefField } from '../../ZComponent';

/**
 * Пропсы компонента RefFieldWidget.
 */
export type RefFieldWidgetProps = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditRefField;
};

/**
 * Параметры для создания store таблицы.
 */
export type StoreParams = {
  /** Массив разрешённых ID типов контента для фильтрации. */
  allowedPostTypeIds: number[];
};

