import { getEntriesStatuses, listEntries } from '@/api/apiEntries';
import { PaginatedDataLoader } from '@/components/PaginatedTable/paginatedDataLoader';
import type { ZEntriesListParams, ZEntry } from '@/types/entries';
import type { ZPaginationMeta } from '@/types/pagination';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/**
 * Store для управления состоянием списка записей CMS.
 * Обеспечивает загрузку, фильтрацию и пагинацию записей.
 */
export class EntriesListStore {
  /** Универсальный загрузчик пагинированных данных. */
  private readonly loader: PaginatedDataLoader<ZEntry, ZEntriesListParams>;

  /** Массив возможных статусов записей. */
  statuses: string[] = [];

  /** Флаг выполнения запроса загрузки статусов. */
  statusesPending = false;

  constructor() {
    const defaultFilters: ZEntriesListParams = {
      page: 1,
      per_page: 15,
      status: 'all',
    };

    this.loader = new PaginatedDataLoader(listEntries, defaultFilters);
    makeAutoObservable(this);
  }

  /** Массив загруженных записей. */
  get entries(): ZEntry[] {
    return this.loader.data;
  }

  /** Метаданные пагинации. */
  get paginationMeta(): ZPaginationMeta | null {
    return this.loader.paginationMeta;
  }

  /** Флаг выполнения запроса загрузки. */
  get pending(): boolean {
    return this.loader.pending;
  }

  /** Флаг начальной загрузки данных. */
  get initialLoading(): boolean {
    return this.loader.initialLoading;
  }

  /** Текущие параметры фильтрации. */
  get filters(): ZEntriesListParams {
    return this.loader.filters;
  }

  /** Универсальный загрузчик пагинированных данных. */
  get paginatedLoader(): PaginatedDataLoader<ZEntry, ZEntriesListParams> {
    return this.loader;
  }

  /**
   * Загружает список записей с текущими фильтрами.
   * @param postTypeId ID типа контента для фильтрации.
   */
  async loadEntries(postTypeId?: ZId): Promise<void> {
    if (postTypeId !== undefined) {
      await this.loader.setFilters({ post_type_id: postTypeId } as Partial<ZEntriesListParams>);
    } else {
      await this.loader.load();
    }
  }

  /**
   * Устанавливает фильтры и перезагружает данные.
   * @param filters Новые параметры фильтрации (без пагинации и сортировки).
   * @param postTypeId ID типа контента для фильтрации.
   */
  async setFilters(filters: Partial<ZEntriesListParams>, postTypeId?: ZId): Promise<void> {
    const updatedFilters: Partial<ZEntriesListParams> = { ...filters };
    if (postTypeId !== undefined) {
      updatedFilters.post_type_id = postTypeId;
    }
    // Удаляем параметры пагинации из фильтров
    delete updatedFilters.page;
    delete updatedFilters.per_page;
    await this.loader.setFilters(updatedFilters);
  }

  /**
   * Переходит на указанную страницу.
   * @param page Номер страницы.
   * @param postTypeId ID типа контента для фильтрации.
   */
  async goToPage(page: number, postTypeId?: ZId): Promise<void> {
    if (postTypeId !== undefined) {
      // Сначала устанавливаем фильтр post_type_id, если нужно
      await this.loader.setFilters({ post_type_id: postTypeId } as Partial<ZEntriesListParams>);
    }
    await this.loader.goToPage(page);
  }

  /**
   * Сбрасывает фильтры к значениям по умолчанию.
   * @param postTypeId ID типа контента для фильтрации.
   */
  async resetFilters(postTypeId?: ZId): Promise<void> {
    const defaultFilters: ZEntriesListParams = {
      page: 1,
      per_page: 15,
      status: 'all',
      ...(postTypeId !== undefined && { post_type_id: postTypeId }),
    };
    await this.loader.resetFilters(defaultFilters);
  }

  /**
   * Инициализирует загрузку данных при первом открытии страницы.
   * @param postTypeId ID типа контента для фильтрации.
   */
  async initialize(postTypeId?: ZId): Promise<void> {
    await Promise.all([
      this.loadStatuses(),
      this.loader.initialize(
        postTypeId !== undefined
          ? ({ post_type_id: postTypeId } as Partial<ZEntriesListParams>)
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
