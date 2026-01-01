import { getEntriesStatuses, listEntries } from '@/api/apiEntries';
import { PaginatedDataLoader } from '@/components/PaginatedTable/paginatedDataLoader';
import { PaginatedTableStore } from '@/components/PaginatedTable/PaginatedTableStore';
import type { ZEntriesListFilters, ZEntry } from '@/types/entries';
import type { ZPaginationMeta } from '@/types/pagination';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/**
 * Store для управления состоянием списка записей CMS.
 * Обеспечивает загрузку, фильтрацию и пагинацию записей.
 */
export class EntriesListStore {
  /** Универсальный стор пагинированной таблицы. */
  readonly tableStore: PaginatedTableStore<ZEntry, ZEntriesListFilters>;

  /** Массив возможных статусов записей. */
  statuses: string[] = [];

  /** Флаг выполнения запроса загрузки статусов. */
  statusesPending = false;

  constructor() {
    const defaultParams = {
      filters: {},
      pagination: {
        page: 1,
        per_page: 15,
      },
    };

    this.tableStore = new PaginatedTableStore<ZEntry, ZEntriesListFilters>(
      new PaginatedDataLoader<ZEntry, ZEntriesListFilters>(listEntries, defaultParams),
      'id'
    );
    makeAutoObservable(this);
  }

  /** Массив загруженных записей. */
  get entries(): ZEntry[] {
    return this.tableStore.loader.resp?.data || [];
  }

  /** Метаданные пагинации. */
  get paginationMeta(): ZPaginationMeta | null {
    return this.tableStore.loader.resp?.meta || null;
  }

  /** Флаг выполнения запроса загрузки. */
  get pending(): boolean {
    return this.tableStore.loader.pending;
  }

  /** Флаг начальной загрузки данных. */
  get initialLoading(): boolean {
    return this.tableStore.loader.initialLoading;
  }

  /** Текущие параметры фильтрации. */
  get filters(): ZEntriesListFilters {
    return this.tableStore.loader.params.filters;
  }

  /**
   * Загружает список записей с текущими фильтрами.
   * @param postTypeId ID типа контента для фильтрации.
   */
  async loadEntries(postTypeId?: ZId): Promise<void> {
    if (postTypeId !== undefined) {
      await this.tableStore.loader.setFilters({ post_type_id: postTypeId } as ZEntriesListFilters);
    } else {
      await this.tableStore.loader.load();
    }
  }

  /**
   * Устанавливает фильтры и перезагружает данные.
   * @param filters Новые параметры фильтрации (без пагинации и сортировки).
   * @param postTypeId ID типа контента для фильтрации.
   */
  async setFilters(filters: Partial<ZEntriesListFilters>, postTypeId?: ZId): Promise<void> {
    const updatedFilters: Partial<ZEntriesListFilters> = { ...filters };
    if (postTypeId !== undefined) {
      updatedFilters.post_type_id = postTypeId;
    }
    await this.tableStore.loader.setFilters(updatedFilters as ZEntriesListFilters);
  }

  /**
   * Переходит на указанную страницу.
   * @param page Номер страницы.
   * @param postTypeId ID типа контента для фильтрации.
   */
  async goToPage(page: number, postTypeId?: ZId): Promise<void> {
    if (postTypeId !== undefined) {
      // Сначала устанавливаем фильтр post_type_id, если нужно
      await this.tableStore.loader.setFilters({ post_type_id: postTypeId } as ZEntriesListFilters);
    }
    await this.tableStore.loader.goToPage(page);
  }

  /**
   * Сбрасывает фильтры к значениям по умолчанию.
   * @param postTypeId ID типа контента для фильтрации.
   */
  async resetFilters(postTypeId?: ZId): Promise<void> {
    const defaultParams = {
      filters: {
        ...(postTypeId !== undefined && { post_type_id: postTypeId }),
      } as ZEntriesListFilters,
      pagination: {
        page: 1,
        per_page: 15,
      },
    };
    await this.tableStore.loader.resetFilters(defaultParams);
  }

  /**
   * Инициализирует загрузку данных при первом открытии страницы.
   * @param postTypeId ID типа контента для фильтрации.
   */
  async initialize(postTypeId?: ZId): Promise<void> {
    await Promise.all([
      this.loadStatuses(),
      this.tableStore.loader.initialize(
        postTypeId !== undefined
          ? {
              filters: { post_type_id: postTypeId } as Partial<ZEntriesListFilters>,
            }
          : undefined
      ),
    ]);
  }

  /**
   * Загружает список возможных статусов для записей.
   */
  async loadStatuses(): Promise<void> {
    if (this.statusesPending || this.statuses.length > 0) {
      return;
    }

    this.statusesPending = true;
    try {
      this.statuses = await getEntriesStatuses();
    } catch (error) {
      onError(error);
    } finally {
      this.statusesPending = false;
    }
  }
}
