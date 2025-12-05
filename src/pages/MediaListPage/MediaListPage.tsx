import { MediaFilters } from '@/components/MediaFilters';
import { MediaGrid } from '@/components/MediaGrid';
import { MediaUpload } from '@/components/MediaUpload';
import { buildUrl, PageUrl } from '@/PageUrl';
import type { ZMedia, ZMediaListParams } from '@/types/media';
import { App, Checkbox, Modal, Pagination, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
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
    // Разделяем параметры на фильтры и пагинацию
    s.loader.setFilters({ deleted: 'only' });
    s.loader.setPagination({
      page: 1,
      per_page: 15,
      sort: 'created_at',
      order: 'desc',
    });
    return s;
  }, []);
  return <Inner store={store} isTrashMode />;
};

const { Title, Paragraph } = Typography;

/**
 * Преобразует значения формы в параметры фильтрации медиа (без пагинации и сортировки).
 * @param values Значения формы фильтров.
 * @returns Параметры фильтрации для API.
 */
const convertToMediaFilters = (values: Record<string, unknown>): Partial<ZMediaListParams> => {
  const filters: Partial<ZMediaListParams> = {};

  if (values.q && typeof values.q === 'string' && values.q.trim()) {
    filters.q = values.q.trim();
  }

  if (values.kind && typeof values.kind === 'string') {
    filters.kind = values.kind as ZMediaListParams['kind'];
  }

  if (values.mime && typeof values.mime === 'string' && values.mime.trim()) {
    filters.mime = values.mime.trim();
  }

  if (values.deleted && typeof values.deleted === 'string') {
    filters.deleted = values.deleted as ZMediaListParams['deleted'];
  }

  return filters;
};

/**
 * Преобразует значения формы в параметры пагинации и сортировки.
 * @param values Значения формы фильтров.
 * @returns Параметры пагинации и сортировки для API.
 */
const convertToMediaPagination = (values: Record<string, unknown>): Partial<ZMediaListParams> => {
  const pagination: Partial<ZMediaListParams> = {};

  if (values.sort && typeof values.sort === 'string') {
    pagination.sort = values.sort as ZMediaListParams['sort'];
  }

  if (values.order && typeof values.order === 'string') {
    pagination.order = values.order as ZMediaListParams['order'];
  }

  return pagination;
};

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
  const [isUploading, setIsUploading] = useState(false);

  // Отслеживание изменений фильтров и вызов onApply с дебаунсингом
  useEffect(() => {
    const filters = convertToMediaFilters(store.filterStore.values);
    const pagination = convertToMediaPagination(store.filterStore.values);
    handleApplyFilters(filters, pagination);
  }, [store.filterStore.values]);

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
   * Обрабатывает изменение состояния загрузки.
   */
  const handleUploadingChange = (uploading: boolean) => {
    setIsUploading(uploading);
  };

  /**
   * Обрабатывает попытку закрытия модального окна.
   * Показывает предупреждение, если идет загрузка.
   */
  const handleModalCancel = () => {
    if (isUploading) {
      modal.confirm({
        title: 'Идет загрузка файлов',
        content: 'Вы уверены, что хотите закрыть окно? Загрузка будет прервана.',
        okText: 'Закрыть',
        cancelText: 'Отмена',
        onOk: () => {
          setUploadVisible(false);
        },
      });
    } else {
      setUploadVisible(false);
    }
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
   * Обрабатывает применение фильтров и параметров пагинации.
   * @param filters Параметры фильтрации (без пагинации и сортировки).
   * @param pagination Параметры пагинации и сортировки.
   */
  const handleApplyFilters = (
    filters: Partial<ZMediaListParams>,
    pagination?: Partial<ZMediaListParams>
  ) => {
    store.loader.setFilters(filters);
    if (pagination && Object.keys(pagination).length > 0) {
      store.loader.setPagination(pagination);
    }
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
            onCancel={handleModalCancel}
            footer={null}
            width={600}
            maskClosable={!isUploading}
            closable={true}
          >
            <MediaUpload
              config={store.config}
              onSuccess={handleUploadSuccess}
              onAllComplete={handleAllUploadsComplete}
              onUploadingChange={handleUploadingChange}
              disabled={isUploading}
            />
          </Modal>
        )}

        {/* Фильтры */}
        {!isTrashMode && <MediaFilters store={store.filterStore} cardClassName="mb-6" />}

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
