# PaginatedTable

Универсальный компонент таблицы с пагинацией.
Объединяет таблицу Ant Design, состояние загрузки, пустое состояние и пагинацию.
Работает с PaginatedDataLoader для управления данными.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | :--: | --- | --- |
| `columns` | `ColumnsType<TData>` | ✓ | `` | Колонки таблицы. |
| `emptyText` | `string \| undefined` |  | `` | Текст для пустого состояния. По умолчанию: 'Данные отсутствуют'. |
| `loader` | `PaginatedDataLoader<TData, TParams>` | ✓ | `` | Загрузчик пагинированных данных. |
| `onPageChange` | `((page: number) => void) \| undefined` |  | `` | Опциональный обработчик изменения страницы пагинации. Если не передан, используется loader.goToPage(). |
| `paginationProps` | `{ showSizeChanger?: boolean \| undefined; showTotal?: boolean \| ((total: number, range: [number, number]) => string) \| undefined; } \| undefined` |  | `` | Дополнительные пропсы для компонента пагинации. |
| `rowKey` | `string \| ((record: TData) => string) \| undefined` |  | `` | Ключ для строк таблицы. По умолчанию: 'id'. |
| `tableProps` | `Omit<TableProps<TData>, "columns" \| "rowKey" \| "dataSource" \| "loading" \| "pagination"> \| undefined` |  | `` | Дополнительные пропсы для таблицы Ant Design. |

**Source:** `C:/Users/dattebayo/Desktop/proj/stupidCmsPanel/src/components/PaginatedTable/PaginatedTable.tsx`
