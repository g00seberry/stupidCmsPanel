import { SlugInput } from '@/components/SlugInput';
import { buildUrl, PageUrl } from '@/PageUrl';
import { App, Button, Card, Empty, Form, Input, Spin, TreeSelect } from 'antd';
import { Check, Trash2, Info } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TermEditorStore, type FormValues } from './TermEditorStore';
import axios from 'axios';
import { getTaxonomy } from '@/api/apiTaxonomies';
import type { ZTaxonomy } from '@/types/taxonomies';
import { getTermsTree } from '@/api/apiTerms';
import type { ZTermTree } from '@/types/terms';

/**
 * Тип узла для TreeSelect.
 */
type TreeSelectNode = {
  value: number;
  title: string;
  children?: TreeSelectNode[];
};

/**
 * Преобразует дерево терминов в формат для TreeSelect.
 * @param tree Дерево терминов.
 * @param excludeTermId ID термина для исключения (вместе с его потомками).
 * @returns Массив узлов для TreeSelect.
 */
const convertTermsTreeToSelectData = (
  tree: ZTermTree[],
  excludeTermId?: number
): TreeSelectNode[] => {
  const convertNode = (node: ZTermTree): TreeSelectNode | null => {
    // Исключаем текущий термин и его потомков
    if (excludeTermId && node.id === excludeTermId) {
      return null;
    }

    const children =
      node.children
        ?.map(convertNode)
        .filter((child): child is NonNullable<typeof child> => child !== null) ?? [];

    return {
      value: node.id,
      title: node.name,
      ...(children.length > 0 ? { children } : {}),
    };
  };

  return tree.map(convertNode).filter((node): node is NonNullable<typeof node> => node !== null);
};

/**
 * Форма создания и редактирования термина таксономии CMS.
 */
export const TermEditorPage = observer(() => {
  const { taxonomy: taxonomySlug, id: termIdParam } = useParams<{ taxonomy: string; id: string }>();
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const isEditMode = termIdParam !== 'new' && termIdParam !== undefined;
  const termId = isEditMode ? Number.parseInt(termIdParam, 10) : undefined;
  const store = useMemo(() => new TermEditorStore(), [termIdParam]);
  const nameValue = Form.useWatch('name', form);
  const [taxonomy, setTaxonomy] = useState<ZTaxonomy | null>(null);
  const [loadingTaxonomy, setLoadingTaxonomy] = useState(false);
  const [termsTree, setTermsTree] = useState<ZTermTree[]>([]);
  const [loadingTermsTree, setLoadingTermsTree] = useState(false);

  // Загрузка информации о таксономии
  useEffect(() => {
    if (!taxonomySlug) return;

    setLoadingTaxonomy(true);
    getTaxonomy(taxonomySlug)
      .then(setTaxonomy)
      .catch(() => {})
      .finally(() => setLoadingTaxonomy(false));
  }, [taxonomySlug]);

  // Загрузка дерева терминов для выбора родителя (только для иерархических таксономий)
  useEffect(() => {
    if (!taxonomySlug || !taxonomy?.hierarchical) {
      setTermsTree([]);
      return;
    }

    setLoadingTermsTree(true);
    getTermsTree(taxonomySlug)
      .then(setTermsTree)
      .catch(() => {})
      .finally(() => setLoadingTermsTree(false));
  }, [taxonomySlug, taxonomy?.hierarchical]);

  // Синхронизация формы со стором при изменении данных в сторе
  useEffect(() => {
    form.setFieldsValue(store.formValues);
  }, [form, store.formValues]);

  // Загрузка данных при изменении termId в режиме редактирования
  useEffect(() => {
    if (termId && isEditMode) {
      void store.loadTerm(termId);
    }
  }, [termId, isEditMode, store]);

  /**
   * Сохраняет изменения формы.
   * @param values Текущие значения формы АнтД.
   */
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      if (!taxonomySlug) return;

      const nextTerm = await store.saveTerm(values, taxonomySlug, isEditMode, termId);
      if (nextTerm) {
        // Форма автоматически обновится через первый useEffect при изменении store.formValues
        navigate(buildUrl(PageUrl.TermEdit, { taxonomy: taxonomySlug, id: String(nextTerm.id) }), {
          replace: false,
        });
      }
    },
    [isEditMode, navigate, taxonomySlug, store, termId]
  );

  const handleCancel = useCallback(() => {
    if (taxonomySlug) {
      navigate(buildUrl(PageUrl.TermsByTaxonomy, { taxonomy: taxonomySlug }));
    }
  }, [navigate, taxonomySlug]);

  /**
   * Обрабатывает удаление термина с подтверждением и обработкой ошибок.
   */
  const handleDelete = useCallback(async () => {
    if (!termId || !isEditMode) {
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
          const success = await store.deleteTerm(termId, false);
          if (success && taxonomySlug) {
            navigate(buildUrl(PageUrl.TermsByTaxonomy, { taxonomy: taxonomySlug }));
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
                const forceSuccess = await store.deleteTerm(termId, true);
                if (forceSuccess && taxonomySlug) {
                  navigate(buildUrl(PageUrl.TermsByTaxonomy, { taxonomy: taxonomySlug }));
                }
              },
            });
          }
        }
      },
    });
  }, [termId, isEditMode, navigate, store, modal, taxonomySlug]);

  if (!taxonomySlug) {
    return (
      <div className="min-h-screen bg-background w-full flex items-center justify-center">
        <Empty description="Таксономия не указана" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Breadcrumbs and action buttons */}
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className="hover:text-foreground cursor-pointer transition-colors"
                onClick={() => navigate(PageUrl.Taxonomies)}
              >
                Таксономии
              </span>
              <span>/</span>
              {loadingTaxonomy ? (
                <Spin size="small" />
              ) : (
                <span
                  className="hover:text-foreground cursor-pointer transition-colors"
                  onClick={() =>
                    navigate(buildUrl(PageUrl.TermsByTaxonomy, { taxonomy: taxonomySlug }))
                  }
                >
                  {taxonomy?.label || taxonomySlug}
                </span>
              )}
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
                        <Input placeholder="Например, Guides" className="text-lg" />
                      </Form.Item>
                      <p className="text-sm text-muted-foreground">
                        Название термина, отображаемое в интерфейсе
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
                          placeholder="guides"
                          disabled={store.initialLoading || store.pending}
                        />
                      </Form.Item>
                      <p className="text-sm text-muted-foreground flex items-start gap-1">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Уникальный идентификатор термина в URL</span>
                      </p>
                    </div>

                    {/* Parent Term (only for hierarchical taxonomies) */}
                    {taxonomy?.hierarchical && (
                      <div className="space-y-2">
                        <Form.Item label="Родительский термин" name="parent_id" className="mb-0">
                          <TreeSelect
                            placeholder="Выберите родительский термин (необязательно)"
                            allowClear
                            treeDefaultExpandAll
                            treeData={convertTermsTreeToSelectData(termsTree, termId)}
                            disabled={store.initialLoading || store.pending || loadingTermsTree}
                            notFoundContent={
                              loadingTermsTree ? <Spin size="small" /> : 'Термины не найдены'
                            }
                            showSearch
                            treeNodeFilterProp="title"
                          />
                        </Form.Item>
                        <p className="text-sm text-muted-foreground flex items-start gap-1">
                          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>
                            Выберите родительский термин для создания иерархии. Оставьте пустым для
                            создания корневого термина.
                          </span>
                        </p>
                      </div>
                    )}
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
      </div>
    </div>
  );
});
