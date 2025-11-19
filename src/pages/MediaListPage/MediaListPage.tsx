import { MediaFilters } from '@/components/MediaFilters';
import { MediaGrid } from '@/components/MediaGrid';
import { MediaUpload } from '@/components/MediaUpload';
import { buildUrl, PageUrl } from '@/PageUrl';
import { notificationService } from '@/services/notificationService';
import type { ZMedia, ZMediaListParams } from '@/types/media';
import { onError } from '@/utils/onError';
import { Button, Modal, Pagination, Popconfirm, Typography } from 'antd';
import { Archive, Trash2, Upload } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MediaListStore } from './MediaListStore';

const { Title, Paragraph } = Typography;

/**
 * Страница со списком медиа-файлов.
 * Обеспечивает просмотр, фильтрацию, загрузку и управление медиа-файлами.
 */
export const MediaListPage = observer(() => {
  const navigate = useNavigate();
  const store = useMemo(() => new MediaListStore(), []);
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
    try {
      await store.bulkDelete([id]);
      notificationService.showSuccess({ message: 'Медиа-файл удалён' });
      // Если удалили последний элемент на странице, переходим на предыдущую
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
    const selectedIds = store.getSelectedIds();
    if (selectedIds.length === 0) {
      return;
    }

    try {
      await store.bulkDelete(selectedIds);
      notificationService.showSuccess({ message: `Удалено медиа-файлов: ${selectedIds.length}` });
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
  };

  const handleApplyFilters = (filters: Partial<ZMediaListParams>) => {
    store.loader.setFilters(filters);
  };

  /**
   * Обрабатывает сброс фильтров.
   */
  const handleResetFilters = async () => {
    await store.resetFilters();
  };

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Breadcrumbs and action buttons */}
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-foreground font-medium">Медиа-файлы</span>
            </div>
            <div className="flex items-center gap-3">
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
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 w-full">
        {/* Заголовок */}
        <div className="mb-6">
          <Title level={3} className="mb-2">
            Медиа-файлы
          </Title>
          <Paragraph type="secondary" className="mb-0">
            Управление медиа-файлами: изображения, видео, аудио и документы
          </Paragraph>
        </div>

        {/* Модальное окно загрузки */}
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

        {/* Фильтры */}
        <MediaFilters
          store={store.filterStore}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          cardClassName="mb-6"
        />

        {/* Сетка медиа-файлов */}
        <MediaGrid
          media={store.loader.data}
          loading={store.loader.pending}
          initialLoading={store.loader.initialLoading}
          selectable
          selectedIds={store.selectedIds}
          onSelectChange={handleSelectChange}
          onCardClick={handleCardClick}
          onDelete={handleDelete}
          columns={4}
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
