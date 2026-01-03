import type { FieldRendererProps } from '../../types';
import type { ZEditComponent } from '../../ZComponent';
import type { ZPathMediaConstraints } from '@/types/path/pathConstraints';
import type { FormModel } from '../../FormModel';
import type { PathSegment } from '@/utils/pathUtils';
import type { MediaSelectorStore } from './MediaSelector.store';

/**
 * Пропсы компонента MediaFieldWidget.
 */
export type MediaFieldWidgetProps = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditComponent;
};

/**
 * Пропсы компонента выбора медиа-файлов.
 */
export type MediaSelectorProps = {
  /** Открыт ли Drawer. */
  open: boolean;
  /** Обработчик закрытия Drawer. */
  onClose: () => void;
  /** Обработчик выбора медиа-файлов. */
  onSelect: (mediaIds: string[]) => void;
  /** Store для управления состоянием селектора. */
  store: MediaSelectorStore;
  /** Предвыбранные идентификаторы медиа-файлов. */
  preselectedIds?: string[];
};

/**
 * Опции для создания MediaFieldWidgetStore.
 */
export type MediaFieldWidgetStoreOptions = {
  /** Модель формы. */
  model: FormModel;
  /** Путь к полю в форме. */
  namePath: PathSegment[];
};

/**
 * Опции для создания MediaSelectorStore.
 */
export type MediaSelectorStoreOptions = {
  /** Constraints для фильтрации по MIME типам. */
  constraints?: ZPathMediaConstraints | null;
  /** Режим выбора: 'single' или 'multiple'. */
  selectionMode?: 'single' | 'multiple';
};
