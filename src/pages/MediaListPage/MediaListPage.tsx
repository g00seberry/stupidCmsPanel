import { MediaFilters } from '@/components/MediaFilters';
import { MediaGrid } from '@/components/MediaGrid';
import { MediaUpload } from '@/components/MediaUpload';
import { PageLayout } from '@/components/PageLayout';
import { BulkSelectPanel } from '@/pages/MediaListPage/BulkSelectPanel';
import { buildUrl, PageUrl } from '@/PageUrl';
import type { ZMedia, ZMediaListFilters } from '@/types/media';
import { App, Button, Modal, Pagination, Popconfirm } from 'antd';
import { Archive, Trash2, Upload } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleBulkDeleteMedia, handleDeleteMedia } from './mediaListHandlers';
import { MediaListStore } from './MediaListStore';

/**
 * Компонент основного списка медиа-файлов.
 */
export const MediaListPageMain = observer(() => {
  const store = useMemo(() => new MediaListStore(), []);
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Отслеживание изменений фильтров и вызов onApply с дебаунсингом
  useEffect(() => {
    handleApplyFilters(store.filterStore.values);
  }, [store.filterStore.values]);

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
   * Обрабатывает применение фильтров и параметров пагинации.
   * @param filters Параметры фильтрации (без пагинации и сортировки).
   * @param pagination Параметры пагинации и сортировки.
   */
  const handleApplyFilters = (filters: Partial<ZMediaListFilters>) => {
    store.tableStore.loader.setFilters(filters);
  };

  const breadcrumbs = ['Медиа-файлы'];
  const paginationMeta = store.tableStore.loader.resp?.meta;

  const extra = (
    <>
      <Link to={PageUrl.MediaTrash}>
        <Button icon={<Archive className="w-4 h-4" />}>Корзина</Button>
      </Link>
      <Button
        type="primary"
        icon={<Upload className="w-4 h-4" />}
        onClick={() => setUploadVisible(true)}
      >
        Загрузить файлы
      </Button>
      {store.hasSelection && (
        <Popconfirm
          title="Удалить выбранные медиа-файлы?"
          description={`Будет удалено ${store.selectedCount} медиа-файлов.`}
          onConfirm={handleBulkDelete}
          okText="Удалить"
          cancelText="Отмена"
        >
          <Button danger icon={<Trash2 className="w-4 h-4" />}>
            Удалить выбранные ({store.selectedCount})
          </Button>
        </Popconfirm>
      )}
    </>
  );
  return (
    <PageLayout breadcrumbs={breadcrumbs} extra={extra}>
      {/* Модальное окно загрузки */}
      {uploadVisible && (
        <Modal
          title="Загрузка фото"
          open
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
      <MediaFilters store={store.filterStore} cardClassName="mb-6" />

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
        onDelete={handleDelete}
        columns={4}
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
