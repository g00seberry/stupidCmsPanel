import { makeAutoObservable } from 'mobx';
import { listEntries } from '@/api/apiEntries';
import { PaginatedDataLoader } from '@/utils/paginatedDataLoader';
import type { ZEntry, ZEntriesListParams } from '@/types/entries';
import type { ZPaginationMeta, ZPaginationLinks } from '@/types/pagination';

/**
 * Store для управления состоянием списка записей CMS.
 * Обеспечивает загрузку, фильтрацию и пагинацию записей.
 */
export class EntriesListStore {
  /** Универсальный загрузчик пагинированных данных. */
  private readonly loader: PaginatedDataLoader<ZEntry, ZEntriesListParams>;

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

  /** Ссылки пагинации. */
  get paginationLinks(): ZPaginationLinks | null {
    return this.loader.paginationLinks;
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
   * @param postType Slug типа контента для фильтрации.
   */
  async loadEntries(postType?: string): Promise<void> {
    if (postType !== undefined) {
      await this.loader.setFilters({ post_type: postType } as Partial<ZEntriesListParams>);
    } else {
      await this.loader.load();
    }
  }

  /**
   * Устанавливает фильтры и перезагружает данные.
   * @param filters Новые параметры фильтрации.
   * @param postType Slug типа контента для фильтрации.
   */
  async setFilters(filters: Partial<ZEntriesListParams>, postType?: string): Promise<void> {
    const updatedFilters = { ...filters };
    if (postType !== undefined) {
      updatedFilters.post_type = postType;
    }
    await this.loader.setFilters(updatedFilters);
  }

  /**
   * Переходит на указанную страницу.
   * @param page Номер страницы.
   * @param postType Slug типа контента для фильтрации.
   */
  async goToPage(page: number, postType?: string): Promise<void> {
    if (postType !== undefined) {
      await this.loader.setFilters({ page, post_type: postType } as Partial<ZEntriesListParams>);
    } else {
      await this.loader.goToPage(page);
    }
  }

  /**
   * Сбрасывает фильтры к значениям по умолчанию.
   * @param postType Slug типа контента для фильтрации.
   */
  async resetFilters(postType?: string): Promise<void> {
    const defaultFilters: ZEntriesListParams = {
      page: 1,
      per_page: 15,
      status: 'all',
      ...(postType !== undefined && { post_type: postType }),
    };
    await this.loader.resetFilters(defaultFilters);
  }

  /**
   * Инициализирует загрузку данных при первом открытии страницы.
   * @param postType Slug типа контента для фильтрации.
   */
  async initialize(postType?: string): Promise<void> {
    await this.loader.initialize(
      postType !== undefined ? ({ post_type: postType } as Partial<ZEntriesListParams>) : undefined
    );
  }
}
