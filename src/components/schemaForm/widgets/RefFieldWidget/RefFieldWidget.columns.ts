import type { ColumnsType } from 'antd/es/table';
import type { ZEntry } from '@/types/entries';

/**
 * Определение колонок таблицы для выбора записей.
 */
export const refFieldColumns: ColumnsType<ZEntry> = [
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
  },
] as const;
