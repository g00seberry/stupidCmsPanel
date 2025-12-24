import { observer } from 'mobx-react-lite';
import { Card, Empty, Pagination, Spin, Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { PaginatedTableStore } from '@/components/PaginatedTable/PaginatedTableStore';

/**
 * Пропсы компонента пагинированной таблицы.
 * @template TData Тип элемента данных.
 * @template TFilters Тип фильтров запроса.
 */
export type PropsPaginatedTable<TData, TFilters extends {}> = {
  /** Стор пагинированной таблицы. */
  store: PaginatedTableStore<TData, TFilters>;
  /** Колонки таблицы. */
  columns: ColumnsType<TData>;
  /** Текст для пустого состояния. По умолчанию: 'Данные отсутствуют'. */
  emptyText?: string;
  /** Тип выбора строк. Если указан, включается выбор строк. */
  selectionType?: 'checkbox' | 'radio';
  /** Дополнительные пропсы для таблицы Ant Design. */
  tableProps?: Omit<
    TableProps<TData>,
    'dataSource' | 'columns' | 'loading' | 'pagination' | 'rowKey' | 'rowSelection'
  >;
};

/**
 * Универсальный компонент таблицы с пагинацией.
 * Объединяет таблицу Ant Design, состояние загрузки, пустое состояние и пагинацию.
 * Работает с PaginatedTableStore для управления данными и выбором строк.
 * @template TData Тип элемента данных.
 * @template TFilters Тип фильтров запроса.
 * @example
 * const loader = new PaginatedDataLoader(listEntries, { filters: {}, pagination: { page: 1, per_page: 15 } });
 * const store = new PaginatedTableStore(loader, 'id');
 * await store.loader.initialize();
 *
 * <PaginatedTable
 *   store={store}
 *   columns={columns}
 *   emptyText="Записи отсутствуют"
 * />
 */
export const PaginatedTable = observer(
  <TData, TFilters extends {}>({
    store,
    columns,
    emptyText = 'Данные отсутствуют',
    selectionType,
    tableProps,
  }: PropsPaginatedTable<TData, TFilters>) => {
    /**
     * Обработчик изменения страницы пагинации.
     */
    const handlePageChange = (page: number): void => {
      void store.loader.goToPage(page);
    };

    /**
     * Получает ключ строки из записи.
     */
    const getRecordKey = (record: TData): string | number => {
      if (typeof store.rowKey === 'string') {
        return (record as any)[store.rowKey];
      }
      return store.rowKey(record);
    };

    /**
     * Обработчик выбора/снятия выбора строки.
     */
    const handleSelect = (record: TData, selected: boolean): void => {
      const key = getRecordKey(record);
      if (selected) {
        store.selectRow(key);
      } else {
        store.deselectRow(key);
      }
    };

    /**
     * Обработчик выбора/снятия выбора всех строк на текущей странице.
     */
    const handleSelectAll = (selected: boolean): void => {
      if (selected) {
        store.selectAllOnCurrentPage();
      } else {
        store.deselectAllOnCurrentPage();
      }
    };

    if (store.loader.initialLoading) {
      return (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      );
    }

    if (store.loader.resp?.data.length === 0) {
      return (
        <Card>
          <Empty description={emptyText} />
        </Card>
      );
    }

    const paginationMeta = store.loader.resp?.meta;
    const hasPagination = paginationMeta && paginationMeta.last_page > 1;

    const defaultShowTotal = (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} из ${total} записей`;

    // Настройка rowSelection, если указан selectionType
    const rowSelection = selectionType
      ? {
          type: selectionType,
          selectedRowKeys: Array.from(store.selectedRowKeys),
          onSelect: handleSelect,
          onSelectAll: handleSelectAll,
          getCheckboxProps: () => ({}),
        }
      : undefined;

    return (
      <>
        <Card>
          <Table
            {...tableProps}
            columns={columns}
            dataSource={store.loader.resp?.data}
            rowKey={store.rowKey}
            loading={store.loader.pending}
            pagination={false}
            rowSelection={rowSelection}
          />
        </Card>
        {hasPagination && (
          <div className="mt-6 flex justify-center">
            <Pagination
              current={paginationMeta.current_page}
              total={paginationMeta.total}
              pageSize={paginationMeta.per_page}
              showTotal={defaultShowTotal}
              onChange={handlePageChange}
            />
          </div>
        )}
      </>
    );
  }
);
