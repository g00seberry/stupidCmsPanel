import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Form, Input, Spin, Tag, Typography, Popconfirm } from 'antd';
import { Save, Trash2, RotateCcw } from 'lucide-react';
import { MediaEditorStore } from './MediaEditorStore';
import { PageUrl } from '@/PageUrl';
import { formatFileSize } from '@/utils/fileUtils';
import { viewDate } from '@/utils/dateUtils';
import { getKindTagColor, getKindLabel } from '@/utils/mediaUtils';
import { MediaPreview } from '@/components/MediaPreview';
import type { ZMediaImage, ZMediaVideo, ZMediaAudio } from '@/types/media';

const { Title } = Typography;

/**
 * Страница редактирования медиа-файла.
 * Обеспечивает редактирование метаданных, предпросмотр и управление медиа-файлом.
 */
export const MediaEditorPage = observer(() => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const store = useMemo(() => {
    if (!id) {
      return null;
    }
    return new MediaEditorStore(id);
  }, [id]);

  if (!store) {
    return null;
  }

  return <Inner store={store} navigate={navigate} />;
});

/**
 * Внутренний компонент страницы редактора.
 */
interface PropsInner {
  store: MediaEditorStore;
  navigate: ReturnType<typeof useNavigate>;
}

const Inner = observer(({ store, navigate }: PropsInner) => {
  const [form] = Form.useForm();

  // Синхронизация формы с данными стора
  useEffect(() => {
    if (store.media) {
      form.setFieldsValue({
        title: store.formData.title,
        alt: store.formData.alt,
        collection: store.formData.collection,
      });
    }
  }, [form, store.media, store.formData]);

  /**
   * Обрабатывает сохранение формы.
   */
  const handleSave = async () => {
    const values = await form.validateFields();
    store.updateFormField('title', values.title || '');
    store.updateFormField('alt', values.alt || '');
    store.updateFormField('collection', values.collection || '');

    const updatedMedia = await store.save();
    if (updatedMedia) {
      form.setFieldsValue({
        title: store.formData.title,
        alt: store.formData.alt,
        collection: store.formData.collection,
      });
    }
  };

  /**
   * Обрабатывает отмену редактирования.
   */
  const handleCancel = () => {
    navigate(PageUrl.Media);
  };

  /**
   * Обрабатывает удаление медиа-файла.
   */
  const handleDelete = async () => {
    const success = await store.delete();
    if (success) {
      // Обновляем форму после удаления
      form.setFieldsValue({
        title: store.formData.title,
        alt: store.formData.alt,
        collection: store.formData.collection,
      });
    }
  };

  /**
   * Обрабатывает восстановление медиа-файла.
   */
  const handleRestore = async () => {
    const restoredMedia = await store.restore();
    if (restoredMedia) {
      form.setFieldsValue({
        title: store.formData.title,
        alt: store.formData.alt,
        collection: store.formData.collection,
      });
    }
  };

  const media = store.media;
  const isDeleted = store.isDeleted;
  const displayTitle = media?.title || media?.name || 'Медиа-файл';

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Breadcrumbs and action buttons */}
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className="hover:text-foreground cursor-pointer transition-colors"
                onClick={handleCancel}
              >
                Медиа-файлы
              </span>
              <span>/</span>
              <span className="text-foreground font-medium">{displayTitle}</span>
            </div>
            <div className="flex items-center gap-3">
              {isDeleted && (
                <Button icon={<RotateCcw className="w-4 h-4" />} onClick={handleRestore}>
                  Восстановить
                </Button>
              )}
              {!isDeleted && (
                <Popconfirm
                  title="Удалить медиа-файл?"
                  description="Медиа-файл будет перемещен в корзину."
                  onConfirm={handleDelete}
                  okText="Удалить"
                  cancelText="Отмена"
                >
                  <Button danger icon={<Trash2 className="w-4 h-4" />}>
                    Удалить
                  </Button>
                </Popconfirm>
              )}
              <Button
                type="primary"
                icon={<Save className="w-4 h-4" />}
                onClick={handleSave}
                loading={store.saving}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 w-full">
        {store.pending ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : !media ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <Title level={4}>Медиа-файл не найден</Title>
              <Button onClick={handleCancel} className="mt-4">
                Вернуться к списку
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Основная форма */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <Title level={4} className="mb-6">
                  Метаданные
                </Title>

                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{
                    title: store.formData.title,
                    alt: store.formData.alt,
                    collection: store.formData.collection,
                  }}
                >
                  <Form.Item
                    label="Название"
                    name="title"
                    rules={[{ max: 255, message: 'Название не должно превышать 255 символов' }]}
                  >
                    <Input placeholder="Введите название медиа-файла" />
                  </Form.Item>

                  <Form.Item
                    label="Альтернативный текст"
                    name="alt"
                    rules={[
                      {
                        max: 255,
                        message: 'Альтернативный текст не должен превышать 255 символов',
                      },
                    ]}
                    help="Используется для изображений в качестве текста для скринридеров"
                  >
                    <Input placeholder="Введите альтернативный текст" />
                  </Form.Item>

                  <Form.Item
                    label="Коллекция"
                    name="collection"
                    rules={[{ max: 64, message: 'Коллекция не должна превышать 64 символов' }]}
                  >
                    <Input placeholder="Введите название коллекции" />
                  </Form.Item>
                </Form>
              </Card>

              {/* Информация о файле */}
              <Card>
                <Title level={4} className="mb-6">
                  Информация о файле
                </Title>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Имя файла:</span>
                    <span className="font-medium">{media.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Тип:</span>
                    <Tag color={getKindTagColor(media.kind)}>{getKindLabel(media.kind)}</Tag>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MIME-тип:</span>
                    <span className="font-medium">{media.mime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Размер:</span>
                    <span className="font-medium">{formatFileSize(media.size_bytes)}</span>
                  </div>
                  {media.kind === 'image' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Разрешение:</span>
                        <span className="font-medium">
                          {(media as ZMediaImage).width} × {(media as ZMediaImage).height} px
                        </span>
                      </div>
                    </>
                  )}
                  {media.kind === 'video' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Длительность:</span>
                        <span className="font-medium">
                          {Math.round((media as ZMediaVideo).duration_ms ?? 0 / 1000)} сек
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Битрейт:</span>
                        <span className="font-medium">
                          {(media as ZMediaVideo).bitrate_kbps ?? 0} kbps
                        </span>
                      </div>
                    </>
                  )}
                  {media.kind === 'audio' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Длительность:</span>
                        <span className="font-medium">
                          {Math.round((media as ZMediaAudio).duration_ms ?? 0 / 1000)} сек
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Битрейт:</span>
                        <span className="font-medium">
                          {(media as ZMediaAudio).bitrate_kbps ?? 0} kbps
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Создано:</span>
                    <span className="font-medium">
                      {viewDate(media.created_at)?.format('DD.MM.YYYY HH:mm') || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Обновлено:</span>
                    <span className="font-medium">
                      {viewDate(media.updated_at)?.format('DD.MM.YYYY HH:mm') || '-'}
                    </span>
                  </div>
                  {isDeleted && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Удалено:</span>
                      <span className="font-medium text-red-600">
                        {viewDate(media.deleted_at)?.format('DD.MM.YYYY HH:mm') || '-'}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Боковая панель с предпросмотром */}
            <div className="space-y-6">
              <Card>
                <Title level={4} className="mb-6">
                  Предпросмотр
                </Title>
                <MediaPreview media={media} imageVariant="medium" showOpenButton showInfo={false} />
              </Card>

              {isDeleted && (
                <Card className="border-red-500 bg-red-50">
                  <div className="text-center">
                    <Tag color="error" className="mb-2">
                      Удалено
                    </Tag>
                    <p className="text-sm text-muted-foreground">
                      Этот медиа-файл был удален. Вы можете восстановить его.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
