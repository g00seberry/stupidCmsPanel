import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, Input, Select, Modal, Upload, Pagination, Typography } from 'antd';
import { Plus, Search } from 'lucide-react';
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
              <Button
                type="primary"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setUploadModalVisible(true)}
              >
                Загрузить файлы
              </Button>
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

