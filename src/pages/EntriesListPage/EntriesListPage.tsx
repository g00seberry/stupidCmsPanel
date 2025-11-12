import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, Input, Select, Typography, Tag } from 'antd';
import { Plus, Search } from 'lucide-react';
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

const { Title, Paragraph } = Typography;

/**
 * Страница со списком записей конкретного типа контента CMS.
 */
export const EntriesListPage = observer(() => {
  const { postType: postTypeSlug } = useParams<{ postType?: string }>();
  const navigate = useNavigate();
  const store = useMemo(() => new EntriesListStore(), []);
  const filterStore = useMemo(() => new FilterFormStore({ status: 'all' }), []);
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

  // Инициализация загрузки данных
  useEffect(() => {
    if (postTypeSlug) {
      void store.initialize(postTypeSlug);
    }
  }, [postTypeSlug, store]);

  // Реакция на изменение фильтров
  useEffect(() => {
    if (postTypeSlug) {
      const values = filterStore.values;
      const status = (values.status as string) || 'all';
      const q = values.q as string | undefined;
      void store.setFilters({ status: status as any, q, page: 1 }, postTypeSlug);
    }
  }, [filterStore.values, postTypeSlug, store]);

  /**
   * Маппинг статусов на отображаемые названия и цвета.
   */
  const statusMap: Record<string, { text: string; color: string }> = {
    draft: { text: 'Черновик', color: 'default' },
    published: { text: 'Опубликовано', color: 'success' },
    scheduled: { text: 'Запланировано', color: 'processing' },
    trashed: { text: 'Удалено', color: 'error' },
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
      {
        name: 'status',
        element: (
          <Select style={{ width: 180 }}>
            <Select.Option value="all">Все статусы</Select.Option>
            {store.statuses.map(status => (
              <Select.Option key={status} value={status}>
                {statusMap[status]?.text || status}
              </Select.Option>
            ))}
          </Select>
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
              // TODO: Переход на страницу редактирования записи
              console.log('Edit entry:', record.id);
            }}
          >
            {text}
          </Button>
        ),
      },
      {
        title: 'Slug',
        dataIndex: 'slug',
        key: 'slug',
        ellipsis: true,
        render: (text: string) => (
          <code className="text-xs bg-muted px-2 py-1 rounded">{text}</code>
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
        render: (date: string | null) => (date ? new Date(date).toLocaleString('ru-RU') : '-'),
      },
      {
        title: 'Обновлено',
        dataIndex: 'updated_at',
        key: 'updated_at',
        width: 180,
        render: (date: string | undefined) => (date ? new Date(date).toLocaleString('ru-RU') : '-'),
      },
    ],
    [statusMap]
  );

  const pageTitle = postType ? `Записи: ${postType.name}` : 'Записи';
  const pageDescription = postType
    ? `Список записей типа контента "${postType.name}"`
    : 'Список записей CMS';

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
              {postType && (
                <>
                  <span>/</span>
                  <span
                    className="hover:text-foreground cursor-pointer transition-colors"
                    onClick={() =>
                      navigate(buildUrl(PageUrl.ContentTypesEdit, { slug: postType.slug }))
                    }
                  >
                    {postType.name}
                  </span>
                </>
              )}
              <span>/</span>
              <span className="text-foreground font-medium">Записи</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="primary"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => {
                  // TODO: Переход на страницу создания записи
                  console.log('Create new entry');
                }}
              >
                Создать запись
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 w-full">
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
          defaultValues={{ status: 'all' }}
          cardClassName="mb-6"
        />

        {/* Таблица */}
        <PaginatedTable
          loader={store.paginatedLoader}
          columns={columns}
          rowKey="id"
          emptyText="Записи отсутствуют"
        />
      </div>
    </div>
  );
});
