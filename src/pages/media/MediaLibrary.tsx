import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { Tabs, Button, Space, Modal, message } from 'antd';
import { UploadOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { MediaList, MediaFilters, MediaUploader } from '@/components/media';
import { mediaStore } from '@/stores/mediaStore';
import { onError } from '@/utils/onError';
import type { ZMedia } from '@/types/media';
import { PageUrl, buildUrl } from '@/PageUrl';
import { MediaDetails } from '@/components/media/MediaDetails';
import { normalizeMediaUrl } from '@/utils/media';
import { getMediaDownloadUrl } from '@/api/apiMedia';

const { confirm } = Modal;

/**
 * Страница медиа-библиотеки CMS.
 * Объединяет компоненты для просмотра, фильтрации, загрузки и управления медиафайлами.
 * @example
 * // Использование через маршрутизацию
 * <Route path="/media" element={<MediaLibrary />} />
 * <Route path="/media/:id" element={<MediaLibrary />} />
 */
export const MediaLibrary = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [activeTab, setActiveTab] = useState<'list' | 'upload'>('list');
  const [selectedMediaIds, setSelectedMediaIds] = useState<Set<string>>(new Set());
  const detailsMediaId = id || null;

  // Инициализация загрузки данных при первом открытии
  useEffect(() => {
    if (activeTab === 'list' && mediaStore.mediaList.length === 0) {
      void mediaStore.initialize();
    }
  }, [activeTab]);

  /**
   * Обработчик успешной загрузки файла.
   */
  const handleUploadSuccess = useCallback((media: ZMedia) => {
    message.success(`Файл "${media.name}" успешно загружен`);
    // Переключаемся на список после успешной загрузки
    setActiveTab('list');
    // Перезагружаем список медиафайлов
    void mediaStore.loadMediaList();
  }, []);

  /**
   * Обработчик ошибки загрузки файла.
   */
  const handleUploadError = useCallback((error: Error, file: File) => {
    message.error(`Ошибка загрузки файла "${file.name}": ${error.message}`);
    onError(error);
  }, []);

  const handleMediaClick = useCallback(
    (media: ZMedia) => navigate(buildUrl(PageUrl.MediaDetails, { id: media.id })),
    [navigate]
  );

  const handleSelect = useCallback((media: ZMedia, selected: boolean) => {
    setSelectedMediaIds(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(media.id);
      } else {
        newSet.delete(media.id);
      }
      return newSet;
    });
  }, []);

  const handleSelectMultiple = useCallback((items: ZMedia[]) => {
    setSelectedMediaIds(new Set(items.map(m => m.id)));
  }, []);

  const handleEdit = useCallback(
    (media: ZMedia) => navigate(buildUrl(PageUrl.MediaDetails, { id: media.id })),
    [navigate]
  );

  const handleEditFromDetails = useCallback(
    (mediaId: string) => {
      navigate(buildUrl(PageUrl.MediaEdit, { id: mediaId }));
    },
    [navigate]
  );

  const handleDelete = useCallback(async (media: ZMedia) => {
    try {
      await mediaStore.deleteMedia(media.id);
      message.success(`Медиафайл "${media.name}" удалён`);
      setSelectedMediaIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(media.id);
        return newSet;
      });
    } catch (error) {
      // Ошибка уже обработана в mediaStore.deleteMedia через onError
    }
  }, []);

  const handleDownload = useCallback((media: ZMedia) => {
    window.open(normalizeMediaUrl(getMediaDownloadUrl(media.id)), '_blank');
  }, []);

  const handleBulkDelete = useCallback(async () => {
    if (selectedMediaIds.size === 0) {
      message.warning('Не выбрано файлов для удаления');
      return;
    }

    confirm({
      title: 'Удалить выбранные файлы?',
      icon: <ExclamationCircleOutlined />,
      content: `Вы уверены, что хотите удалить ${selectedMediaIds.size} файл(ов)?`,
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        const ids = Array.from(selectedMediaIds);
        const results = await Promise.allSettled(ids.map(id => mediaStore.deleteMedia(id)));
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const errorCount = results.filter(r => r.status === 'rejected').length;

        if (successCount > 0) message.success(`Удалено файлов: ${successCount}`);
        if (errorCount > 0) message.error(`Не удалось удалить файлов: ${errorCount}`);

        setSelectedMediaIds(new Set());
        void mediaStore.loadMediaList();
      },
    });
  }, [selectedMediaIds]);

  const handleFilterChange = useCallback(
    (filters: typeof mediaStore.filters) => void mediaStore.setFilters(filters),
    []
  );
  const handleFilterReset = useCallback(() => void mediaStore.resetFilters(), []);
  const handleBack = useCallback(() => navigate(PageUrl.Media), [navigate]);

  // Если открыт детальный просмотр
  if (detailsMediaId) {
    return (
      <div className="min-h-screen bg-background w-full">
        <div className="px-6 py-8 w-full">
          <MediaDetails
            mediaId={detailsMediaId}
            onBack={handleBack}
            onEdit={handleEditFromDetails}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Заголовок и хлебные крошки */}
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Медиа-библиотека</h1>
            <Space>
              {activeTab === 'list' && selectedMediaIds.size > 0 && (
                <Button danger icon={<DeleteOutlined />} onClick={handleBulkDelete}>
                  Удалить выбранные ({selectedMediaIds.size})
                </Button>
              )}
              {activeTab === 'list' && (
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => setActiveTab('upload')}
                >
                  Загрузить файлы
                </Button>
              )}
            </Space>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 w-full">
        <Tabs
          activeKey={activeTab}
          onChange={key => setActiveTab(key as 'list' | 'upload')}
          items={[
            {
              key: 'list',
              label: 'Список файлов',
              children: (
                <>
                  {/* Фильтры */}
                  <MediaFilters
                    filters={mediaStore.filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleFilterReset}
                  />

                  {/* Список медиафайлов */}
                  <MediaList
                    selectable
                    onSelect={handleSelect}
                    onSelectMultiple={handleSelectMultiple}
                    onClick={handleMediaClick}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                  />
                </>
              ),
            },
            {
              key: 'upload',
              label: 'Загрузка файлов',
              children: (
                <MediaUploader
                  multiple
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={handleUploadError}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
});
