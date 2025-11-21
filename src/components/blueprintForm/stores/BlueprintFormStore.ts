import { makeAutoObservable, runInAction } from 'mobx';
import { listEntries } from '@/api/apiEntries';
import type { ZEntry } from '@/types/entries';
import { onError } from '@/utils/onError';
import type { FieldNode } from '../types/formField';
import { buildZodSchemaFromPaths } from '../utils/buildZodSchemaFromPaths';
import type { z } from 'zod';
import type { ReferenceQuery, ReferenceOption } from './BlueprintFormStore.types';

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
export class BlueprintFormStore {
  /** Кэш справочных данных. */
  private dataCache = new Map<string, CacheEntry>();

  /** Состояния загрузки справочных данных по ключам запросов. */
  private referenceStates = new Map<string, ReferenceDataState>();

  /** Таймеры debounce для поиска по ключам запросов. */
  private searchTimeouts = new Map<string, NodeJS.Timeout>();

  /** Время жизни кэша в миллисекундах (5 минут). */
  private readonly CACHE_TTL = 5 * 60 * 1000;

  /** Zod-схема валидации формы. */
  schema: z.ZodObject<Record<string, z.ZodTypeAny>> | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
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
      runInAction(() => {
        state.options = cached.data;
      });
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

    runInAction(() => {
      state.loading = true;
      state.error = undefined;
    });

    try {
      const data = await this.loadReferenceData(query);
      runInAction(() => {
        state.options = data;
        state.loading = false;
      });
      // Сохраняем в кэш
      this.dataCache.set(cacheKey, { data, timestamp: Date.now() });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load reference data');
      runInAction(() => {
        state.error = error;
        state.loading = false;
      });
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

    const state = this.referenceStates.get(cacheKey)!;

    runInAction(() => {
      state.searchTerm = term;
    });

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
   * Генерирует Zod-схему валидации на основе FieldNode[].
   * @param fieldNodes Массив узлов полей формы.
   */
  buildSchema(fieldNodes: FieldNode[]): void {
    runInAction(() => {
      this.schema = buildZodSchemaFromPaths(fieldNodes);
    });
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
    // Кэш можно оставить, так как он может быть полезен при повторном использовании
  }
}
