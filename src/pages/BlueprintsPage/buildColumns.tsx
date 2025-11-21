import { Button, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ZBlueprintListItem } from '@/types/blueprint';
import { buildUrl, PageUrl } from '@/PageUrl';

/**
 * Параметры для построения колонок таблицы Blueprint.
 */
export type BuildColumnsParams = {
  /** Обработчик удаления Blueprint. */
  onDelete?: (id: number) => void;
};

/**
 * Строит конфигурацию колонок для таблицы списка Blueprint.
 * @param params Параметры для построения колонок.
 * @returns Конфигурация колонок таблицы.
 * @example
 * const columns = buildColumns({ onDelete: handleDelete, editUrl: id => `/blueprints/${id}` });
 */
export const buildColumns = (params: BuildColumnsParams): ColumnsType<ZBlueprintListItem> => {
  const { onDelete } = params;

  return [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text: string, record: ZBlueprintListItem) => {
        return (
          <Link to={buildUrl(PageUrl.BlueprintsEdit, { id: record.id })}>
            <Typography.Text>{text}</Typography.Text>
          </Link>
        );
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
        <Button
          type="link"
          danger
          size="small"
          icon={<Trash2 className="w-4 h-4" />}
          onClick={() => onDelete?.(record.id)}
        >
          Удалить
        </Button>
      ),
    },
  ];
};
