import { makeAutoObservable } from 'mobx';
import { onError } from '@/utils/onError';
import type { ZPaginationMeta, ZPaginationLinks } from '@/types/pagination';

/**
 * Базовые параметры пагинации для любого запроса.
 */
export type BasePaginationParams = {
  /** Номер страницы (>=1). По умолчанию: 1. */
  page?: number;
  /** Количество элементов на странице. По умолчанию: 15. */
  per_page?: number;
};

/**
 * Результат загрузки пагинированных данных.
 */
export type PaginatedResult<TData> = {
  /** Массив загруженных данных. */
  data: TData[];
  /** Метаданные пагинации. */
  meta: ZPaginationMeta;
  /** Ссылки пагинации. */
  links: ZPaginationLinks;
};

/**
 * Функция загрузки пагинированных данных.
 * @param params Параметры запроса, включая пагинацию.
 * @returns Результат с данными, метаданными и ссылками пагинации.
 */
export type LoadPaginatedDataFn<TData, TParams extends BasePaginationParams> = (
  params: TParams
) => Promise<PaginatedResult<TData>>;

/**
 * Универсальный загрузчик пагинированных данных.
 * Управляет состоянием загрузки, данными и пагинацией для любого типа сущностей.
 * @template TData Тип элемента данных.
 * @template TParams Тип параметров запроса (должен расширять BasePaginationParams).
 * @example
 * const loader = new PaginatedDataLoader(
 *   async (params) => await listEntries(params),
 *   { page: 1, per_page: 15, status: 'all' }
 * );
 * await loader.initialize();
 * console.log(loader.data); // Массив записей
 */
export class PaginatedDataLoader<TData, TParams extends BasePaginationParams> {
  /** Массив загруженных данных. */
  data: TData[] = [];
  /** Метаданные пагинации. */
  paginationMeta: ZPaginationMeta | null = null;
  /** Ссылки пагинации. */
  paginationLinks: ZPaginationLinks | null = null;
  /** Флаг выполнения запроса загрузки. */
  pending = false;
  /** Флаг начальной загрузки данных. */
  initialLoading = false;
  /** Текущие параметры фильтрации. */
  filters: TParams;
  /** Функция для загрузки данных с сервера. */
  private readonly loadFn: LoadPaginatedDataFn<TData, TParams>;

  /**
   * Создаёт экземпляр загрузчика пагинированных данных.
   * @param loadFn Функция для загрузки данных с сервера.
   * @param defaultFilters Параметры фильтрации по умолчанию.
   */
  constructor(loadFn: LoadPaginatedDataFn<TData, TParams>, defaultFilters: TParams) {
    this.loadFn = loadFn;
    this.filters = { ...defaultFilters };
    makeAutoObservable(this);
  }

  /**
   * Устанавливает данные.
   * @param data Массив данных для установки.
   */
  setData(data: TData[]): void {
    this.data = data;
  }

  /**
   * Устанавливает метаданные пагинации.
   * @param meta Метаданные пагинации.
   */
  setPaginationMeta(meta: ZPaginationMeta | null): void {
    this.paginationMeta = meta;
  }

  /**
   * Устанавливает ссылки пагинации.
   * @param links Ссылки пагинации.
   */
  setPaginationLinks(links: ZPaginationLinks | null): void {
    this.paginationLinks = links;
  }

  /**
   * Устанавливает флаг выполнения запроса.
   * @param pending Значение флага.
   */
  setPending(pending: boolean): void {
    this.pending = pending;
  }

  /**
   * Устанавливает флаг начальной загрузки.
   * @param loading Значение флага.
   */
  setInitialLoading(loading: boolean): void {
    this.initialLoading = loading;
  }

  /**
   * Устанавливает фильтры без перезагрузки данных.
   * @param filters Новые параметры фильтрации.
   */
  setFiltersValue(filters: TParams): void {
    this.filters = filters;
  }

  /**
   * Загружает данные с текущими фильтрами.
   */
  async load(): Promise<void> {
    // Предотвращаем параллельные запросы
    if (this.pending) {
      return;
    }

    this.setPending(true);

    try {
      const params: TParams = {
        ...this.filters,
        page: this.filters.page ?? 1,
        per_page: this.filters.per_page ?? 15,
      };

      const result = await this.loadFn(params);
      this.setData(result.data);
      this.setPaginationMeta(result.meta);
      this.setPaginationLinks(result.links);
    } catch (error) {
      // Сохраняем состояние при ошибке - не очищаем данные
      onError(error);
      // Пробрасываем ошибку дальше, чтобы вызывающий код мог её обработать
      throw error;
    } finally {
      this.setPending(false);
      this.setInitialLoading(false);
    }
  }

  /**
   * Устанавливает фильтры и перезагружает данные.
   * @param filters Новые параметры фильтрации.
   */
  async setFilters(filters: Partial<TParams>): Promise<void> {
    this.setFiltersValue({ ...this.filters, ...filters });
    await this.load();
  }

  /**
   * Переходит на указанную страницу.
   * @param page Номер страницы.
   */
  async goToPage(page: number): Promise<void> {
    await this.setFilters({ page } as Partial<TParams>);
  }

  /**
   * Сбрасывает фильтры к значениям по умолчанию.
   * @param defaultFilters Параметры фильтрации по умолчанию.
   */
  async resetFilters(defaultFilters: TParams): Promise<void> {
    this.setFiltersValue({ ...defaultFilters });
    await this.load();
  }

  /**
   * Инициализирует загрузку данных при первом открытии страницы.
   * @param initialFilters Опциональные начальные фильтры.
   */
  async initialize(initialFilters?: Partial<TParams>): Promise<void> {
    this.setInitialLoading(true);
    if (initialFilters) {
      this.setFiltersValue({ ...this.filters, ...initialFilters });
    }
    await this.load();
  }
}
