import { makeAutoObservable } from 'mobx';
import { onError } from '@/utils/onError';
import type { ZPaginationMeta, ZPaginationLinks } from '@/types/pagination';

/** Значение страницы по умолчанию. */
const DEFAULT_PAGE = 1;

/** Значение количества элементов на странице по умолчанию. */
const DEFAULT_PER_PAGE = 15;

/** Множество ключевых слов для определения полей сортировки. */
const SORT_KEYWORDS = new Set(['sort', 'order']);

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
 * Параметры пагинации и сортировки.
 */
export type PaginationParams = {
  /** Номер страницы (>=1). По умолчанию: 1. */
  page: number;
  /** Количество элементов на странице. По умолчанию: 15. */
  per_page: number;
  /** Поле сортировки. Опционально, зависит от конкретного API. */
  [sortField: string]: unknown;
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
 * Тип фильтров без параметров пагинации и сортировки.
 */
export type FiltersWithoutPagination<T extends BasePaginationParams> = Omit<T, 'page' | 'per_page'>;

/**
 * Тип параметров пагинации и сортировки.
 */
export type PaginationAndSortParams<T extends BasePaginationParams> = Pick<T, 'page' | 'per_page'> &
  Partial<Omit<T, 'page' | 'per_page'>>;

/**
 * Определяет, является ли поле параметром сортировки.
 * Поля считаются параметрами сортировки, если их название содержит ключевые слова сортировки.
 * @param key Название поля.
 * @returns `true`, если поле является параметром сортировки.
 */
const isSortField = (key: string): boolean => {
  const lowerKey = key.toLowerCase();
  for (const keyword of SORT_KEYWORDS) {
    if (lowerKey.includes(keyword)) {
      return true;
    }
  }
  return false;
};

/**
 * Разделяет параметры на фильтры и параметры пагинации/сортировки.
 * Оптимизированная версия с единым проходом по параметрам.
 * @param params Исходные параметры.
 * @returns Объект с разделёнными фильтрами и пагинацией.
 */
const splitParams = <T extends BasePaginationParams>(params: T) => {
  const filters: Record<string, unknown> = {};
  const pagination: Record<string, unknown> = {
    page: params.page ?? DEFAULT_PAGE,
    per_page: params.per_page ?? DEFAULT_PER_PAGE,
  };

  for (const [key, value] of Object.entries(params)) {
    if (key === 'page' || key === 'per_page') {
      continue;
    }
    if (isSortField(key)) {
      pagination[key] = value;
    } else {
      filters[key] = value;
    }
  }

  return {
    filters: filters as FiltersWithoutPagination<T>,
    pagination: pagination as PaginationAndSortParams<T>,
  };
};

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
  /** Текущие параметры фильтрации (без пагинации и сортировки). */
  filters: FiltersWithoutPagination<TParams>;
  /** Параметры пагинации и сортировки. */
  pagination: PaginationAndSortParams<TParams>;
  /** Функция для загрузки данных с сервера. */
  private readonly loadFn: LoadPaginatedDataFn<TData, TParams>;

  /**
   * Создаёт экземпляр загрузчика пагинированных данных.
   * @param loadFn Функция для загрузки данных с сервера.
   * @param defaultParams Параметры по умолчанию (включая фильтры и пагинацию).
   */
  constructor(loadFn: LoadPaginatedDataFn<TData, TParams>, defaultParams: TParams) {
    this.loadFn = loadFn;
    const { filters, pagination } = splitParams(defaultParams);
    this.filters = filters;
    this.pagination = pagination;
    makeAutoObservable(this);
  }

  /**
   * Объединяет фильтры и параметры пагинации в единый объект параметров запроса.
   * @returns Объект параметров для запроса к API.
   */
  private buildParams(): TParams {
    return {
      ...this.filters,
      ...this.pagination,
      page: this.pagination.page ?? DEFAULT_PAGE,
      per_page: this.pagination.per_page ?? DEFAULT_PER_PAGE,
    } as TParams;
  }

  /**
   * Обновляет состояние после успешной загрузки данных.
   * @param result Результат загрузки данных.
   */
  private updateState(result: PaginatedResult<TData>): void {
    this.data = result.data;
    this.paginationMeta = result.meta;
    this.paginationLinks = result.links;
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
      const params = this.buildParams();
      const result = await this.loadFn(params);
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
  setFiltersValue(filters: FiltersWithoutPagination<TParams>): void {
    this.filters = filters;
  }

  /**
   * Устанавливает параметры пагинации и сортировки без перезагрузки данных.
   * @param pagination Новые параметры пагинации и сортировки.
   */
  setPaginationValue(pagination: Partial<PaginationAndSortParams<TParams>>): void {
    this.pagination = { ...this.pagination, ...pagination };
  }

  /**
   * Устанавливает фильтры и перезагружает данные.
   * @param filters Новые параметры фильтрации (без пагинации и сортировки).
   */
  async setFilters(filters: FiltersWithoutPagination<TParams>): Promise<void> {
    this.setFiltersValue(filters);
    await this.load();
  }

  /**
   * Устанавливает параметры пагинации и сортировки и перезагружает данные.
   * @param pagination Новые параметры пагинации и сортировки.
   */
  async setPagination(pagination: Partial<PaginationAndSortParams<TParams>>): Promise<void> {
    this.setPaginationValue(pagination);
    await this.load();
  }

  /**
   * Переходит на указанную страницу.
   * @param page Номер страницы.
   */
  async goToPage(page: number): Promise<void> {
    await this.setPagination({ page } as Partial<PaginationAndSortParams<TParams>>);
  }

  /**
   * Сбрасывает фильтры к значениям по умолчанию.
   * @param defaultParams Параметры по умолчанию (включая фильтры и пагинацию).
   */
  async resetFilters(defaultParams: TParams): Promise<void> {
    const { filters, pagination } = splitParams(defaultParams);
    this.filters = filters;
    this.pagination = pagination;
    await this.load();
  }

  /**
   * Разделяет частичные параметры на фильтры и параметры пагинации/сортировки.
   * Оптимизированная версия для частичных параметров без обязательных полей.
   * @param params Частичные параметры.
   * @returns Объект с разделёнными фильтрами и пагинацией.
   */
  private splitPartialParams(params: Partial<TParams>) {
    const filters: Record<string, unknown> = {};
    const pagination: Partial<PaginationAndSortParams<TParams>> = {};

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) {
        continue;
      }

      if (key === 'page' || key === 'per_page') {
        pagination[key] = value as number;
      } else if (isSortField(key)) {
        (pagination as Record<string, unknown>)[key] = value;
      } else {
        filters[key] = value;
      }
    }

    return {
      filters: filters as Partial<FiltersWithoutPagination<TParams>>,
      pagination,
    };
  }

  /**
   * Инициализирует загрузку данных при первом открытии страницы.
   * Использует оптимизированную функцию для разделения частичных параметров.
   * @param initialParams Опциональные начальные параметры (могут включать фильтры и/или пагинацию).
   */
  async initialize(initialParams?: Partial<TParams>): Promise<void> {
    this.initialLoading = true;

    if (initialParams) {
      const { filters: newFilters, pagination: newPagination } = this.splitPartialParams(
        initialParams
      );

      // Объединяем с текущими значениями, приоритет у initialParams
      if (Object.keys(newFilters).length > 0) {
        this.filters = { ...this.filters, ...newFilters } as FiltersWithoutPagination<TParams>;
      }
      if (Object.keys(newPagination).length > 0) {
        this.pagination = { ...this.pagination, ...newPagination };
      }
    }

    await this.load();
  }
}
