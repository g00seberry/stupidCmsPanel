import type { ZPaginatedResponse } from '@/types/pagination';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/** Значение страницы по умолчанию. */
const defaultPage = 1;

/** Значение количества элементов на странице по умолчанию. */
const defaultPerPage = 15;

/**
 * Базовые параметры пагинации для любого запроса.
 */
export type BasePaginationParams = {
  /** Номер страницы (>=1). По умолчанию: 1. */
  page?: number;
  /** Количество элементов на странице. По умолчанию: 15. */
  per_page?: number;
};

export type LoaderParams<TFilters extends {}> = {
  filters: TFilters;
  pagination: BasePaginationParams;
};

/**
 * Функция загрузки пагинированных данных.
 * @param params Параметры запроса, включая пагинацию.
 * @returns Результат с данными, метаданными и ссылками пагинации.
 */
export type LoadPaginatedDataFn<TData, TFilters extends {}> = (
  params: LoaderParams<TFilters>
) => Promise<ZPaginatedResponse<TData>>;

/**
 * Универсальный загрузчик пагинированных данных.
 * Управляет состоянием загрузки, данными и пагинацией для любого типа сущностей.
 * Фильтры и параметры пагинации с сортировкой хранятся отдельно и объединяются при загрузке.
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
export class PaginatedDataLoader<TData, TFilters extends {}> {
  resp: ZPaginatedResponse<TData> | null = null;
  /** Флаг выполнения запроса загрузки. */
  pending = false;
  /** Флаг начальной загрузки данных. */
  initialLoading = false;
  /** параметры загрузки */
  params: LoaderParams<TFilters>;
  /** Функция для загрузки данных с сервера. */
  private readonly loadFn: LoadPaginatedDataFn<TData, TFilters>;

  /**
   * Создаёт экземпляр загрузчика пагинированных данных.
   * @param loadFn Функция для загрузки данных с сервера.
   * @param defaultParams Параметры по умолчанию (включая фильтры и пагинацию).
   */
  constructor(loadFn: LoadPaginatedDataFn<TData, TFilters>, defaultParams: LoaderParams<TFilters>) {
    this.loadFn = loadFn;
    this.params = defaultParams;
    makeAutoObservable(this);
  }

  /**
   * Обновляет состояние после успешной загрузки данных.
   * @param result Результат загрузки данных.
   */
  private updateState(result: ZPaginatedResponse<TData>): void {
    this.resp = result;
  }

  /**
   * Загружает данные с текущими фильтрами и параметрами пагинации.
   * Предотвращает параллельные запросы.
   */
  async load(): Promise<void> {
    if (this.pending) {
      return;
    }

    this.pending = true;

    try {
      const result = await this.loadFn(this.params);
      this.updateState(result);
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.pending = false;
      this.initialLoading = false;
    }
  }

  /**
   * Устанавливает фильтры без перезагрузки данных.
   * @param filters Новые параметры фильтрации (без пагинации и сортировки).
   */
  setFiltersValue(filters: TFilters): void {
    this.params.filters = filters;
  }

  /**
   * Устанавливает параметры пагинации и сортировки без перезагрузки данных.
   * @param pagination Новые параметры пагинации и сортировки.
   */
  setPaginationValue(pagination: BasePaginationParams): void {
    this.params.pagination = pagination;
  }

  /**
   * Устанавливает фильтры и перезагружает данные.
   * @param filters Новые параметры фильтрации (без пагинации и сортировки).
   */
  async setFilters(filters: TFilters): Promise<void> {
    this.setFiltersValue(filters);
    await this.load();
  }

  /**
   * Устанавливает параметры пагинации и сортировки и перезагружает данные.
   * @param pagination Новые параметры пагинации и сортировки.
   */
  async setPagination(pagination: BasePaginationParams): Promise<void> {
    this.setPaginationValue(pagination);
    await this.load();
  }

  /**
   * Переходит на указанную страницу.
   * @param page Номер страницы.
   */
  async goToPage(page: number): Promise<void> {
    await this.setPagination({ ...this.params.pagination, page });
  }

  /**
   * Сбрасывает фильтры к значениям по умолчанию.
   * @param defaultParams Параметры по умолчанию (включая фильтры и пагинацию).
   */
  async resetFilters(defaultParams: LoaderParams<TFilters>): Promise<void> {
    this.params = defaultParams;
    await this.load();
  }

  /**
   * Инициализирует загрузку данных при первом открытии страницы.
   * Использует оптимизированную функцию для разделения частичных параметров.
   * @param initialParams Опциональные начальные параметры (могут включать фильтры и/или пагинацию).
   */
  async initialize(initialParams?: Partial<LoaderParams<TFilters>>): Promise<void> {
    this.initialLoading = true;

    if (initialParams) {
      const {
        filters: newFilters = {},
        pagination: newPagination = { page: defaultPage, per_page: defaultPerPage },
      } = initialParams;

      this.params = {
        filters: { ...this.params.filters, ...newFilters },
        pagination: { ...this.params.pagination, ...newPagination },
      };
    }

    await this.load();
  }
}
