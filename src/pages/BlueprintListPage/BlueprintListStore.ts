import { makeAutoObservable, observable } from 'mobx';
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

  /** Множество выбранных идентификаторов Blueprint. */
  selectedIds = observable.set<ZId>();

  /** Флаг выполнения запроса удаления. */
  deleting = false;

  constructor() {
    makeAutoObservable(this);
  }

  /** Количество выбранных Blueprint. */
  get selectedCount(): number {
    return this.selectedIds.size;
  }

  /** Флаг наличия выбранных элементов. */
  get hasSelection(): boolean {
    return this.selectedIds.size > 0;
  }

  /**
   * Получить массив выбранных идентификаторов.
   * @returns Массив выбранных ID.
   */
  getSelectedIds(): ZId[] {
    return Array.from(this.selectedIds);
  }

  /**
   * Выбрать все элементы на текущей странице.
   */
  selectAll(): void {
    const data = this.loader.resp?.data || [];
    data.forEach(item => this.selectedIds.add(item.id));
  }

  /**
   * Снять выбор со всех элементов.
   */
  deselectAll(): void {
    this.selectedIds.clear();
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
      this.selectedIds.delete(id);
      void this.loader.load();
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
      await Promise.all(ids.map(id => deleteBlueprintApi(id)));
      this.deselectAll();
      void this.loader.load();
    } catch (error) {
      onError(error);
    } finally {
      this.setDeleting(false);
    }
  }
}
