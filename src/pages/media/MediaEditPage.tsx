import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Spin,
  Empty,
  message,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { mediaStore } from '@/stores/mediaStore';
import { PageUrl, buildUrl } from '@/PageUrl';
import { MediaPreview } from '@/components/media/MediaPreview';
import type { ZMediaUpdatePayload } from '@/types/media';

/**
 * Страница редактирования медиафайла.
 * Отображает форму для редактирования метаданных медиафайла: title, alt, collection.
 * @example
 * // Использование через маршрутизацию
 * <Route path="/media/:id/edit" element={<MediaEditPage />} />
 */
export const MediaEditPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<ZMediaUpdatePayload>();
  const [loading, setLoading] = useState(false);
  const { currentMedia, currentMediaPending } = mediaStore;

  useEffect(() => {
    if (id) {
      void mediaStore.loadMedia(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentMedia) {
      form.setFieldsValue({
        title: currentMedia.title || '',
        alt: currentMedia.alt || '',
        collection: currentMedia.collection || '',
      });
    }
  }, [currentMedia, form]);

  const handleBack = useCallback(() => {
    if (id) {
      navigate(buildUrl(PageUrl.MediaDetails, { id }));
    } else {
      navigate(PageUrl.Media);
    }
  }, [navigate, id]);

  const handleSubmit = useCallback(
    async (values: ZMediaUpdatePayload) => {
      if (!id) return;

      setLoading(true);
      try {
        const payload: ZMediaUpdatePayload = {
          title: values.title?.trim() || null,
          alt: values.alt?.trim() || null,
          collection: values.collection?.trim() || null,
        };
        await mediaStore.updateMedia(id, payload);
        message.success('Медиафайл успешно обновлён');
        navigate(buildUrl(PageUrl.MediaDetails, { id }));
      } catch (error) {
        // Ошибка уже обработана в mediaStore.updateMedia через onError
      } finally {
        setLoading(false);
      }
    },
    [id, navigate]
  );

  if (currentMediaPending) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  if (!currentMedia) {
    return (
      <div className="min-h-screen bg-background w-full">
        <div className="px-6 py-8 w-full">
          <Card>
            <Empty description="Медиафайл не найден" />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="px-6 py-8 w-full">
        <div className="space-y-6">
          {/* Заголовок с кнопкой назад */}
          <div className="flex items-center justify-between">
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                Назад
              </Button>
              <h1 className="text-2xl font-semibold mb-0">Редактирование медиафайла</h1>
            </Space>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Превью медиафайла */}
            <div className="lg:col-span-2">
              <Card title="Превью">
                <MediaPreview media={currentMedia} variant="medium" zoomable />
              </Card>
            </div>

            {/* Форма редактирования */}
            <div>
              <Card title="Метаданные">
                <Form<ZMediaUpdatePayload>
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  disabled={loading}
                >
                  <Form.Item
                    label="Заголовок"
                    name="title"
                    rules={[
                      {
                        max: 255,
                        message: 'Заголовок не должен превышать 255 символов',
                      },
                    ]}
                  >
                    <Input placeholder="Введите заголовок" maxLength={255} />
                  </Form.Item>

                  <Form.Item
                    label="Альтернативный текст"
                    name="alt"
                    help="Альтернативный текст для изображений (SEO и доступность)"
                    rules={[
                      {
                        max: 255,
                        message: 'Альтернативный текст не должен превышать 255 символов',
                      },
                    ]}
                  >
                    <Input.TextArea
                      placeholder="Введите альтернативный текст"
                      rows={3}
                      maxLength={255}
                      showCount
                    />
                  </Form.Item>

                  <Form.Item
                    label="Коллекция"
                    name="collection"
                    help="Только латинские буквы, цифры, дефисы, точки и подчёркивания. Максимум 64 символа."
                    rules={[
                      {
                        max: 64,
                        message: 'Коллекция не должна превышать 64 символов',
                      },
                      {
                        pattern: /^[a-z0-9-_.]*$/i,
                        message:
                          'Коллекция может содержать только латинские буквы, цифры, дефисы, точки и подчёркивания',
                      },
                    ]}
                  >
                    <Input placeholder="Введите название коллекции" maxLength={64} />
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={loading}
                      >
                        Сохранить
                      </Button>
                      <Button onClick={handleBack} disabled={loading}>
                        Отмена
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

