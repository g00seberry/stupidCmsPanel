import { observer } from 'mobx-react-lite';
import { Empty, Spin } from 'antd';
import type { ZMedia } from '@/types/media';
import { MediaCard } from '@/components/MediaCard';
import { joinClassNames } from '@/utils/joinClassNames';

/**
 * Пропсы компонента сетки медиа-файлов.
 */
export type PropsMediaGrid = {
  /** Массив медиа-файлов для отображения. */
  media: ZMedia[];
  /** Флаг выполнения запроса загрузки. */
  loading?: boolean;
  /** Флаг начальной загрузки данных. */
  initialLoading?: boolean;
  /** Флаг возможности выбора карточек. */
  selectable?: boolean;
  /** Множество выбранных идентификаторов. */
  selectedIds?: Set<string>;
  /** Обработчик изменения выбранности. */
  onSelectChange?: (id: string, selected: boolean) => void;
  /** Обработчик клика по карточке. */
  onCardClick?: (media: ZMedia) => void;
  /** Обработчик удаления. */
  onDelete?: (id: string) => void;
  /** Обработчик восстановления (для удаленных файлов). */
  onRestore?: (id: string) => void;
  /** Текст для пустого состояния. По умолчанию: 'Медиа-файлы отсутствуют'. */
  emptyText?: string;
  /** Количество колонок в сетке. По умолчанию: 4. */
  columns?: number;
};

/**
 * Компонент сетки медиа-файлов.
 * Отображает медиа-файлы в виде сетки карточек с поддержкой выбора и действий.
 */
export const MediaGrid: React.FC<PropsMediaGrid> = observer(
  ({
    media,
    loading = false,
    initialLoading = false,
    selectable = false,
    selectedIds = new Set(),
    onSelectChange,
    onCardClick,
    onDelete,
    onRestore,
    emptyText = 'Медиа-файлы отсутствуют',
    columns = 4,
  }) => {
    /**
     * Обрабатывает изменение выбранности карточки.
     */
    const handleSelectChange = (id: string, selected: boolean) => {
      onSelectChange?.(id, selected);
    };

    /**
     * Обрабатывает клик по карточке.
     */
    const handleCardClick = (media: ZMedia) => {
      onCardClick?.(media);
    };

    /**
     * Обрабатывает удаление медиа-файла.
     */
    const handleDelete = (id: string) => {
      onDelete?.(id);
    };

    /**
     * Обрабатывает восстановление медиа-файла.
     */
    const handleRestore = (id: string) => {
      onRestore?.(id);
    };

    if (initialLoading) {
      return (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      );
    }

    if (!loading && media.length === 0) {
      return (
        <div className="py-12" role="status" aria-live="polite">
          <Empty description={emptyText} />
        </div>
      );
    }

    return (
      <div
        className={joinClassNames(
          'grid gap-4',
          columns === 2 && 'grid-cols-2',
          columns === 3 && 'grid-cols-3',
          columns === 4 && 'grid-cols-4',
          columns === 5 && 'grid-cols-5',
          columns === 6 && 'grid-cols-6',
          'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
        )}
      >
        {media.map(item => (
          <MediaCard
            key={item.id}
            media={item}
            selectable={selectable}
            selected={selectedIds.has(item.id)}
            onSelectChange={handleSelectChange}
            onClick={handleCardClick}
            onDelete={onDelete ? handleDelete : undefined}
            onRestore={onRestore ? handleRestore : undefined}
          />
        ))}
        {loading && (
          <div className="col-span-full flex justify-center py-8">
            <Spin />
          </div>
        )}
      </div>
    );
  }
);
