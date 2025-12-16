import { FilterForm } from '@/components/FilterForm';
import { PaginatedTable } from '@/components/PaginatedTable/PaginatedTable';
import type { BlueprintListStore } from '@/pages/BlueprintListPage/BlueprintListStore';
import type { ZId } from '@/types/ZId';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { buildColumns } from './buildColumns';
import { getBlueprintFilterFields } from './filterFields';

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
        onDelete: (id: ZId) => {
          void store.deleteBlueprint(id);
        },
      }),
    [store]
  );
  const filterFields = useMemo(() => getBlueprintFilterFields(), []);

  /**
   * Отслеживание изменений фильтров и применение их к загрузчику.
   */
  useEffect(() => {
    void store.loader.setFilters(store.filterStore.values);
  }, [store.filterStore.values]);

  return (
    <div className="space-y-4">
      <FilterForm store={store.filterStore} fields={filterFields} />

      <PaginatedTable
        loader={store.loader}
        columns={columns}
        rowKey="id"
        emptyText="Blueprint отсутствуют"
      />
    </div>
  );
});
