import { FilterForm, type FilterFieldConfig } from '@/components/FilterForm';
import { PaginatedTable } from '@/components/PaginatedTable/PaginatedTable';
import type { BlueprintListStore } from '@/pages/BlueprintsPage/BlueprintListStore';
import { Input } from 'antd';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo } from 'react';
import { buildColumns } from './buildColumns';

type FilterValues = {
  search: string;
  sort_by: string;
  sort_dir: 'asc' | 'desc';
};

/**
 * Пропсы компонента списка Blueprint.
 */
export type PropsBlueprintList = {
  /** Store для управления состоянием списка Blueprint. */
  store: BlueprintListStore;
};

/**
 * Компонент таблицы со списком Blueprint.
 * Отображает таблицу с колонками: name, code, description, paths_count, embeds_count, post_types_count, created_at и действиями.
 */
export const BlueprintList: React.FC<PropsBlueprintList> = observer(({ store }) => {
  const columns = useMemo(
    () =>
      buildColumns({
        onDelete: (id: number) => {
          void store.deleteBlueprint(id);
        },
      }),
    [store]
  );

  /**
   * Обрабатывает применение фильтров.
   */
  const applyFilters = useCallback(
    (filters: Record<string, unknown>) => {
      const search = (filters.search as string) || undefined;
      const sortBy = (filters.sort_by as string) || 'created_at';
      const sortDir = (filters.sort_dir as 'asc' | 'desc') || 'desc';

      // Разделяем фильтры и параметры пагинации/сортировки
      if (search !== undefined) {
        void store.loader.setFilters({ search });
      }
      void store.loader.setPagination({ sort_by: sortBy, sort_dir: sortDir });
    },
    [store]
  );

  /**
   * Отслеживание изменений фильтров и применение их к загрузчику.
   */
  useEffect(() => {
    applyFilters(store.filterStore.values);
  }, [store.filterStore.values]);

  const filterFields: FilterFieldConfig[] = useMemo(
    () => [
      {
        name: 'search',
        element: <Input.Search placeholder="Поиск по названию или коду..." allowClear />,
        className: 'flex-1 min-w-[200px]',
      },
    ],
    []
  );

  const defaultValues: FilterValues = useMemo(
    () => ({ search: '', sort_by: 'created_at', sort_dir: 'desc' }),
    []
  );

  return (
    <div className="space-y-4">
      <FilterForm store={store.filterStore} fields={filterFields} defaultValues={defaultValues} />

      <PaginatedTable
        loader={store.loader}
        columns={columns}
        rowKey="id"
        emptyText="Blueprint отсутствуют"
      />
    </div>
  );
});
