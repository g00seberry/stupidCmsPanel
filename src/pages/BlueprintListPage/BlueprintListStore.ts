import {
  deleteBlueprint as deleteBlueprintApi,
  listBlueprints,
  type BlueprintListFilters,
} from '@/api/blueprintApi';
import { FilterFormStore } from '@/components/FilterForm';
import { PaginatedDataLoader } from '@/components/PaginatedTable/paginatedDataLoader';
import { PaginatedTableStore } from '@/components/PaginatedTable/PaginatedTableStore';
import type { ZBlueprintListItem } from '@/types/blueprint';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/**
 * Store для управления списком Blueprint.
 * Обеспечивает загрузку списка с пагинацией, поиском, сортировкой и удалением элементов.
 */
export class BlueprintListStore {
  /** Универсальный стор пагинированной таблицы. */
  readonly tableStore = new PaginatedTableStore<ZBlueprintListItem, BlueprintListFilters>(
    new PaginatedDataLoader<ZBlueprintListItem, BlueprintListFilters>(listBlueprints, {
      filters: {},
      pagination: {
        page: 1,
        per_page: 15,
      },
    }),
    'id'
  );

  /** Store для управления формой фильтрации. */
  readonly filterStore = new FilterFormStore<BlueprintListFilters>();

  /** Флаг выполнения запроса удаления. */
  deleting = false;

  constructor() {
    makeAutoObservable(this);
  }

  /** Количество выбранных Blueprint. */
  get selectedCount(): number {
    return this.tableStore.selectedRowKeys.size;
  }

  /** Флаг наличия выбранных элементов. */
  get hasSelection(): boolean {
    return this.selectedCount > 0;
  }

  /**
   * Получить массив выбранных идентификаторов.
   * @returns Массив выбранных ID.
   */
  getSelectedIds(): (string | number)[] {
    return Array.from(this.tableStore.selectedRowKeys);
  }

  /**
   * Устанавливает флаг выполнения запроса удаления.
   * @param deleting Значение флага.
   */
  setDeleting(deleting: boolean): void {
    this.deleting = deleting;
  }

  /**
   * Инициализирует загрузку данных при первом открытии страницы.
   */
  async initialize(): Promise<void> {
    await this.tableStore.loader.initialize();
  }

  /**
   * Удалить Blueprint из списка.
   * @param id Идентификатор Blueprint для удаления.
   */
  async deleteBlueprint(id: ZId): Promise<void> {
    this.setDeleting(true);
    try {
      await deleteBlueprintApi(id);
      this.tableStore.deselectRow(id);
      this.tableStore.deselectRow(id);
      void this.tableStore.loader.load();
    } catch (error) {
      onError(error);
    } finally {
      this.setDeleting(false);
    }
  }

  /**
   * Массовое удаление выбранных Blueprint.
   */
  async bulkDelete(): Promise<void> {
    const ids = this.getSelectedIds();
    if (ids.length === 0) {
      return;
    }

    this.setDeleting(true);
    try {
      await Promise.all(ids.map(id => deleteBlueprintApi(String(id))));
      this.tableStore.deselectAllOnCurrentPage();
      this.tableStore.clearSelection();
      void this.tableStore.loader.load();
    } catch (error) {
      onError(error);
    } finally {
      this.setDeleting(false);
    }
  }
}
