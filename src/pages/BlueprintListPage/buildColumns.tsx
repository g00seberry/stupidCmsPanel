import { Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import type { ZBlueprintListItem } from '@/types/blueprint';
import { buildUrl, PageUrl } from '@/PageUrl';

/**
 * Строит конфигурацию колонок для таблицы списка Blueprint.
 * @returns Конфигурация колонок таблицы.
 * @example
 * const columns = buildColumns();
 */
export const buildColumns = (): ColumnsType<ZBlueprintListItem> => {

  return [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
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
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString('ru-RU'),
    },
  ];
};
