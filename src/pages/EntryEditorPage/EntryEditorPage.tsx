import { SlugInput } from '@/components/SlugInput';
import { buildUrl, PageUrl } from '@/PageUrl';
import { Button, Card, DatePicker, Form, Input, Switch, Spin } from 'antd';
import { Check, Info } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { EntryEditorStore, type FormValues } from './EntryEditorStore';
import { getPostType } from '@/api/apiPostTypes';
import { onError } from '@/utils/onError';
import type { ZPostType } from '@/types/postTypes';

const { TextArea } = Input;

/**
 * Страница создания и редактирования записи CMS.
 */
export const EntryEditorPage = observer(() => {
  const { postType: postTypeSlug, id } = useParams<{ postType?: string; id?: string }>();
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();
  const isEditMode = id !== 'new' && id !== undefined;
  const entryId = isEditMode ? Number.parseInt(id, 10) : undefined;
  const store = useMemo(() => new EntryEditorStore(), [id]);
  const titleValue = Form.useWatch('title', form);
  const [postType, setPostType] = useState<ZPostType | null>(null);
  const [loadingPostType, setLoadingPostType] = useState(false);

  // Загрузка информации о типе контента
  useEffect(() => {
    if (postTypeSlug) {
      setLoadingPostType(true);
      getPostType(postTypeSlug)
        .then(setPostType)
        .catch(onError)
        .finally(() => setLoadingPostType(false));
    }
  }, [postTypeSlug]);

  // Синхронизация формы со стором при изменении данных в сторе
  useEffect(() => {
    form.setFieldsValue(store.formValues);
  }, [form, store.formValues]);

  // Загрузка данных при изменении id в режиме редактирования
  useEffect(() => {
    if (entryId && isEditMode) {
      void store.loadEntry(entryId);
    }
  }, [entryId, isEditMode, store]);

  /**
   * Сохраняет изменения формы.
   * @param values Текущие значения формы АнтД.
   */
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      if (!postTypeSlug) {
        return;
      }
      const nextEntry = await store.saveEntry(values, isEditMode, entryId, postTypeSlug);
      if (nextEntry && isEditMode && entryId) {
        // При редактировании остаёмся на странице
        navigate(
          buildUrl(PageUrl.EntryEdit, { postType: postTypeSlug, id: String(nextEntry.id) }),
          { replace: false }
        );
      } else if (nextEntry && !isEditMode) {
        // При создании переходим на страницу редактирования
        navigate(
          buildUrl(PageUrl.EntryEdit, { postType: postTypeSlug, id: String(nextEntry.id) }),
          { replace: true }
        );
      }
    },
    [isEditMode, navigate, postTypeSlug, entryId, store]
  );

  const handleCancel = useCallback(() => {
    if (postTypeSlug) {
      navigate(buildUrl(PageUrl.EntriesByType, { postType: postTypeSlug }));
    } else {
      navigate(PageUrl.Entries);
    }
  }, [navigate, postTypeSlug]);

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Breadcrumbs and action buttons */}
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                to={PageUrl.ContentTypes}
                className="hover:text-foreground cursor-pointer transition-colors"
              >
                Типы контента
              </Link>
              {postType && (
                <>
                  <span>/</span>
                  <Link
                    to={buildUrl(PageUrl.EntriesByType, { postType: postType.slug })}
                    className="hover:text-foreground cursor-pointer transition-colors"
                  >
                    {postType.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-foreground font-medium">
                {isEditMode ? 'Редактирование' : 'Создание'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleCancel}>Отмена</Button>
              <Button
                type="primary"
                onClick={() => form.submit()}
                loading={store.pending}
                icon={<Check className="w-4 h-4" />}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 w-full">
        {store.initialLoading || loadingPostType ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Form<FormValues>
            form={form}
            layout="vertical"
            initialValues={store.formValues}
            onFinish={handleSubmit}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Основные настройки</h2>

                  <div className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <Form.Item
                        label="Заголовок"
                        name="title"
                        rules={[
                          { required: true, message: 'Заголовок обязателен.' },
                          { max: 255, message: 'Заголовок не должен превышать 255 символов.' },
                        ]}
                        className="mb-0"
                      >
                        <Input placeholder="Введите заголовок записи" className="text-lg" />
                      </Form.Item>
                      <p className="text-sm text-muted-foreground">
                        Заголовок записи, отображаемый в интерфейсе
                      </p>
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                      <Form.Item
                        label="Slug"
                        name="slug"
                        rules={[
                          { required: true, message: 'Slug обязателен.' },
                          {
                            pattern: /^[a-z0-9-]+$/,
                            message:
                              'Slug может содержать только строчные латинские буквы, цифры и дефис.',
                          },
                        ]}
                        className="mb-0"
                      >
                        <SlugInput
                          from={titleValue ?? ''}
                          holdOnChange={isEditMode}
                          placeholder="entry-slug"
                          disabled={store.initialLoading || store.pending}
                        />
                      </Form.Item>
                      <p className="text-sm text-muted-foreground flex items-start gap-1">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>URL-friendly идентификатор записи</span>
                      </p>
                    </div>

                    {/* Content JSON */}
                    <div className="space-y-2">
                      <Form.Item label="Содержимое (JSON)" name="content_json" className="mb-0">
                        <TextArea
                          rows={10}
                          placeholder='{"hero": {"title": "Заголовок"}, "body": {"blocks": []}}'
                          style={{ fontFamily: 'monospace' }}
                        />
                      </Form.Item>
                      <p className="text-sm text-muted-foreground">
                        Содержимое записи в формате JSON
                      </p>
                    </div>

                    {/* Meta JSON */}
                    <div className="space-y-2">
                      <Form.Item label="Метаданные (JSON)" name="meta_json" className="mb-0">
                        <TextArea
                          rows={6}
                          placeholder='{"title": "Мета заголовок", "description": "Мета описание"}'
                          style={{ fontFamily: 'monospace' }}
                        />
                      </Form.Item>
                      <p className="text-sm text-muted-foreground">
                        Метаданные записи в формате JSON (SEO и т.д.)
                      </p>
                    </div>

                    {/* Template Override */}
                    <div className="space-y-2">
                      <Form.Item
                        label="Переопределение шаблона"
                        name="template_override"
                        className="mb-0"
                      >
                        <Input placeholder="templates.landing" />
                      </Form.Item>
                      <p className="text-sm text-muted-foreground">
                        Имя шаблона для переопределения шаблона типа контента
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24">
                  <h2 className="text-lg font-semibold mb-6">Публикация</h2>
                  <div className="space-y-6">
                    {/* Is Published */}
                    <Form.Item
                      label="Опубликовано"
                      name="is_published"
                      valuePropName="checked"
                      className="mb-0"
                    >
                      <Switch />
                    </Form.Item>

                    {/* Published At */}
                    <Form.Item label="Дата публикации" name="published_at" className="mb-0">
                      <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        style={{ width: '100%' }}
                        placeholder="Выберите дату и время публикации"
                      />
                    </Form.Item>
                    <p className="text-sm text-muted-foreground">Дата и время публикации записи</p>
                  </div>
                </Card>
              </div>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
});
