import { observer } from 'mobx-react-lite';
import { Button, Input, Pagination, Radio, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import type { ZBlueprintListItem } from '@/types/blueprint';
import { BlueprintStore } from '@/stores/BlueprintStore';
import { debounce } from '@/utils/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Пропсы компонента списка Blueprint.
 */
export type PropsBlueprintList = {
  /** Store для управления состоянием списка Blueprint. */
  store: BlueprintStore;
  /** Обработчик редактирования Blueprint. */
  onEdit?: (id: number) => void;
  /** Обработчик удаления Blueprint. */
  onDelete?: (id: number) => void;
  /** URL для редактирования Blueprint. Функция принимает id и возвращает URL. */
  editUrl?: (id: number) => string;
};

/**
 * Компонент таблицы со списком Blueprint.
 * Отображает таблицу с колонками: name, code, description, paths_count, embeds_count, post_types_count, created_at и действиями.
 */
export const BlueprintList: React.FC<PropsBlueprintList> = observer(
  ({ store, onEdit, onDelete, editUrl }) => {
    const columns: ColumnsType<ZBlueprintListItem> = useMemo(
      () => [
        {
          title: 'Название',
          dataIndex: 'name',
          key: 'name',
          sorter: true,
          render: (text: string, record: ZBlueprintListItem) => {
            if (editUrl) {
              return <Link to={editUrl(record.id)}>{text}</Link>;
            }
            return text;
          },
        },
        {
          title: 'Код',
          dataIndex: 'code',
          key: 'code',
          sorter: true,
          render: (code: string) => (
            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{code}</code>
          ),
        },
        {
          title: 'Описание',
          dataIndex: 'description',
          key: 'description',
          ellipsis: true,
          render: (description: string | null) =>
            description || <span className="text-muted-foreground">—</span>,
        },
        {
          title: 'Поля',
          dataIndex: 'paths_count',
          key: 'paths_count',
          width: 80,
          align: 'center',
          render: (count: number) => <Tag>{count}</Tag>,
        },
        {
          title: 'Встраивания',
          dataIndex: 'embeds_count',
          key: 'embeds_count',
          width: 120,
          align: 'center',
          render: (count: number) => <Tag color="blue">{count}</Tag>,
        },
        {
          title: 'Типы контента',
          dataIndex: 'post_types_count',
          key: 'post_types_count',
          width: 140,
          align: 'center',
          render: (count: number) => <Tag color="green">{count}</Tag>,
        },
        {
          title: 'Создан',
          dataIndex: 'created_at',
          key: 'created_at',
          sorter: true,
          width: 150,
          render: (date: string) => new Date(date).toLocaleDateString('ru-RU'),
        },
        {
          title: 'Действия',
          key: 'actions',
          width: 150,
          fixed: 'right',
          render: (_: unknown, record: ZBlueprintListItem) => (
            <Space size="small">
              {onEdit ? (
                <Button
                  type="link"
                  size="small"
                  icon={<Edit className="w-4 h-4" />}
                  onClick={() => onEdit(record.id)}
                >
                  Редактировать
                </Button>
              ) : editUrl ? (
                <Link to={editUrl(record.id)}>
                  <Button type="link" size="small" icon={<Edit className="w-4 h-4" />}>
                    Редактировать
                  </Button>
                </Link>
              ) : null}
              {onDelete && (
                <Button
                  type="link"
                  danger
                  size="small"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => onDelete(record.id)}
                >
                  Удалить
                </Button>
              )}
            </Space>
          ),
        },
      ],
      [onEdit, onDelete, editUrl]
    );

    const [searchValue, setSearchValue] = useState(store.search);

    const debouncedSearch = useMemo(
      () =>
        debounce((value: string) => {
          store.setSearch(value);
          void store.loadBlueprints();
        }),
      [store]
    );

    useEffect(() => {
      if (searchValue !== store.search) {
        void debouncedSearch(300, searchValue);
      }
    }, [searchValue, store, debouncedSearch]);

    const handleSortChange = useCallback(
      (sortBy: string) => {
        const newSortDir = store.sortBy === sortBy && store.sortDir === 'asc' ? 'desc' : 'asc';
        store.setSort(sortBy, newSortDir);
        void store.loadBlueprints();
      },
      [store]
    );

    const handleSortDirChange = useCallback(
      (sortDir: 'asc' | 'desc') => {
        store.setSort(store.sortBy, sortDir);
        void store.loadBlueprints();
      },
      [store]
    );

    const handlePageChange = useCallback(
      (page: number) => {
        void store.goToPage(page);
      },
      [store]
    );

    return (
      <div className="space-y-4">
        <div className="flex gap-4 items-center flex-wrap">
          <Input.Search
            placeholder="Поиск по названию или коду..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />
          <Select value={store.sortBy} onChange={handleSortChange} style={{ width: 150 }}>
            <Select.Option value="name">Название</Select.Option>
            <Select.Option value="code">Код</Select.Option>
            <Select.Option value="created_at">Дата создания</Select.Option>
          </Select>
          <Radio.Group
            value={store.sortDir}
            onChange={e => handleSortDirChange(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="asc">По возрастанию</Radio.Button>
            <Radio.Button value="desc">По убыванию</Radio.Button>
          </Radio.Group>
        </div>

        <Table
          columns={columns}
          dataSource={store.blueprints}
          rowKey="id"
          loading={store.pending}
          pagination={false}
          onChange={(_pagination, _filters, sorter) => {
            if (sorter && 'field' in sorter && sorter.field) {
              const field = sorter.field as string;
              const order = sorter.order === 'ascend' ? 'asc' : 'desc';
              if (store.sortBy !== field || store.sortDir !== order) {
                store.setSort(field, order);
                void store.loadBlueprints();
              }
            }
          }}
        />

        {store.pagination && (
          <div className="flex justify-end">
            <Pagination
              current={store.pagination.current_page}
              total={store.pagination.total}
              pageSize={store.pagination.per_page}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total, range) => `${range[0]}-${range[1]} из ${total}`}
            />
          </div>
        )}
      </div>
    );
  }
);
