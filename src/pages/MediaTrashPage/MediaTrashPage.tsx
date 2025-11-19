import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Popconfirm, message, Modal } from 'antd';
import { RotateCcw, Trash2, AlertTriangle } from 'lucide-react';
import { MediaListStore } from '@/pages/MediaListPage/MediaListStore';
import { MediaGrid } from '@/components/MediaGrid';
import { restoreMedia, bulkRestoreMedia, bulkForceDeleteMedia } from '@/api/apiMedia';
import { onError } from '@/utils/onError';
import { buildUrl, PageUrl } from '@/PageUrl';
import type { ZMedia } from '@/types/media';
import { Pagination } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * Страница управления удаленными медиа-файлами.
 * Обеспечивает просмотр, восстановление и окончательное удаление медиа-файлов из корзины.
 */
export const MediaTrashPage = observer(() => {
  const navigate = useNavigate();
  const store = useMemo(() => {
    const newStore = new MediaListStore();
    // Устанавливаем фильтр для показа только удаленных файлов
    void newStore.setFilters({ deleted: 'only', page: 1 });
    return newStore;
  }, []);

  // Инициализация загрузки данных
  useEffect(() => {
    void store.initialize();
  }, [store]);

  /**
   * Обрабатывает изменение страницы пагинации.
   */
  const handlePageChange = async (page: number) => {
    await store.goToPage(page);
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
    try {
      await restoreMedia(id);
      message.success('Медиа-файл восстановлен');
      await store.loadMedia();
    } catch (error) {
      onError(error);
    }
  };

  /**
   * Обрабатывает восстановление выбранных медиа-файлов.
   */
  const handleBulkRestore = async () => {
    const selectedIds = store.getSelectedIds();
    if (selectedIds.length === 0) {
      return;
    }

    try {
      await bulkRestoreMedia(selectedIds);
      message.success(`Восстановлено медиа-файлов: ${selectedIds.length}`);
      store.deselectAll();
      await store.loadMedia();
    } catch (error) {
      onError(error);
    }
  };

  /**
   * Обрабатывает окончательное удаление выбранных медиа-файлов.
   */
  const handleBulkForceDelete = async () => {
    const selectedIds = store.getSelectedIds();
    if (selectedIds.length === 0) {
      return;
    }

    Modal.confirm({
      title: 'Окончательное удаление',
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      content: `Вы уверены, что хотите окончательно удалить ${selectedIds.length} медиа-файлов? Это действие нельзя отменить.`,
      okText: 'Удалить окончательно',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await bulkForceDeleteMedia(selectedIds);
          message.success(`Удалено медиа-файлов: ${selectedIds.length}`);
          store.deselectAll();
          await store.loadMedia();
        } catch (error) {
          onError(error);
        }
      },
    });
  };

  /**
   * Обрабатывает очистку всей корзины.
   */
  const handleClearTrash = async () => {
    const allMediaIds = store.media.map(m => m.id);
    if (allMediaIds.length === 0) {
      return;
    }

    Modal.confirm({
      title: 'Очистить корзину',
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      content: `Вы уверены, что хотите окончательно удалить все ${allMediaIds.length} медиа-файлов из корзины? Это действие нельзя отменить.`,
      okText: 'Очистить корзину',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await bulkForceDeleteMedia(allMediaIds);
          message.success('Корзина очищена');
          store.deselectAll();
          await store.loadMedia();
        } catch (error) {
          onError(error);
        }
      },
    });
  };

  const totalCount = store.paginationMeta?.total || 0;

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Breadcrumbs and action buttons */}
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className="hover:text-foreground cursor-pointer transition-colors"
                onClick={() => navigate(PageUrl.Media)}
              >
                Медиа-файлы
              </span>
              <span>/</span>
              <span className="text-foreground font-medium">Корзина</span>
            </div>
            <div className="flex items-center gap-3">
              {store.hasSelection && (
                <>
                  <Button
                    icon={<RotateCcw className="w-4 h-4" />}
                    onClick={handleBulkRestore}
                  >
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
                  onConfirm={handleClearTrash}
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
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 w-full">
        {/* Заголовок */}
        <div className="mb-6">
          <Title level={3} className="mb-2">
            Корзина
          </Title>
          <Paragraph type="secondary" className="mb-0">
            {totalCount > 0
              ? `Удалено медиа-файлов: ${totalCount}. Вы можете восстановить или окончательно удалить файлы.`
              : 'Корзина пуста'}
          </Paragraph>
        </div>

        {/* Сетка медиа-файлов */}
        <MediaGrid
          media={store.media}
          loading={store.pending}
          initialLoading={store.initialLoading}
          selectable
          selectedIds={store.selectedIds}
          onSelectChange={handleSelectChange}
          onCardClick={handleCardClick}
          onRestore={(id: string) => handleRestore(id)}
          columns={4}
          emptyText="Корзина пуста"
        />

        {/* Пагинация */}
        {store.paginationMeta && store.paginationMeta.total > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              current={store.paginationMeta.current_page}
              total={store.paginationMeta.total}
              pageSize={store.paginationMeta.per_page}
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

