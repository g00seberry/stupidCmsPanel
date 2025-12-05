import { TaxonomySelector } from '@/components/TaxonomySelector';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { buildUrl, PageUrl } from '@/PageUrl';
import { zProblemJson } from '@/types/ZProblemJson';
import { App, Button, Card, Form, Input, Select, Spin } from 'antd';
import axios from 'axios';
import { Check, Info, Trash2, Settings } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PostTypeEditorStore, type FormValues } from './PostTypeEditorStore';
import type { ZId } from '@/types/ZId';

/**
 * Форма создания и редактирования типа контента CMS.
 */
export const PostTypeEditorPage = observer(() => {
  const { id: postTypeId } = useParams<{ id?: ZId }>();
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const isEditMode = postTypeId !== 'new';
  const store = useMemo(() => new PostTypeEditorStore(), [postTypeId]);

  // Синхронизация формы со стором при изменении данных в сторе
  useEffect(() => {
    form.setFieldsValue(store.formValues);
  }, [form, store.formValues]);

  // Загрузка данных при изменении id в режиме редактирования
  useEffect(() => {
    if (postTypeId && isEditMode) {
      void store.loadPostType(postTypeId);
    } else {
      // Загружаем шаблоны при создании нового типа контента
      void store.loadTemplates();
    }
  }, [postTypeId, isEditMode, store]);

  /**
   * Сохраняет изменения формы.
   * @param values Текущие значения формы АнтД.
   */
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      const nextPostType = await store.savePostType(values, isEditMode, postTypeId);
      if (nextPostType) {
        // Форма автоматически обновится через первый useEffect при изменении store.formValues
        navigate(buildUrl(PageUrl.ContentTypesEdit, { id: nextPostType.id }), {
          replace: false,
        });
      }
    },
    [isEditMode, navigate, postTypeId, store]
  );

  const handleCancel = useCallback(() => {
    navigate(PageUrl.ContentTypes);
  }, [navigate]);

  /**
   * Обрабатывает удаление типа контента с подтверждением и обработкой ошибок.
   */
  const handleDelete = useCallback(async () => {
    if (!postTypeId || !isEditMode) {
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
          const success = await store.deletePostType(postTypeId, false);
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
                const forceSuccess = await store.deletePostType(postTypeId, true);
                if (forceSuccess) {
                  navigate(PageUrl.ContentTypes);
                }
              },
            });
          }
        }
      },
    });
  }, [postTypeId, isEditMode, navigate, store, modal]);

  return (
    <div className="bg-background w-full">
      <PageHeader
        breadcrumbs={[
          { label: 'Типы контента', onClick: () => navigate(PageUrl.ContentTypes) },
          isEditMode ? 'Редактирование' : 'Создание',
        ]}
        extra={
          <>
            {isEditMode && postTypeId && (
              <>
                <Link to={buildUrl(PageUrl.ContentTypesBlueprints, { id: postTypeId })}>
                  <Button icon={<Settings className="w-4 h-4" />}>Настроить Blueprints</Button>
                </Link>
                {store.currentPostType?.blueprint_id && (
                  <Link
                    to={buildUrl(PageUrl.ContentTypesFormConfig, {
                      id: postTypeId,
                      blueprintId: String(store.currentPostType.blueprint_id),
                    })}
                  >
                    <Button icon={<Settings className="w-4 h-4" />}>Настроить форму</Button>
                  </Link>
                )}
                <Button
                  danger
                  onClick={handleDelete}
                  loading={store.pending}
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Удалить
                </Button>
              </>
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
          </>
        }
      />

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

                    {/* Template */}
                    <div className="space-y-2">
                      <Form.Item label="Шаблон" name="template" className="mb-0">
                        <Select
                          placeholder="Выберите шаблон"
                          allowClear
                          showSearch
                          loading={store.initialLoading || store.pending}
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={store.templates.map(({ name }) => ({
                            value: name,
                            label: name,
                          }))}
                        />
                      </Form.Item>
                      <p className="text-sm text-muted-foreground flex items-start gap-1">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Имя шаблона Blade для этого типа контента. Опциональное поле.</span>
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Таксономии */}
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Таксономии</h2>
                  <Form.Item name="taxonomies" label="Таксономии">
                    <TaxonomySelector />
                  </Form.Item>
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
                    <p>
                      Вы можете ограничить список таксономий, доступных для этого типа контента.
                      Если ничего не выбрано, не будет доступно ни одной таксономии.
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
