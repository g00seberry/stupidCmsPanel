import { SlugInput } from '@/components/SlugInput';
import { buildUrl, PageUrl } from '@/PageUrl';
import { zProblemJson } from '@/types/ZProblemJson';
import { App, Button, Card, Form, Input, Spin } from 'antd';
import axios from 'axios';
import { Check, Info, Trash2 } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PostTypeEditorStore, type FormValues } from './PostTypeEditorStore';

/**
 * Форма создания и редактирования типа контента CMS.
 */
export const PostTypeEditorPage = observer(() => {
  const { slug } = useParams<{ slug?: string }>();
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const isEditMode = slug !== 'new' && slug !== undefined;
  const store = useMemo(() => new PostTypeEditorStore(), [slug]);
  const nameValue = Form.useWatch('name', form);

  // Синхронизация формы со стором при изменении данных в сторе
  useEffect(() => {
    form.setFieldsValue(store.formValues);
  }, [form, store.formValues]);

  // Загрузка данных при изменении slug в режиме редактирования
  useEffect(() => {
    if (slug && isEditMode) {
      void store.loadPostType(slug);
    }
  }, [slug, isEditMode, store]);

  /**
   * Сохраняет изменения формы.
   * @param values Текущие значения формы АнтД.
   */
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      const nextPostType = await store.savePostType(values, isEditMode, slug);
      if (nextPostType) {
        // Форма автоматически обновится через первый useEffect при изменении store.formValues
        navigate(buildUrl(PageUrl.ContentTypesEdit, { slug: nextPostType.slug }), {
          replace: false,
        });
      }
    },
    [isEditMode, navigate, slug, store]
  );

  const handleCancel = useCallback(() => {
    navigate(PageUrl.ContentTypes);
  }, [navigate]);

  /**
   * Обрабатывает удаление типа контента с подтверждением и обработкой ошибок.
   */
  const handleDelete = useCallback(async () => {
    if (!slug || !isEditMode) {
      return;
    }

    modal.confirm({
      title: 'Удалить тип контента?',
      content: 'Это действие нельзя отменить. Все данные типа контента будут удалены.',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          const success = await store.deletePostType(slug, false);
          if (success) {
            navigate(PageUrl.ContentTypes);
          }
        } catch (error) {
          // Обработка ошибки 409 (CONFLICT) - тип содержит записи
          if (axios.isAxiosError(error) && error.response?.status === 409) {
            const problemResult = zProblemJson.safeParse(error.response?.data);
            const entriesCount =
              problemResult.success && typeof problemResult.data.meta?.entries_count === 'number'
                ? problemResult.data.meta.entries_count
                : null;

            modal.confirm({
              title: 'Невозможно удалить тип контента',
              content: entriesCount
                ? `Тип контента содержит ${entriesCount} ${entriesCount === 1 ? 'запись' : 'записей'}. Вы можете удалить тип контента вместе со всеми записями.`
                : 'Тип контента содержит записи. Вы можете удалить тип контента вместе со всеми записями.',
              okText: 'Удалить всё',
              okType: 'danger',
              cancelText: 'Отмена',
              onOk: async () => {
                const forceSuccess = await store.deletePostType(slug, true);
                if (forceSuccess) {
                  navigate(PageUrl.ContentTypes);
                }
              },
            });
          }
        }
      },
    });
  }, [slug, isEditMode, navigate, store, modal]);

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Breadcrumbs and action buttons */}
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className="hover:text-foreground cursor-pointer transition-colors"
                onClick={() => navigate(PageUrl.ContentTypes)}
              >
                Типы контента
              </span>
              <span>/</span>
              <span className="text-foreground font-medium">
                {isEditMode ? 'Редактирование' : 'Создание'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {isEditMode && (
                <Button
                  danger
                  onClick={handleDelete}
                  loading={store.pending}
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Удалить
                </Button>
              )}
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
        {store.initialLoading ? (
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
                    {/* Name */}
                    <div className="space-y-2">
                      <Form.Item
                        label="Название"
                        name="name"
                        rules={[
                          { required: true, message: 'Название обязательно.' },
                          { max: 255, message: 'Название не должно превышать 255 символов.' },
                        ]}
                        className="mb-0"
                      >
                        <Input placeholder="Например, Articles" className="text-lg" />
                      </Form.Item>
                      <p className="text-sm text-muted-foreground">
                        Название типа контента, отображаемое в интерфейсе
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
                          from={nameValue ?? ''}
                          holdOnChange={isEditMode}
                          placeholder="article"
                          disabled={store.initialLoading || store.pending}
                        />
                      </Form.Item>
                      <p className="text-sm text-muted-foreground flex items-start gap-1">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Уникальный идентификатор типа контента в URL</span>
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24">
                  <h2 className="text-lg font-semibold mb-6">Информация</h2>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p>
                      Тип контента определяет структуру и поведение записей в системе управления
                      контентом.
                    </p>
                    <p>
                      После создания типа контента вы сможете добавлять записи этого типа и
                      настраивать их поля.
                    </p>
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
