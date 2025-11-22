import { makeAutoObservable } from 'mobx';
import { listEntries } from '@/api/apiEntries';
import type { ZEntry } from '@/types/entries';
import { onError } from '@/utils/onError';
import type { FieldNode } from './types/formField';
import { buildFormSchema } from './utils/buildFormSchema';
import type { ReferenceQuery, ReferenceOption } from './SchemaFormStore.types';

/**
 * Кэш для справочных данных.
 * Ключ: строка вида "resource:JSON.stringify(params)"
 */
interface CacheEntry {
  data: ReferenceOption[];
  timestamp: number;
}

/**
 * Состояние загрузки справочных данных для конкретного запроса.
 */
interface ReferenceDataState {
  loading: boolean;
  error?: Error;
  options: ReferenceOption[];
  searchTerm: string;
}

/**
 * Store для управления формой Blueprint.
 * Обеспечивает загрузку справочных данных с кэшированием и генерацию Zod-схемы валидации.
 */
export class SchemaFormStore {
  /** Кэш справочных данных. */
  private dataCache = new Map<string, CacheEntry>();

  /** Состояния загрузки справочных данных по ключам запросов. */
  private referenceStates = new Map<string, ReferenceDataState>();

  /** Таймеры debounce для поиска по ключам запросов. */
  private searchTimeouts = new Map<string, NodeJS.Timeout>();

  /** Время жизни кэша в миллисекундах (5 минут). */
  private readonly CACHE_TTL = 5 * 60 * 1000;

  /** Узлы полей формы. */
  fieldNodes: FieldNode[] = [];

  /** Флаг загрузки схемы. */
  loading = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * Устанавливает флаг загрузки схемы.
   * @param value Новое значение флага.
   */
  setLoading(value: boolean): void {
    this.loading = value;
  }

  /**
   * Устанавливает узлы полей формы.
   * @param nodes Массив узлов полей формы.
   */
  setFieldNodes(nodes: FieldNode[]): void {
    this.fieldNodes = nodes;
  }

  /**
   * Генерирует ключ кэша из запроса.
   * @param query Запрос на получение справочных данных.
   * @returns Ключ кэша.
   */
  private getCacheKey(query: ReferenceQuery): string {
    const paramsStr = query.params ? JSON.stringify(query.params) : '';
    return `${query.resource}:${paramsStr}`;
  }

  /**
   * Загружает справочные данные для ресурса 'entries'.
   * @param params Параметры запроса.
   * @returns Массив опций для выбора.
   */
  private async loadEntriesData(params?: Record<string, unknown>): Promise<ReferenceOption[]> {
    try {
      const result = await listEntries({
        per_page: params?.per_page ? Number(params.per_page) : 100,
        q: params?.q as string | undefined,
        post_type: params?.post_type as string | undefined,
      });
      return result.data.map((entry: ZEntry) => ({
        value: entry.id,
        label: entry.title,
      }));
    } catch (error) {
      onError(error);
      return [];
    }
  }

  /**
   * Загружает справочные данные для указанного ресурса.
   * @param query Запрос на получение справочных данных.
   * @returns Массив опций для выбора.
   */
  private async loadReferenceData(query: ReferenceQuery): Promise<ReferenceOption[]> {
    switch (query.resource) {
      case 'entries':
        return this.loadEntriesData(query.params);
      // TODO: добавить поддержку других ресурсов (users, categories и т.д.)
      default:
        console.warn(`Unknown reference resource: ${query.resource}`);
        return [];
    }
  }

  /**
   * Инициализирует состояние загрузки для запроса, если его ещё нет.
   * @param cacheKey Ключ кэша.
   */
  private initReferenceState(cacheKey: string): void {
    if (!this.referenceStates.has(cacheKey)) {
      this.referenceStates.set(cacheKey, {
        loading: false,
        options: [],
        searchTerm: '',
      });
    }
  }

  /**
   * Устанавливает флаг загрузки для справочных данных.
   * @param cacheKey Ключ кэша.
   * @param value Новое значение флага.
   */
  private setReferenceLoading(cacheKey: string, value: boolean): void {
    const state = this.referenceStates.get(cacheKey);
    if (state) {
      state.loading = value;
    }
  }

  /**
   * Устанавливает опции для справочных данных.
   * @param cacheKey Ключ кэша.
   * @param options Массив опций.
   */
  private setReferenceOptions(cacheKey: string, options: ReferenceOption[]): void {
    const state = this.referenceStates.get(cacheKey);
    if (state) {
      state.options = options;
    }
  }

  /**
   * Устанавливает ошибку для справочных данных.
   * @param cacheKey Ключ кэша.
   * @param error Ошибка или undefined.
   */
  private setReferenceError(cacheKey: string, error: Error | undefined): void {
    const state = this.referenceStates.get(cacheKey);
    if (state) {
      state.error = error;
    }
  }

  /**
   * Устанавливает поисковый запрос для справочных данных.
   * @param cacheKey Ключ кэша.
   * @param term Поисковый запрос.
   */
  private setReferenceSearchTerm(cacheKey: string, term: string): void {
    const state = this.referenceStates.get(cacheKey);
    if (state) {
      state.searchTerm = term;
    }
  }

  /**
   * Получает справочные данные для запроса.
   * Загружает данные из кэша или с сервера, если кэш устарел.
   * @param query Запрос на получение справочных данных.
   * @returns Состояние загрузки справочных данных.
   */
  getReferenceData(query: ReferenceQuery): ReferenceDataState {
    const cacheKey = this.getCacheKey(query);
    this.initReferenceState(cacheKey);

    const state = this.referenceStates.get(cacheKey)!;
    const cached = this.dataCache.get(cacheKey);
    const isCacheValid = cached && Date.now() - cached.timestamp < this.CACHE_TTL;

    // Если кэш валиден и данные ещё не загружены, используем кэш
    if (isCacheValid && cached && state.options.length === 0 && !state.loading) {
      this.setReferenceOptions(cacheKey, cached.data);
    }

    // Если кэш невалиден и данные ещё не загружаются, загружаем
    if (!isCacheValid && !state.loading) {
      this.loadReferenceDataForQuery(query, cacheKey);
    }

    return state;
  }

  /**
   * Загружает справочные данные для запроса.
   * @param query Запрос на получение справочных данных.
   * @param cacheKey Ключ кэша.
   */
  private async loadReferenceDataForQuery(query: ReferenceQuery, cacheKey: string): Promise<void> {
    const state = this.referenceStates.get(cacheKey);
    if (!state) return;

    this.setReferenceLoading(cacheKey, true);
    this.setReferenceError(cacheKey, undefined);

    try {
      const data = await this.loadReferenceData(query);
      this.setReferenceOptions(cacheKey, data);
      this.setReferenceLoading(cacheKey, false);
      // Сохраняем в кэш
      this.dataCache.set(cacheKey, { data, timestamp: Date.now() });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load reference data');
      this.setReferenceError(cacheKey, error);
      this.setReferenceLoading(cacheKey, false);
      onError(error);
    }
  }

  /**
   * Выполняет поиск по справочным данным с debounce.
   * @param query Запрос на получение справочных данных.
   * @param term Поисковый запрос.
   */
  searchReferenceData(query: ReferenceQuery, term: string): void {
    const cacheKey = this.getCacheKey(query);
    this.initReferenceState(cacheKey);

    this.setReferenceSearchTerm(cacheKey, term);

    // Очищаем предыдущий timeout
    const existingTimeout = this.searchTimeouts.get(cacheKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Если поиск пустой, загружаем обычные данные
    if (!term) {
      const searchQuery = { ...query };
      delete searchQuery.params?.q;
      const searchKey = this.getCacheKey(searchQuery);
      this.loadReferenceDataForQuery(searchQuery, searchKey);
      return;
    }

    // Debounce поиска (300ms)
    const timeout = setTimeout(async () => {
      const searchQuery = { ...query, params: { ...query.params, q: term } };
      const searchKey = this.getCacheKey(searchQuery);
      await this.loadReferenceDataForQuery(searchQuery, searchKey);
      this.searchTimeouts.delete(cacheKey);
    }, 300);

    this.searchTimeouts.set(cacheKey, timeout);
  }

  /**
   * Загружает схему Blueprint из API и преобразует в FieldNode[].
   * @param blueprintId Идентификатор Blueprint.
   */
  async loadSchema(blueprintId: number): Promise<void> {
    this.setLoading(true);

    try {
      const nodes = await buildFormSchema(blueprintId);
      this.setFieldNodes(nodes);
      this.setLoading(false);
    } catch (error) {
      this.setFieldNodes([]);
      this.setLoading(false);
      onError(error);
    }
  }

  /**
   * Очищает кэш и состояния загрузки.
   * Полезно при размонтировании компонента или сбросе формы.
   */
  cleanup(): void {
    // Очищаем все таймеры
    for (const timeout of this.searchTimeouts.values()) {
      clearTimeout(timeout);
    }
    this.searchTimeouts.clear();
    this.referenceStates.clear();
    // Сбрасываем состояние схемы
    this.setFieldNodes([]);
    this.setLoading(false);
    // Кэш можно оставить, так как он может быть полезен при повторном использовании
  }
}
