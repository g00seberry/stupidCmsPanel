import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, Input, Select, Modal, Upload, Pagination, Typography, App } from 'antd';
import { Plus, Search, Trash2, RotateCcw, X } from 'lucide-react';
import { MediaListStore } from './MediaListStore';
import { MediaGrid } from '@/components/MediaGrid';
import { FilterForm, FilterFormStore } from '@/components/FilterForm';
import { uploadMedia } from '@/api/apiMedia';
import { onError } from '@/utils/onError';
import { buildUrl, PageUrl } from '@/PageUrl';
import type { UploadFile } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * Страница управления медиа-файлами CMS.
 * Отображает список медиа-файлов с фильтрацией, поиском и пагинацией.
 */
export const MediaPage = observer(() => {
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const store = useMemo(() => new MediaListStore(), []);
  const filterStore = useMemo(
    () =>
      new FilterFormStore({
        deleted: undefined,
        kind: undefined,
        collection: undefined,
        q: undefined,
      }),
    []
  );

  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectable, setSelectable] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Инициализация загрузки данных
  useEffect(() => {
    void store.initialize();
  }, [store]);

  // Реакция на изменение фильтров
  useEffect(() => {
    const values = filterStore.values;
    void store.setFilters({
      kind: values.kind as any,
      collection: values.collection as string | undefined,
      q: values.q as string | undefined,
      deleted: values.deleted as any,
      page: 1,
    });
  }, [filterStore.values, store]);

  /**
   * Конфигурация полей фильтрации.
   */
  const filterFields = useMemo(
    () => [
      {
        name: 'q',
        element: (
          <Input
            placeholder="Поиск по названию или имени файла"
            prefix={<Search className="w-4 h-4 text-muted-foreground" />}
            allowClear
          />
        ),
        className: 'flex-1 min-w-[200px]',
      },
      {
        name: 'kind',
        element: (
          <Select style={{ width: 150 }} placeholder="Все типы" allowClear>
            <Select.Option value="image">Изображения</Select.Option>
            <Select.Option value="video">Видео</Select.Option>
            <Select.Option value="audio">Аудио</Select.Option>
            <Select.Option value="document">Документы</Select.Option>
            <Select.Option value="other">Другое</Select.Option>
          </Select>
        ),
      },
      {
        name: 'collection',
        element: (
          <Input placeholder="Коллекция" style={{ width: 150 }} allowClear />
        ),
      },
      {
        name: 'deleted',
        element: (
          <Select style={{ width: 150 }} allowClear placeholder="Активные">
            <Select.Option value="with">Все</Select.Option>
            <Select.Option value="only">Удалённые</Select.Option>
          </Select>
        ),
      },
    ],
    []
  );

  /**
   * Обрабатывает загрузку файлов.
   */
  const handleUpload = async () => {
    if (fileList.length === 0) {
      return;
    }

    setUploading(true);

    try {
      // Загружаем файлы последовательно
      for (const file of fileList) {
        if (file.originFileObj) {
          await uploadMedia(file.originFileObj);
        }
      }

      // Закрываем модальное окно и перезагружаем список
      setUploadModalVisible(false);
      setFileList([]);
      await store.loadMedia();
    } catch (error) {
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Обрабатывает редактирование медиа-файла.
   */
  const handleEdit = (media: any) => {
    navigate(buildUrl(PageUrl.MediaEdit, { id: media.id }));
  };

  /**
   * Обрабатывает изменение страницы.
   */
  const handlePageChange = (page: number) => {
    void store.goToPage(page);
  };

  /**
   * Обрабатывает массовое удаление выбранных файлов.
   */
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    modal.confirm({
      title: 'Удалить выбранные файлы?',
      content: `Вы уверены, что хотите удалить ${selectedIds.length} файл(ов)? Файлы можно будет восстановить из корзины.`,
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await store.deleteMediaItem(selectedIds);
          setSelectedIds([]);
          setSelectable(false);
        } catch (error) {
          onError(error);
          throw error;
        }
      },
    });
  };

  /**
   * Обрабатывает массовое восстановление выбранных файлов.
   */
  const handleBulkRestore = () => {
    if (selectedIds.length === 0) return;

    modal.confirm({
      title: 'Восстановить выбранные файлы?',
      content: `Вы уверены, что хотите восстановить ${selectedIds.length} файл(ов)?`,
      okText: 'Восстановить',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await store.restoreMediaItem(selectedIds);
          setSelectedIds([]);
          setSelectable(false);
        } catch (error) {
          onError(error);
          throw error;
        }
      },
    });
  };

  /**
   * Обрабатывает массовое окончательное удаление выбранных файлов.
   */
  const handleBulkForceDelete = () => {
    if (selectedIds.length === 0) return;

    modal.confirm({
      title: 'Окончательно удалить выбранные файлы?',
      content: `Вы уверены, что хотите окончательно удалить ${selectedIds.length} файл(ов)? Это действие нельзя отменить. Файлы будут удалены навсегда.`,
      okText: 'Удалить навсегда',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await store.forceDeleteMediaItem(selectedIds);
          setSelectedIds([]);
          setSelectable(false);
        } catch (error) {
          onError(error);
          throw error;
        }
      },
    });
  };

  /**
   * Получает информацию о выбранных файлах для определения доступных операций.
   */
  const getSelectedMediaInfo = () => {
    const selectedMedia = store.media.filter(m => selectedIds.includes(m.id));
    const hasDeleted = selectedMedia.some(m => m.deleted_at);
    const hasActive = selectedMedia.some(m => !m.deleted_at);
    return { hasDeleted, hasActive, selectedMedia };
  };

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Шапка */}
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-foreground font-medium">Медиа</span>
            </div>
            <div className="flex items-center gap-3">
              {selectable ? (
                <>
                  <Button
                    onClick={() => {
                      setSelectable(false);
                      setSelectedIds([]);
                    }}
                    icon={<X className="w-4 h-4" />}
                  >
                    Отменить выбор
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Выбрано: {selectedIds.length}
                  </span>
                </>
              ) : (
                <>
                  <Button onClick={() => setSelectable(true)}>Выбрать файлы</Button>
                  <Button
                    type="primary"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => setUploadModalVisible(true)}
                  >
                    Загрузить файлы
                  </Button>
                </>
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
            Управление изображениями, видео, аудио и документами
          </Paragraph>
        </div>

        {/* Фильтры */}
        <FilterForm store={filterStore} fields={filterFields} cardClassName="mb-6" />

        {/* Панель массовых операций */}
        {selectable && selectedIds.length > 0 && (
          <div className="mb-6 p-4 bg-card border rounded-lg flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Выбрано файлов: {selectedIds.length}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {(() => {
                const { hasDeleted, hasActive } = getSelectedMediaInfo();
                return (
                  <>
                    {hasActive && (
                      <Button
                        danger
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={handleBulkDelete}
                      >
                        Удалить
                      </Button>
                    )}
                    {hasDeleted && (
                      <>
                        <Button
                          icon={<RotateCcw className="w-4 h-4" />}
                          onClick={handleBulkRestore}
                        >
                          Восстановить
                        </Button>
                        <Button
                          danger
                          icon={<Trash2 className="w-4 h-4" />}
                          onClick={handleBulkForceDelete}
                        >
                          Удалить навсегда
                        </Button>
                      </>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Сетка медиа-файлов */}
        <MediaGrid
          media={store.media}
          loading={store.pending}
          onEdit={handleEdit}
          onDelete={async id => {
            await store.deleteMediaItem([id]);
          }}
          onRestore={async id => {
            await store.restoreMediaItem([id]);
          }}
          emptyText="Медиа-файлы отсутствуют"
          selectable={selectable}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />

        {/* Пагинация */}
        {store.paginationMeta && store.paginationMeta.total > 0 && (
          <div className="flex justify-center mt-6">
            <Pagination
              current={store.paginationMeta.current_page}
              total={store.paginationMeta.total}
              pageSize={store.paginationMeta.per_page}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total, range) => `${range[0]}-${range[1]} из ${total}`}
            />
          </div>
        )}
      </div>

      {/* Модальное окно загрузки */}
      <Modal
        title="Загрузить файлы"
        open={uploadModalVisible}
        onOk={handleUpload}
        onCancel={() => {
          setUploadModalVisible(false);
          setFileList([]);
        }}
        confirmLoading={uploading}
        okText="Загрузить"
        cancelText="Отмена"
        width={600}
      >
        <Upload.Dragger
          multiple
          fileList={fileList}
          onChange={info => setFileList(info.fileList)}
          beforeUpload={() => false}
          className="mb-4"
        >
          <p className="text-lg mb-2">Нажмите или перетащите файлы</p>
          <p className="text-sm text-muted-foreground">
            Поддерживаются изображения, видео, аудио и документы
          </p>
        </Upload.Dragger>
      </Modal>
    </div>
  );
});

