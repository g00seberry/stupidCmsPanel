import { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography, Modal, Popconfirm, Pagination, App } from 'antd';
import { Upload, Trash2, Archive } from 'lucide-react';
import { MediaListStore } from './MediaListStore';
import { MediaGrid } from '@/components/MediaGrid';
import { MediaUpload } from '@/components/MediaUpload';
import { onError } from '@/utils/onError';
import { buildUrl, PageUrl } from '@/PageUrl';
import type { ZMedia, ZMediaListParams } from '@/types/media';
import { MediaFilters } from '@/components/MediaFilters';
import { FilterFormStore } from '@/components/FilterForm';

const { Title, Paragraph } = Typography;

/**
 * Страница со списком медиа-файлов.
 * Обеспечивает просмотр, фильтрацию, загрузку и управление медиа-файлами.
 */
export const MediaListPage = observer(() => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const store = useMemo(() => new MediaListStore(), []);
  const filterStore = useMemo(() => new FilterFormStore(), []);

  const [uploadVisible, setUploadVisible] = useState(false);

  // Инициализация загрузки данных
  useEffect(() => {
    store.initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Убираем store из зависимостей, чтобы избежать повторной инициализации

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
   * Обрабатывает удаление медиа-файла.
   */
  const handleDelete = async (id: string) => {
    try {
      await store.bulkDelete([id]);
      message.success('Медиа-файл удалён');
      // Если удалили последний элемент на странице, переходим на предыдущую
      const currentPage = store.paginationMeta?.current_page || 1;
      if (currentPage > 1 && store.media.length === 1) {
        await store.goToPage(currentPage - 1);
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
      message.success(`Удалено медиа-файлов: ${selectedIds.length}`);
      store.deselectAll();
      // Если удалили все элементы на текущей странице, переходим на предыдущую
      const currentPage = store.paginationMeta?.current_page || 1;
      if (currentPage > 1 && store.media.length === selectedIds.length) {
        await store.goToPage(currentPage - 1);
      } else {
        await store.loadMedia();
      }
    } catch (error) {
      onError(error);
    }
  };

  const handleApplyFilters = (filters: Partial<ZMediaListParams>) => {
    store.setFilters(filters);
  };

  /**
   * Обрабатывает сброс фильтров.
   */
  const handleResetFilters = async () => {
    await store.resetFilters();
    filterStore.reset({ sort: 'created_at', order: 'desc' });
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
          store={filterStore}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          cardClassName="mb-6"
        />

        {/* Сетка медиа-файлов */}
        <MediaGrid
          media={store.media}
          loading={store.pending}
          initialLoading={store.initialLoading}
          selectable
          selectedIds={store.selectedIds}
          onSelectChange={handleSelectChange}
          onCardClick={handleCardClick}
          onDelete={handleDelete}
          columns={4}
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
