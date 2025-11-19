import { MediaFilters } from '@/components/MediaFilters';
import { MediaGrid } from '@/components/MediaGrid';
import { MediaUpload } from '@/components/MediaUpload';
import { buildUrl, PageUrl } from '@/PageUrl';
import type { ZMedia, ZMediaListParams } from '@/types/media';
import { App, Checkbox, Modal, Pagination, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MediaListStore } from './MediaListStore';
import {
  handleBulkDeleteMedia,
  handleBulkForceDeleteMedia,
  handleBulkRestoreMedia,
  handleClearTrash,
  handleDeleteMedia,
  handleRestoreMedia,
} from './mediaListHandlers';
import { MediaListHeader } from './MediaListHeader';

export const MediaListPageMain = () => {
  const store = useMemo(() => new MediaListStore(), []);
  return <Inner store={store} />;
};

export const MediaListPageTrash = () => {
  const store = useMemo(() => {
    const s = new MediaListStore();
    s.loader.setFilters({
      page: 1,
      per_page: 15,
      sort: 'created_at',
      order: 'desc',
      deleted: 'only',
    });
    return s;
  }, []);
  return <Inner store={store} isTrashMode />;
};

const { Title, Paragraph } = Typography;

/**
 * Пропсы универсального компонента списка медиа-файлов.
 */
interface PropsInner {
  /** Store для управления состоянием списка медиа-файлов. */
  store: MediaListStore;
  /** Флаг режима корзины. Если `true`, отображается интерфейс для управления удаленными файлами. */
  isTrashMode?: boolean;
}

const Inner = observer(({ store, isTrashMode = false }: PropsInner) => {
  const navigate = useNavigate();
  const { modal, message } = App.useApp();
  const [uploadVisible, setUploadVisible] = useState(false);

  /**
   * Обрабатывает изменение страницы пагинации.
   */
  const handlePageChange = async (page: number) => {
    await store.loader.goToPage(page);
  };

  /**
   * Обрабатывает клик по карточке медиа-файла.
   */
  const handleCardClick = (media: ZMedia) => {
    navigate(buildUrl(PageUrl.MediaEdit, { id: media.id }));
  };

  /**
   * Обрабатывает изменение выбранности медиа-файла.
   */
  const handleSelectChange = (id: string, selected: boolean) => {
    if (selected) {
      store.selectMedia(id);
    } else {
      store.deselectMedia(id);
    }
  };

  /**
   * Обрабатывает удаление медиа-файла.
   */
  const handleDelete = async (id: string) => {
    await handleDeleteMedia(store, id);
  };

  /**
   * Обрабатывает успешную загрузку файла.
   */
  const handleUploadSuccess = async (_media: ZMedia) => {
    // Обновляем список медиа-файлов без закрытия окна
    // Окно закроется автоматически, когда все файлы будут загружены
    await store.loadMedia();
  };

  /**
   * Обрабатывает завершение всех загрузок.
   */
  const handleAllUploadsComplete = () => {
    // Закрываем окно только после завершения всех загрузок
    setUploadVisible(false);
  };

  /**
   * Обрабатывает удаление выбранных медиа-файлов.
   */
  const handleBulkDelete = async () => {
    await handleBulkDeleteMedia(store);
  };

  /**
   * Обрабатывает восстановление одного медиа-файла.
   */
  const handleRestore = async (id: string) => {
    await handleRestoreMedia(store, id, message);
  };

  /**
   * Обрабатывает восстановление выбранных медиа-файлов.
   */
  const handleBulkRestore = async () => {
    await handleBulkRestoreMedia(store, message);
  };

  /**
   * Обрабатывает окончательное удаление выбранных медиа-файлов.
   */
  const handleBulkForceDelete = async () => {
    await handleBulkForceDeleteMedia(store, modal, message);
  };

  /**
   * Обрабатывает очистку всей корзины.
   */
  const handleClearTrashAction = async () => {
    await handleClearTrash(store, modal, message);
  };

  /**
   * Обрабатывает применение фильтров.
   */
  const handleApplyFilters = (filters: Partial<ZMediaListParams>) => {
    store.loader.setFilters(filters);
  };

  /**
   * Обрабатывает сброс фильтров.
   */
  const handleResetFilters = async () => {
    await store.resetFilters();
  };

  const totalCount = store.loader.paginationMeta?.total || 0;

  return (
    <div className="min-h-screen bg-background w-full">
      <MediaListHeader
        store={store}
        isTrashMode={isTrashMode}
        totalCount={totalCount}
        onUploadClick={() => setUploadVisible(true)}
        onBulkDelete={handleBulkDelete}
        onBulkRestore={handleBulkRestore}
        onBulkForceDelete={handleBulkForceDelete}
        onClearTrash={handleClearTrashAction}
      />

      <div className="px-6 py-8 w-full">
        {/* Заголовок */}
        <div className="mb-6">
          <Title level={3} className="mb-2">
            {isTrashMode ? 'Корзина' : 'Медиа-файлы'}
          </Title>
          <Paragraph type="secondary" className="mb-0">
            {isTrashMode
              ? totalCount > 0
                ? `Удалено медиа-файлов: ${totalCount}. Вы можете восстановить или окончательно удалить файлы.`
                : 'Корзина пуста'
              : 'Управление медиа-файлами: изображения, видео, аудио и документы'}
          </Paragraph>
        </div>

        {/* Модальное окно загрузки */}
        {!isTrashMode && (
          <Modal
            title="Загрузка фото"
            open={uploadVisible}
            onCancel={() => setUploadVisible(false)}
            footer={null}
            width={600}
          >
            <MediaUpload
              config={store.config}
              onSuccess={handleUploadSuccess}
              onAllComplete={handleAllUploadsComplete}
            />
          </Modal>
        )}

        {/* Фильтры */}
        {!isTrashMode && (
          <MediaFilters
            store={store.filterStore}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            cardClassName="mb-6"
          />
        )}

        {/* Панель массового выбора */}
        {store.loader.data.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={
                  store.loader.data.length > 0 &&
                  store.loader.data.every(item => store.selectedIds.has(item.id))
                }
                indeterminate={
                  store.loader.data.some(item => store.selectedIds.has(item.id)) &&
                  !store.loader.data.every(item => store.selectedIds.has(item.id))
                }
                onChange={e => {
                  if (e.target.checked) {
                    store.selectAll();
                  } else {
                    store.deselectAll();
                  }
                }}
              >
                Выбрать все на странице
              </Checkbox>
              {store.hasSelection && (
                <span className="text-sm text-muted-foreground">
                  Выбрано: {store.selectedCount}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Сетка медиа-файлов */}
        <MediaGrid
          media={store.loader.data}
          loading={store.loader.pending}
          initialLoading={store.loader.initialLoading}
          selectable
          selectedIds={store.selectedIds}
          onSelectChange={handleSelectChange}
          onCardClick={handleCardClick}
          onDelete={isTrashMode ? undefined : handleDelete}
          onRestore={isTrashMode ? handleRestore : undefined}
          columns={4}
          emptyText={isTrashMode ? 'Корзина пуста' : undefined}
        />

        {/* Пагинация */}
        {store.loader.paginationMeta && store.loader.paginationMeta.total > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              current={store.loader.paginationMeta.current_page}
              total={store.loader.paginationMeta.total}
              pageSize={store.loader.paginationMeta.per_page}
              showSizeChanger={false}
              showTotal={(total, range) => `${range[0]}-${range[1]} из ${total} файлов`}
              onChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
});
