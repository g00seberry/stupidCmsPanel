import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, Form, Input, Card, Typography, Spin, App, Descriptions } from 'antd';
import { Save, Trash2, Download, ArrowLeft, RotateCcw } from 'lucide-react';
import { MediaEditorStore } from './MediaEditorStore';
import { MediaPreview } from '@/components/MediaPreview';
import { downloadMedia } from '@/api/apiMedia';
import { onError } from '@/utils/onError';
import { PageUrl } from '@/PageUrl';
import { viewDate } from '@/utils/dateUtils';
import { formatFileSize } from '@/utils/formatters';

const { Title, Paragraph } = Typography;

/**
 * Страница редактирования метаданных медиа-файла.
 * Позволяет редактировать название, alt-текст и коллекцию файла.
 */
export const MediaEditorPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const store = useMemo(() => new MediaEditorStore(), []);
  const [form] = Form.useForm();
  const { modal } = App.useApp();

  // Загрузка медиа-файла
  useEffect(() => {
    if (id) {
      void store.loadMedia(id);
    }

    return () => {
      store.reset();
    };
  }, [id, store]);

  // Синхронизация формы с данными store
  useEffect(() => {
    if (store.media) {
      form.setFieldsValue({
        title: store.media.title || '',
        alt: store.media.alt || '',
        collection: store.media.collection || '',
      });
    }
  }, [store.media, form]);

  /**
   * Обрабатывает сохранение формы.
   */
  const handleSave = async () => {
    if (!id) return;

    try {
      const values = await form.validateFields();
      await store.updateMedia(id, {
        title: values.title || undefined,
        alt: values.alt || undefined,
        collection: values.collection || undefined,
      });
    } catch (error) {
      onError(error);
    }
  };

  /**
   * Обрабатывает удаление медиа-файла.
   */
  const handleDelete = () => {
    if (!id || !store.media) return;

    modal.confirm({
      title: 'Удалить файл?',
      content: `Вы уверены, что хотите удалить "${store.media.title || store.media.name}"? Файл можно будет восстановить из корзины.`,
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await store.deleteMedia(id);
        } catch (error) {
          onError(error);
        }
      },
    });
  };

  /**
   * Обрабатывает восстановление медиа-файла из корзины.
   */
  const handleRestore = () => {
    if (!id || !store.media) return;

    modal.confirm({
      title: 'Восстановить файл?',
      content: `Вы уверены, что хотите восстановить "${store.media.title || store.media.name}" из корзины?`,
      okText: 'Восстановить',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await store.restoreMedia(id);
        } catch (error) {
          onError(error);
        }
      },
    });
  };

  /**
   * Обрабатывает скачивание медиа-файла.
   */
  const handleDownload = async () => {
    if (!store.media) return;
    try {
      await downloadMedia(store.media.id, store.media.name);
    } catch (error) {
      onError(error);
    }
  };

  if (store.pending || !store.media) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const media = store.media;

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Шапка */}
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Button
                type="text"
                icon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate(PageUrl.Media)}
              >
                Назад
              </Button>
              <span>/</span>
              <span className="text-foreground font-medium truncate max-w-md">
                {media.title || media.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button icon={<Download className="w-4 h-4" />} onClick={handleDownload}>
                Скачать
              </Button>
              {media.deleted_at ? (
                <Button
                  icon={<RotateCcw className="w-4 h-4" />}
                  onClick={handleRestore}
                  disabled={store.saving}
                >
                  Восстановить из корзины
                </Button>
              ) : (
                <Button
                  danger
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={handleDelete}
                  disabled={store.saving}
                >
                  Удалить
                </Button>
              )}
              <Button
                type="primary"
                icon={<Save className="w-4 h-4" />}
                onClick={handleSave}
                loading={store.saving}
                disabled={!!media.deleted_at}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Левая колонка: Превью */}
          <div>
            <Card className="mb-6">
              <div className="flex items-center justify-center">
                <MediaPreview media={media} size="large" className="w-full max-w-md" />
              </div>
            </Card>

            {/* Информация о файле */}
            <Card title="Информация о файле">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Имя файла">{media.name}</Descriptions.Item>
                <Descriptions.Item label="Расширение">{media.ext}</Descriptions.Item>
                <Descriptions.Item label="Тип файла">{media.mime}</Descriptions.Item>
                <Descriptions.Item label="Категория">{media.kind}</Descriptions.Item>
                <Descriptions.Item label="Размер">
                  {formatFileSize(media.size_bytes)}
                </Descriptions.Item>
                {media.width && media.height && (
                  <Descriptions.Item label="Размеры">
                    {media.width} × {media.height} px
                  </Descriptions.Item>
                )}
                {media.duration_ms && (
                  <Descriptions.Item label="Длительность">
                    {Math.round(media.duration_ms / 1000)} сек
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Загружено">
                  {viewDate(media.created_at)?.format('DD.MM.YYYY HH:mm') || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Обновлено">
                  {viewDate(media.updated_at)?.format('DD.MM.YYYY HH:mm') || '-'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>

          {/* Правая колонка: Форма редактирования */}
          <div>
            <Card title="Метаданные">
              <Form form={form} layout="vertical">
                <Form.Item
                  label="Название"
                  name="title"
                  help="Отображаемое название файла для пользователей"
                >
                  <Input placeholder="Введите название" />
                </Form.Item>

                <Form.Item
                  label="Альтернативный текст"
                  name="alt"
                  help="Описание изображения для доступности и SEO"
                >
                  <Input.TextArea
                    placeholder="Введите описание изображения"
                    rows={3}
                    disabled={media.kind !== 'image'}
                  />
                </Form.Item>

                <Form.Item
                  label="Коллекция"
                  name="collection"
                  help="Группировка файлов по категориям или проектам"
                >
                  <Input placeholder="Введите название коллекции" />
                </Form.Item>
              </Form>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
});

