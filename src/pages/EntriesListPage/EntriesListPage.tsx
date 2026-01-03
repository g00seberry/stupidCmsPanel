import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, Input, Select, Typography, Tag } from 'antd';
import { Plus, Search } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { EntriesListStore } from './EntriesListStore';
import { getPostType } from '@/api/apiPostTypes';
import { onError } from '@/utils/onError';
import type { ZPostType } from '@/types/postTypes';
import { buildUrl, PageUrl } from '@/PageUrl';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { ZEntry } from '@/types/entries';
import { PaginatedTable } from '@/components/PaginatedTable';
import { FilterForm, FilterFormStore } from '@/components/FilterForm';
import { viewDate } from '@/utils/dateUtils';
import type { ZId } from '@/types/ZId';

type FilterValues = {
  q: string;
  status: string;
};
const { Title, Paragraph } = Typography;

/**
 * Страница со списком записей конкретного типа контента CMS.
 */
export const EntriesListPage = observer(() => {
  const { postTypeId } = useParams<{ postTypeId?: ZId }>();
  const navigate = useNavigate();
  const store = useMemo(() => new EntriesListStore(), []);
  const filterStore = useMemo(
    () => new FilterFormStore<FilterValues>({ q: '', status: 'all' }),
    []
  );
  const [postType, setPostType] = useState<ZPostType | null>(null);
  const [loadingPostType, setLoadingPostType] = useState(false);

  // Загрузка информации о типе контента
  useEffect(() => {
    if (postTypeId) {
      setLoadingPostType(true);
      getPostType(postTypeId)
        .then(setPostType)
        .catch(onError)
        .finally(() => setLoadingPostType(false));
    }
  }, [postTypeId]);

  // Инициализация загрузки данных
  useEffect(() => {
    if (postTypeId) {
      void store.initialize(postTypeId);
    }
  }, [postTypeId, store]);

  // Реакция на изменение фильтров
  useEffect(() => {
    if (postTypeId) {
      const values = filterStore.values;
      const status = (values.status as string) || 'all';
      const q = values.q as string | undefined;
      void store.setFilters({ status: status as any, q }, postTypeId);
      // Сбрасываем страницу на первую при изменении фильтров
      void store.goToPage(1, postTypeId);
    }
  }, [filterStore.values, postTypeId, store]);

  /**
   * Маппинг статусов на отображаемые названия и цвета.
   */
  const statusMap: Record<string, { text: string; color: string }> = {
    draft: { text: 'Черновик', color: 'default' },
    published: { text: 'Опубликовано', color: 'success' },
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
            placeholder="Поиск по названию "
            prefix={<Search className="w-4 h-4 text-muted-foreground" />}
            allowClear
          />
        ),
        className: 'flex-1 min-w-[200px]',
      },
      {
        name: 'status',
        element: (
          <Select
            style={{ width: 180 }}
            options={[
              { label: 'Все статусы', value: 'all' },
              ...store.statuses.map(status => ({
                label: statusMap[status]?.text || status,
                value: status,
              })),
            ]}
          />
        ),
        formItemProps: { initialValue: 'all' },
      },
    ],
    [store.statuses, statusMap]
  );

  /**
   * Колонки таблицы записей.
   */
  const columns: ColumnsType<ZEntry> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
      },
      {
        title: 'Заголовок',
        dataIndex: 'title',
        key: 'title',
        ellipsis: true,
        render: (text: string, record: ZEntry) => (
          <Button
            type="link"
            onClick={() => {
              if (postTypeId) {
                navigate(
                  buildUrl(PageUrl.EntryEdit, { postTypeId: postTypeId, id: String(record.id) })
                );
              }
            }}
          >
            {text}
          </Button>
        ),
      },

      {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        render: (status: string) => {
          const statusInfo = statusMap[status] || { text: status, color: 'default' };
          return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
        },
      },
      {
        title: 'Дата публикации',
        dataIndex: 'published_at',
        key: 'published_at',
        width: 180,
        render: (date: string | null) => {
          const dayjsDate = viewDate(date);
          return dayjsDate ? dayjsDate.format('DD.MM.YYYY HH:mm') : '-';
        },
      },
      {
        title: 'Обновлено',
        dataIndex: 'updated_at',
        key: 'updated_at',
        width: 180,
        render: (date: string | undefined) => {
          const dayjsDate = viewDate(date ?? null);
          return dayjsDate ? dayjsDate.format('DD.MM.YYYY HH:mm') : '-';
        },
      },
    ],
    [statusMap, postTypeId, navigate]
  );

  const defaultValues: FilterValues = useMemo(() => ({ q: '', status: 'all' }), []);
  const pageTitle = postType ? `Записи: ${postType.name}` : 'Записи';
  const pageDescription = postType
    ? `Список записей типа контента "${postType.name}"`
    : 'Список записей CMS';

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Типы контента', onClick: () => navigate(PageUrl.ContentTypes) },
        ...(postType
          ? [
              {
                label: postType.name,
                onClick: () => navigate(buildUrl(PageUrl.ContentTypesEdit, { id: postType.id })),
              },
            ]
          : []),
        'Записи',
      ]}
      extra={
        postTypeId ? (
          <Button
            type="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              navigate(buildUrl(PageUrl.EntryEdit, { postTypeId, id: 'new' }));
            }}
          >
            Создать запись
          </Button>
        ) : undefined
      }
    >
      {/* Заголовок */}
      <div className="mb-6">
        <Title level={3} className="mb-2">
          {loadingPostType ? 'Загрузка...' : pageTitle}
        </Title>
        <Paragraph type="secondary" className="mb-0">
          {pageDescription}
        </Paragraph>
      </div>

      {/* Фильтры */}
      <FilterForm
        store={filterStore}
        fields={filterFields}
        defaultValues={defaultValues}
        cardClassName="mb-6"
      />

      {/* Таблица */}
      <PaginatedTable store={store.tableStore} columns={columns} emptyText="Записи отсутствуют" />
    </PageLayout>
  );
});
