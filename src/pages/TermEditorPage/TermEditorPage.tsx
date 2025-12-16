import { buildUrl, PageUrl } from '@/PageUrl';
import { App, Button, Card, Empty, Form, Input, Spin } from 'antd';
import { Check, Trash2 } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TermEditorStore, type FormValues } from './TermEditorStore';
import axios from 'axios';
import { getTaxonomy } from '@/api/apiTaxonomies';
import type { ZTaxonomy } from '@/types/taxonomies';

import { onError } from '@/utils/onError';
import { PageLayout } from '@/components/PageLayout';

/**
 * Форма создания и редактирования термина таксономии CMS.
 */
export const TermEditorPage = observer(() => {
  const { taxonomyId, id } = useParams<{ taxonomyId: string; id: string }>();

  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const isEditMode = id !== 'new';

  const store = useMemo(() => new TermEditorStore(), [id]);
  const [taxonomy, setTaxonomy] = useState<ZTaxonomy | null>(null);
  const [loadingTaxonomy, setLoadingTaxonomy] = useState(false);

  // Загрузка информации о таксономии
  useEffect(() => {
    if (!taxonomyId) return;
    setLoadingTaxonomy(true);
    getTaxonomy(taxonomyId)
      .then(setTaxonomy)
      .catch(onError)
      .finally(() => setLoadingTaxonomy(false));
  }, [taxonomyId]);

  // Синхронизация формы со стором при изменении данных в сторе
  useEffect(() => {
    form.setFieldsValue(store.formValues);
  }, [form, store.formValues]);

  // Загрузка данных при изменении termId в режиме редактирования
  useEffect(() => {
    if (id && isEditMode) {
      void store.loadTerm(id);
    }
  }, [id, isEditMode, store]);

  /**
   * Сохраняет изменения формы.
   * @param values Текущие значения формы АнтД.
   */
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      if (!taxonomyId) return;

      const nextTerm = await store.saveTerm(values, taxonomyId, isEditMode, id);
      if (nextTerm) {
        // Форма автоматически обновится через первый useEffect при изменении store.formValues
        navigate(
          buildUrl(PageUrl.TermEdit, { taxonomyId: String(taxonomyId), id: String(nextTerm.id) }),
          {
            replace: false,
          }
        );
      }
    },
    [isEditMode, navigate, taxonomyId, store, id]
  );

  const handleCancel = useCallback(() => {
    if (taxonomyId) {
      navigate(buildUrl(PageUrl.TermsByTaxonomy, { taxonomyId: String(taxonomyId) }));
    }
  }, [navigate, taxonomyId]);

  /**
   * Обрабатывает удаление термина с подтверждением и обработкой ошибок.
   */
  const handleDelete = useCallback(async () => {
    if (!id || !isEditMode) {
      return;
    }

    modal.confirm({
      title: 'Удалить термин?',
      content: 'Это действие нельзя отменить. Все данные термина будут удалены.',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          const success = await store.deleteTerm(id, false);
          if (success && taxonomyId && !Number.isNaN(taxonomyId)) {
            navigate(buildUrl(PageUrl.TermsByTaxonomy, { taxonomyId: String(taxonomyId) }));
          }
        } catch (error) {
          // Обработка ошибки 409 (CONFLICT) - термин привязан к записям
          if (axios.isAxiosError(error) && error.response?.status === 409) {
            modal.confirm({
              title: 'Невозможно удалить термин',
              content:
                'Термин привязан к записям. Вы можете удалить термин с автоматической отвязкой от всех записей.',
              okText: 'Удалить и отвязать',
              okType: 'danger',
              cancelText: 'Отмена',
              onOk: async () => {
                const forceSuccess = await store.deleteTerm(id, true);
                if (forceSuccess && taxonomyId && !Number.isNaN(taxonomyId)) {
                  navigate(buildUrl(PageUrl.TermsByTaxonomy, { taxonomyId: String(taxonomyId) }));
                }
              },
            });
          }
        }
      },
    });
  }, [id, isEditMode, navigate, store, modal, taxonomyId]);

  if (!taxonomyId) {
    return (
      <div className="bg-background w-full flex items-center justify-center">
        <Empty description="Таксономия не указана" />
      </div>
    );
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Таксономии', onClick: () => navigate(PageUrl.Taxonomies) },
        ...(loadingTaxonomy
          ? ['Загрузка...']
          : taxonomyId && !Number.isNaN(taxonomyId) && taxonomy
            ? [
                {
                  label: taxonomy.label || taxonomyId || '',
                  onClick: () =>
                    navigate(buildUrl(PageUrl.TermsByTaxonomy, { taxonomyId: String(taxonomyId) })),
                },
              ]
            : []),
        isEditMode ? 'Редактирование' : 'Создание',
      ]}
      extra={
        <>
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
                      <Input placeholder="Например, Guides" className="text-lg" />
                    </Form.Item>
                    <p className="text-sm text-muted-foreground">
                      Название термина, отображаемое в интерфейсе
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
                    Термин представляет собой конкретное значение внутри таксономии (например,
                    "Guides" в таксономии "Categories").
                  </p>
                  <p>
                    После создания термина вы сможете привязывать его к записям для категоризации
                    контента.
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
