import { observer } from 'mobx-react-lite';
import { Card, Empty, Pagination, Spin, Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { PaginatedDataLoader } from '@/components/PaginatedTable/paginatedDataLoader';

/**
 * Пропсы компонента пагинированной таблицы.
 * @template TData Тип элемента данных.
 * @template TFilters Тип фильтров запроса.
 */
export type PropsPaginatedTable<TData, TFilters extends {}> = {
  /** Загрузчик пагинированных данных. */
  loader: PaginatedDataLoader<TData, TFilters>;
  /** Колонки таблицы. */
  columns: ColumnsType<TData>;
  /** Опциональный обработчик изменения страницы пагинации. Если не передан, используется loader.goToPage(). */
  onPageChange?: (page: number) => void;
  /** Ключ для строк таблицы. По умолчанию: 'id'. */
  rowKey?: string | ((record: TData) => string);
  /** Текст для пустого состояния. По умолчанию: 'Данные отсутствуют'. */
  emptyText?: string;

  /** Дополнительные пропсы для таблицы Ant Design. */
  tableProps?: Omit<
    TableProps<TData>,
    'dataSource' | 'columns' | 'loading' | 'pagination' | 'rowKey'
  >;
  /** Дополнительные пропсы для компонента пагинации. */
  paginationProps?: {
    /** Показывать селектор размера страницы. По умолчанию: false. */
    showSizeChanger?: boolean;
    /** Показывать общее количество элементов. По умолчанию: true. */
    showTotal?: boolean | ((total: number, range: [number, number]) => string);
  };
};

/**
 * Универсальный компонент таблицы с пагинацией.
 * Объединяет таблицу Ant Design, состояние загрузки, пустое состояние и пагинацию.
 * Работает с PaginatedDataLoader для управления данными.
 * @template TData Тип элемента данных.
 * @template TFilters Тип фильтров запроса.
 * @example
 * const loader = new PaginatedDataLoader(listEntries, { filters: {}, pagination: { page: 1, per_page: 15 } });
 * await loader.initialize();
 *
 * <PaginatedTable
 *   loader={loader}
 *   columns={columns}
 *   rowKey="id"
 *   emptyText="Записи отсутствуют"
 * />
 */
export const PaginatedTable = observer(
  <TData, TFilters extends {}>({
    loader,
    columns,
    onPageChange,
    rowKey = 'id',
    emptyText = 'Данные отсутствуют',

    tableProps,
    paginationProps = {},
  }: PropsPaginatedTable<TData, TFilters>) => {
    const { showSizeChanger = false, showTotal = true } = paginationProps;

    /**
     * Обработчик изменения страницы пагинации.
     */
    const handlePageChange = (page: number): void => {
      void loader.goToPage(page);
      if (onPageChange) {
        onPageChange(page);
      }
    };

    if (loader.initialLoading) {
      return (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      );
    }

    if (loader.resp?.data.length === 0) {
      return (
        <Card>
          <Empty description={emptyText} />
        </Card>
      );
    }

    const paginationMeta = loader.resp?.meta;
    const hasPagination = paginationMeta && paginationMeta.last_page > 1;

    const defaultShowTotal = (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} из ${total} записей`;

    return (
      <>
        <Card>
          <Table
            {...tableProps}
            columns={columns}
            dataSource={loader.resp?.data}
            rowKey={rowKey}
            loading={loader.pending}
            pagination={false}
          />
        </Card>
        {hasPagination && (
          <div className="mt-6 flex justify-center">
            <Pagination
              current={paginationMeta.current_page}
              total={paginationMeta.total}
              pageSize={paginationMeta.per_page}
              showSizeChanger={showSizeChanger}
              showTotal={showTotal === true ? defaultShowTotal : showTotal || undefined}
              onChange={handlePageChange}
            />
          </div>
        )}
      </>
    );
  }
);
