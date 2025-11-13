import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { App, Button, Card, Empty, Spin, Tag, Input, Space } from 'antd';
import { Plus, Search, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { deleteTerm } from '@/api/apiTerms';
import type { ZTerm } from '@/types/terms';
import { onError } from '@/utils/onError';
import { buildUrl, PageUrl } from '@/PageUrl';
import { viewDate } from '@/utils/dateUtils';
import axios from 'axios';
import { notificationService } from '@/services/notificationService';
import type { ColumnsType } from 'antd/es/table';
import { PaginatedTable } from '@/components/PaginatedTable';
import { FilterForm, FilterFormStore } from '@/components/FilterForm';
import { TermsListStore } from './TermsListStore';

/**
 * Страница со списком терминов таксономии CMS.
 */
export const TermsPage = observer(() => {
  const { taxonomy: taxonomySlug } = useParams<{ taxonomy: string }>();
  const store = useMemo(() => new TermsListStore(), []);
  const filterStore = useMemo(() => new FilterFormStore({}), []);
  const { modal } = App.useApp();

  // Инициализация загрузки данных
  useEffect(() => {
    if (taxonomySlug) {
      void store.initialize(taxonomySlug);
    }
  }, [taxonomySlug, store]);

  // Реакция на изменение фильтров
  useEffect(() => {
    const values = filterStore.values;
    const q = values.q as string | undefined;
    void store.loader?.setFilters({ q, page: 1 });
  }, [filterStore.values]);

  /**
   * Обрабатывает удаление термина с подтверждением и обработкой ошибок.
   * @param term Термин для удаления.
   */
  const handleDelete = async (term: ZTerm): Promise<void> => {
    modal.confirm({
      title: 'Удалить термин?',
      content: `Вы уверены, что хотите удалить термин "${term.name}"? Это действие нельзя отменить.`,
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await deleteTerm(term.id, false);
          notificationService.showSuccess({ message: 'Термин удалён' });
          if (taxonomySlug) {
            void store.loader?.load();
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
                try {
                  await deleteTerm(term.id, true);
                  notificationService.showSuccess({
                    message: 'Термин удалён и отвязан от записей',
                  });
                  if (taxonomySlug) {
                    void store.loader?.load();
                  }
                } catch (forceError) {
                  onError(forceError);
                }
              },
            });
          } else {
            onError(error);
          }
        }
      },
    });
  };

  /**
   * Конфигурация полей фильтрации.
   */
  const filterFields = useMemo(
    () => [
      {
        name: 'q',
        element: (
          <Input
            placeholder="Поиск по названию или slug"
            prefix={<Search className="w-4 h-4 text-muted-foreground" />}
            allowClear
          />
        ),
        className: 'flex-1 min-w-[200px]',
      },
    ],
    []
  );

  /**
   * Колонки таблицы терминов.
   */
  const columns: ColumnsType<ZTerm> = useMemo(
    () => [
      {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, record: ZTerm) => (
          <div>
            <div className="font-medium text-foreground">{text}</div>
            <code className="text-xs text-muted-foreground">{record.slug}</code>
          </div>
        ),
      },
      {
        title: 'Обновлено',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (date: string | undefined) =>
          date ? viewDate(date)?.format('DD.MM.YYYY HH:mm') || '-' : '-',
      },
      {
        title: 'Действия',
        key: 'actions',
        render: (_: unknown, record: ZTerm) => (
          <Space>
            {taxonomySlug && (
              <Link
                to={buildUrl(PageUrl.TermEdit, { taxonomy: taxonomySlug, id: String(record.id) })}
              >
                <Button type="link" size="small" icon={<Edit className="w-4 h-4" />}>
                  Редактировать
                </Button>
              </Link>
            )}
            <Button
              type="link"
              danger
              size="small"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => {
                void handleDelete(record);
              }}
            >
              Удалить
            </Button>
          </Space>
        ),
      },
    ],
    [taxonomySlug]
  );

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
              <Link
                to={PageUrl.Taxonomies}
                className="hover:text-foreground cursor-pointer transition-colors"
              >
                Таксономии
              </Link>
              <span>/</span>
              {store.loadingTaxonomy ? (
                <Spin size="small" />
              ) : (
                <span className="text-foreground">{store.taxonomy?.label || taxonomySlug}</span>
              )}
              <span>/</span>
              <span className="text-foreground">Термины</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to={PageUrl.Taxonomies}>
                <Button icon={<ArrowLeft className="w-4 h-4" />}>Назад</Button>
              </Link>
              {taxonomySlug && (
                <Link to={buildUrl(PageUrl.TermEdit, { taxonomy: taxonomySlug, id: 'new' })}>
                  <Button type="primary" icon={<Plus className="w-4 h-4" />}>
                    Создать термин
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 w-full">
        {/* Информация о таксономии */}
        {store.taxonomy && (
          <div className="mb-6">
            <Card>
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{store.taxonomy.label}</h2>
                  <code className="text-sm text-muted-foreground">{store.taxonomy.slug}</code>
                </div>
                {store.taxonomy.hierarchical && <Tag color="blue">Иерархическая</Tag>}
              </div>
            </Card>
          </div>
        )}

        {/* Фильтры */}
        <FilterForm store={filterStore} fields={filterFields} cardClassName="mb-6" />

        {/* Таблица */}
        {store.loader && (
          <PaginatedTable
            loader={store.loader}
            columns={columns}
            rowKey="id"
            emptyText="Термины отсутствуют"
          />
        )}
      </div>
    </div>
  );
});
