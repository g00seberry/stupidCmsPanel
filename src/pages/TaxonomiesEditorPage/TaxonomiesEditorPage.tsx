import { buildUrl, PageUrl } from '@/PageUrl';
import { App, Button, Card, Form, Input, Spin, Switch } from 'antd';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TaxonomiesEditorStore, type FormValues } from './TaxonomiesEditorStore';
import axios from 'axios';
import { zProblemJson } from '@/types/ZProblemJson';
import { PageLayout } from '@/components/PageLayout';

/**
 * Форма создания и редактирования таксономии CMS.
 */
export const TaxonomiesEditorPage = observer(() => {
  const { id } = useParams<{ id?: string }>();
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const isEditMode = id !== 'new';
  const store = useMemo(() => new TaxonomiesEditorStore(), [id]);

  // Синхронизация формы со стором при изменении данных в сторе
  useEffect(() => {
    form.setFieldsValue(store.formValues);
  }, [form, store.formValues]);

  // Загрузка данных при изменении id в режиме редактирования
  useEffect(() => {
    if (id && isEditMode) {
      void store.loadTaxonomy(id);
    }
  }, [id, isEditMode, store]);

  /**
   * Сохраняет изменения формы.
   * @param values Текущие значения формы АнтД.
   */
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      const nextTaxonomy = await store.saveTaxonomy(values, isEditMode, id);
      if (nextTaxonomy) {
        // Форма автоматически обновится через первый useEffect при изменении store.formValues
        navigate(buildUrl(PageUrl.TaxonomiesEdit, { id: String(nextTaxonomy.id) }), {
          replace: false,
        });
      }
    },
    [isEditMode, navigate, id, store]
  );

  const handleCancel = useCallback(() => {
    navigate(PageUrl.Taxonomies);
  }, [navigate]);

  /**
   * Обрабатывает удаление таксономии с подтверждением и обработкой ошибок.
   */
  const handleDelete = useCallback(async () => {
    if (!id || !isEditMode) {
      return;
    }

    modal.confirm({
      title: 'Удалить таксономию?',
      content: 'Это действие нельзя отменить. Все данные таксономии будут удалены.',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          const success = await store.deleteTaxonomy(id, false);
          if (success) {
            navigate(PageUrl.Taxonomies);
          }
        } catch (error) {
          // Обработка ошибки 409 (CONFLICT) - таксономия содержит термины
          if (axios.isAxiosError(error) && error.response?.status === 409) {
            const problemResult = zProblemJson.safeParse(error.response?.data);
            const termsCount =
              problemResult.success && typeof problemResult.data.meta?.terms_count === 'number'
                ? problemResult.data.meta.terms_count
                : null;

            modal.confirm({
              title: 'Невозможно удалить таксономию',
              content: termsCount
                ? `Таксономия содержит ${termsCount} ${termsCount === 1 ? 'термин' : 'терминов'}. Вы можете удалить таксономию вместе со всеми терминами.`
                : 'Таксономия содержит термины. Вы можете удалить таксономию вместе со всеми терминами.',
              okText: 'Удалить всё',
              okType: 'danger',
              cancelText: 'Отмена',
              onOk: async () => {
                const forceSuccess = await store.deleteTaxonomy(id, true);
                if (forceSuccess) {
                  navigate(PageUrl.Taxonomies);
                }
              },
            });
          }
        }
      },
    });
  }, [id, isEditMode, navigate, store, modal]);

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Таксономии', onClick: () => navigate(PageUrl.Taxonomies) },
        isEditMode ? 'Редактирование' : 'Создание',
      ]}
      extra={
        <>
          {isEditMode && (
            <Button
              danger
              onClick={handleDelete}
              loading={store.pending}
              icon={<DeleteOutlined />}
            >
              Удалить
            </Button>
          )}
          <Button onClick={handleCancel}>Отмена</Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={store.pending}
            icon={<CheckOutlined />}
          >
            Сохранить
          </Button>
        </>
      }
    >
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
                  {/* Label */}
                  <div className="space-y-2">
                    <Form.Item
                      label="Название"
                      name="label"
                      rules={[
                        { required: true, message: 'Название обязательно.' },
                        { max: 255, message: 'Название не должно превышать 255 символов.' },
                      ]}
                      className="mb-0"
                    >
                      <Input placeholder="Например, Categories" className="text-lg" />
                    </Form.Item>
                    <p className="text-sm text-muted-foreground">
                      Название таксономии, отображаемое в интерфейсе
                    </p>
                  </div>

                  {/* Hierarchical */}
                  <div className="space-y-2">
                    <Form.Item
                      label="Иерархическая"
                      name="hierarchical"
                      valuePropName="checked"
                      className="mb-0"
                    >
                      <Switch />
                    </Form.Item>
                    <p className="text-sm text-muted-foreground">
                      Иерархические таксономии поддерживают вложенность терминов (например,
                      категории с подкатегориями)
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
                    Таксономия определяет способ категоризации контента в системе управления
                    контентом.
                  </p>
                  <p>
                    После создания таксономии вы сможете добавлять термины (например, категории или
                    теги) и привязывать их к записям.
                  </p>
                  <p>
                    Иерархические таксономии позволяют создавать вложенные структуры терминов,
                    например, категории с подкатегориями.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </Form>
      )}
    </PageLayout>
  );
});
