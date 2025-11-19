import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Popconfirm, App } from 'antd';
import { RotateCcw, Trash2, AlertTriangle } from 'lucide-react';
import { MediaListStore } from '@/pages/MediaListPage/MediaListStore';
import { MediaGrid } from '@/components/MediaGrid';
import { restoreMedia, bulkRestoreMedia, bulkForceDeleteMedia, listMedia } from '@/api/apiMedia';
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
  const { modal, message } = App.useApp();
  const store = useMemo(() => {
    const newStore = new MediaListStore();
    // Устанавливаем фильтр для показа только удаленных файлов
    void newStore.loader.setFilters({ deleted: 'only', page: 1 });
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
   * Обрабатывает восстановление одного медиа-файла.
   */
  const handleRestore = async (id: string) => {
    try {
      await restoreMedia(id);
      message.success('Медиа-файл восстановлен');
      // Если восстановили последний элемент на странице, переходим на предыдущую
      const currentPage = store.loader.paginationMeta?.current_page || 1;
      if (currentPage > 1 && store.loader.data.length === 1) {
        await store.loader.goToPage(currentPage - 1);
      } else {
        await store.loadMedia();
      }
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
      // Если восстановили все элементы на текущей странице, переходим на предыдущую
      const currentPage = store.loader.paginationMeta?.current_page || 1;
      if (currentPage > 1 && store.loader.data.length === selectedIds.length) {
        await store.loader.goToPage(currentPage - 1);
      } else {
        await store.loadMedia();
      }
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

    modal.confirm({
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
          // Если удалили все элементы на текущей странице, переходим на предыдущую
          const currentPage = store.loader.paginationMeta?.current_page || 1;
          if (currentPage > 1 && store.loader.data.length === selectedIds.length) {
            await store.loader.goToPage(currentPage - 1);
          } else {
            await store.loadMedia();
          }
        } catch (error) {
          onError(error);
        }
      },
    });
  };

  /**
   * Загружает все медиа-файлы из корзины.
   * @returns Массив всех идентификаторов удаленных медиа-файлов.
   */
  const loadAllTrashMediaIds = async (): Promise<string[]> => {
    const allIds: string[] = [];
    let lastPage = 1;

    // Сначала загружаем первую страницу, чтобы узнать общее количество страниц
    try {
      const firstResult = await listMedia({
        deleted: 'only',
        page: 1,
        per_page: 100, // Максимальное количество на странице
        sort: 'created_at',
        order: 'desc',
      });

      allIds.push(...firstResult.data.map(m => m.id));
      lastPage = firstResult.meta.last_page;

      // Загружаем остальные страницы, если они есть
      for (let page = 2; page <= lastPage; page++) {
        const result = await listMedia({
          deleted: 'only',
          page,
          per_page: 100,
          sort: 'created_at',
          order: 'desc',
        });

        allIds.push(...result.data.map(m => m.id));
      }
    } catch (error) {
      onError(error);
    }

    return allIds;
  };

  /**
   * Обрабатывает очистку всей корзины.
   */
  const handleClearTrash = async () => {
    const totalCount = store.loader.paginationMeta?.total || 0;
    if (totalCount === 0) {
      return;
    }

    modal.confirm({
      title: 'Очистить корзину',
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      content: `Вы уверены, что хотите окончательно удалить все ${totalCount} медиа-файлов из корзины? Это действие нельзя отменить.`,
      okText: 'Очистить корзину',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          // Загружаем все ID файлов из корзины
          const allMediaIds = await loadAllTrashMediaIds();

          if (allMediaIds.length === 0) {
            message.info('Корзина уже пуста');
            await store.loadMedia();
            return;
          }

          // Удаляем все файлы порциями, если их много
          const batchSize = 100;
          for (let i = 0; i < allMediaIds.length; i += batchSize) {
            const batch = allMediaIds.slice(i, i + batchSize);
            await bulkForceDeleteMedia(batch);
          }

          message.success(`Корзина очищена. Удалено ${allMediaIds.length} медиа-файлов`);
          store.deselectAll();
          // После очистки корзины возвращаемся на первую страницу
          await store.loader.goToPage(1);
          await store.loadMedia();
        } catch (error) {
          onError(error);
        }
      },
    });
  };

  const totalCount = store.loader.paginationMeta?.total || 0;

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
          media={store.loader.data}
          loading={store.loader.pending}
          initialLoading={store.loader.initialLoading}
          selectable
          selectedIds={store.selectedIds}
          onSelectChange={handleSelectChange}
          onCardClick={handleCardClick}
          onRestore={(id: string) => handleRestore(id)}
          columns={4}
          emptyText="Корзина пуста"
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
