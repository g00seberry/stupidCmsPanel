import { makeAutoObservable } from 'mobx';
import type { ZBlueprintListItem } from '@/types/blueprint';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import {
  listBlueprints,
  deleteBlueprint as deleteBlueprintApi,
  type BlueprintListFilters,
} from '@/api/blueprintApi';
import { PaginatedDataLoader } from '@/components/PaginatedTable/paginatedDataLoader';
import { FilterFormStore } from '@/components/FilterForm';

/**
 * Store для управления списком Blueprint.
 * Обеспечивает загрузку списка с пагинацией, поиском, сортировкой и удалением элементов.
 */
export class BlueprintListStore {
  /** Универсальный загрузчик пагинированных данных. */
  readonly loader = new PaginatedDataLoader<ZBlueprintListItem, BlueprintListFilters>(
    listBlueprints,
    {
      filters: {},
      pagination: {
        page: 1,
        per_page: 15,
      },
    }
  );

  /** Store для управления формой фильтрации. */
  readonly filterStore = new FilterFormStore<BlueprintListFilters>();

  /** Флаг выполнения запроса удаления. */
  deleting = false;

  constructor() {
    makeAutoObservable(this);
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
    await this.loader.initialize();
  }

  /**
   * Удалить Blueprint из списка.
   * @param id Идентификатор Blueprint для удаления.
   */
  async deleteBlueprint(id: ZId): Promise<void> {
    this.setDeleting(true);
    try {
      await deleteBlueprintApi(id);
      void this.loader.load();
    } catch (error) {
      onError(error);
    } finally {
      this.setDeleting(false);
    }
  }
}
