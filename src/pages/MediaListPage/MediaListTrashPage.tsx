import { MediaGrid } from '@/components/MediaGrid';
import { PageLayout } from '@/components/PageLayout';
import { BulkSelectPanel } from '@/pages/MediaListPage/BulkSelectPanel';
import { buildUrl, PageUrl } from '@/PageUrl';
import type { ZMedia } from '@/types/media';
import { App, Button, Pagination, Popconfirm } from 'antd';
import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  handleBulkForceDeleteMedia,
  handleBulkRestoreMedia,
  handleClearTrash,
  handleRestoreMedia,
} from './mediaListHandlers';
import { MediaListStore } from './MediaListStore';

export const MediaListPageTrash = () => {
  const store = useMemo(() => {
    const s = new MediaListStore();
    // Разделяем параметры на фильтры и пагинацию
    s.tableStore.loader.setFilters({ deleted: 'only' });
    s.tableStore.loader.setPagination({
      page: 1,
      per_page: 15,
    });
    return s;
  }, []);
  return <MediaListTrashPageInner store={store} />;
};

/**
 * Пропсы компонента корзины медиа-файлов.
 */
interface PropsMediaListTrashPageInner {
  /** Store для управления состоянием списка медиа-файлов. */
  store: MediaListStore;
}

/**
 * Компонент корзины медиа-файлов.
 */
const MediaListTrashPageInner = observer(({ store }: PropsMediaListTrashPageInner) => {
  const navigate = useNavigate();
  const { modal, message } = App.useApp();

  /**
   * Обрабатывает изменение страницы пагинации.
   */
  const handlePageChange = async (page: number) => {
    await store.tableStore.loader.goToPage(page);
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

  const totalCount = store.tableStore.loader.resp?.meta?.total || 0;
  const paginationMeta = store.tableStore.loader.resp?.meta;
  const breadcrumbs = [{ label: 'Медиа-файлы', onClick: () => navigate(PageUrl.Media) }, 'Корзина'];

  const extra = (
    <>
      {store.hasSelection && (
        <>
          <Button icon={<RotateCcw className="w-4 h-4" />} onClick={handleBulkRestore}>
            Восстановить выбранные ({store.selectedCount})
          </Button>
          <Popconfirm
            title="Окончательно удалить выбранные?"
            description={`Будет окончательно удалено ${store.selectedCount} медиа-файлов. Это действие нельзя отменить.`}
            onConfirm={handleBulkForceDelete}
            okText="Удалить"
            okType="danger"
            cancelText="Отмена"
            icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
          >
            <Button danger icon={<Trash2 className="w-4 h-4" />}>
              Удалить окончательно ({store.selectedCount})
            </Button>
          </Popconfirm>
        </>
      )}
      {totalCount > 0 && (
        <Popconfirm
          title="Очистить корзину?"
          description={`Будет окончательно удалено ${totalCount} медиа-файлов. Это действие нельзя отменить.`}
          onConfirm={handleClearTrashAction}
          okText="Очистить"
          okType="danger"
          cancelText="Отмена"
          icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
        >
          <Button danger icon={<Trash2 className="w-4 h-4" />}>
            Очистить корзину
          </Button>
        </Popconfirm>
      )}
    </>
  );

  return (
    <PageLayout breadcrumbs={breadcrumbs} extra={extra}>
      {/* Панель массового выбора */}
      <BulkSelectPanel store={store} />

      {/* Сетка медиа-файлов */}
      <MediaGrid
        media={store.tableStore.loader.resp?.data || []}
        loading={store.tableStore.loader.pending}
        initialLoading={store.tableStore.loader.initialLoading}
        selectable
        selectedIds={
          new Set(
            Array.from(store.tableStore.selectedRowKeys).filter(
              (id): id is string => typeof id === 'string'
            )
          )
        }
        onSelectChange={handleSelectChange}
        onCardClick={handleCardClick}
        onRestore={handleRestore}
        columns={4}
        emptyText="Корзина пуста"
      />

      {/* Пагинация */}
      {paginationMeta && paginationMeta.total > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            current={paginationMeta.current_page}
            total={paginationMeta.total}
            pageSize={paginationMeta.per_page}
            showSizeChanger={false}
            showTotal={(total, range) => `${range[0]}-${range[1]} из ${total} файлов`}
            onChange={handlePageChange}
          />
        </div>
      )}
    </PageLayout>
  );
});
