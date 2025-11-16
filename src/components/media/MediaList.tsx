import { observer } from 'mobx-react-lite';
import { Card, Empty, Pagination, Spin } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { MediaCard } from './MediaCard';
import { mediaStore } from '@/stores/mediaStore';
import type { ZMedia } from '@/types/media';

/**
 * Пропсы компонента списка медиафайлов.
 */
export type PropsMediaList = {
  /** Возможность множественного выбора медиафайлов. */
  selectable?: boolean;
  /** Обработчик выбора одного медиафайла. */
  onSelect?: (media: ZMedia, selected: boolean) => void;
  /** Обработчик выбора нескольких медиафайлов. */
  onSelectMultiple?: (media: ZMedia[]) => void;
  /** Обработчик редактирования медиафайла. */
  onEdit?: (media: ZMedia) => void;
  /** Обработчик удаления медиафайла. */
  onDelete?: (media: ZMedia) => void;
  /** Обработчик скачивания медиафайла. */
  onDownload?: (media: ZMedia) => void;
  /** Обработчик клика по карточке медиафайла. */
  onClick?: (media: ZMedia) => void;
};

/**
 * Компонент списка медиафайлов с поддержкой сетки, пагинации и множественного выбора.
 * Использует mediaStore для получения данных и управления состоянием.
 * @example
 * <MediaList
 *   selectable
 *   onSelect={handleSelect}
 *   onSelectMultiple={handleSelectMultiple}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onDownload={handleDownload}
 * />
 */
export const MediaList: React.FC<PropsMediaList> = observer(
  ({ selectable = false, onSelect, onSelectMultiple, onEdit, onDelete, onDownload, onClick }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handlePageChange = useCallback((page: number) => void mediaStore.setPage(page), []);

    const handleSelect = useCallback(
      (media: ZMedia, selected: boolean) => {
        const newSelectedIds = new Set(selectedIds);
        if (selected) {
          newSelectedIds.add(media.id);
        } else {
          newSelectedIds.delete(media.id);
        }
        setSelectedIds(newSelectedIds);

        onSelect?.(media, selected);
        if (onSelectMultiple) {
          const selectedMedia = mediaStore.mediaList.filter(m => newSelectedIds.has(m.id));
          onSelectMultiple(selectedMedia);
        }
      },
      [selectedIds, onSelect, onSelectMultiple]
    );

    const handleDelete = useCallback(
      async (media: ZMedia) => {
        await onDelete?.(media);
        setSelectedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(media.id);
          return newSet;
        });
      },
      [onDelete]
    );

    // Инициализация загрузки данных при первом монтировании
    useEffect(() => {
      if (mediaStore.mediaList.length === 0 && !mediaStore.pending && !mediaStore.initialLoading) {
        void mediaStore.initialize();
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (mediaStore.initialLoading) {
      return (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      );
    }

    const { mediaList, paginationMeta, pending } = mediaStore;
    const hasPagination = paginationMeta && paginationMeta.last_page > 1;
    const showTotal = (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} из ${total} файлов`;

    if (mediaList.length === 0 && !pending) {
      return (
        <Card>
          <Empty description="Медиафайлы отсутствуют" />
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Индикатор выбранных элементов */}
        {selectable && selectedIds.size > 0 && (
          <div className="flex justify-end">
            <div className="text-gray-600">Выбрано: {selectedIds.size}</div>
          </div>
        )}

        {/* Список медиафайлов */}
        <Spin spinning={pending}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {mediaList.map(media => (
              <MediaCard
                key={media.id}
                media={media}
                selectable={selectable}
                selected={selectedIds.has(media.id)}
                showActions
                onClick={onClick}
                onSelect={handleSelect}
                onEdit={onEdit}
                onDelete={handleDelete}
                onDownload={onDownload}
              />
            ))}
          </div>
        </Spin>

        {/* Пагинация */}
        {hasPagination && (
          <div className="flex justify-center">
            <Pagination
              current={paginationMeta.current_page}
              total={paginationMeta.total}
              pageSize={paginationMeta.per_page}
              showSizeChanger={false}
              showTotal={showTotal}
              onChange={handlePageChange}
            />
          </div>
        )}
      </div>
    );
  }
);
