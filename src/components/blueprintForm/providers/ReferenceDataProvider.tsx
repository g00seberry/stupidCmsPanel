import { createContext, useContext, useCallback, useState, useEffect, useMemo, useRef } from 'react';
import type React from 'react';
import { listEntries } from '@/api/apiEntries';
import type { ZEntry } from '@/types/entries';
import { onError } from '@/utils/onError';
import type { ReferenceQuery, ReferenceOption, ReferenceDataResult } from './ReferenceDataProvider.types';

/**
 * Контекст для работы со справочными данными.
 */
interface ReferenceDataContextValue {
  /**
   * Хук для получения справочных данных.
   * @param query Запрос на получение данных.
   * @returns Результат загрузки справочных данных.
   */
  useReferenceData: (query: ReferenceQuery) => ReferenceDataResult;
}

const ReferenceDataContext = createContext<ReferenceDataContextValue | null>(null);

/**
 * Кэш для справочных данных.
 * Ключ: строка вида "resource:JSON.stringify(params)"
 */
const dataCache = new Map<string, { data: ReferenceOption[]; timestamp: number }>();

/**
 * Время жизни кэша в миллисекундах (5 минут).
 */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Генерирует ключ кэша из запроса.
 */
const getCacheKey = (query: ReferenceQuery): string => {
  const paramsStr = query.params ? JSON.stringify(query.params) : '';
  return `${query.resource}:${paramsStr}`;
};

/**
 * Загружает справочные данные для ресурса 'entries'.
 */
const loadEntriesData = async (params?: Record<string, unknown>): Promise<ReferenceOption[]> => {
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
};

/**
 * Загружает справочные данные для указанного ресурса.
 */
const loadReferenceData = async (query: ReferenceQuery): Promise<ReferenceOption[]> => {
  switch (query.resource) {
    case 'entries':
      return loadEntriesData(query.params);
    // TODO: добавить поддержку других ресурсов (users, categories и т.д.)
    default:
      console.warn(`Unknown reference resource: ${query.resource}`);
      return [];
  }
};

/**
 * Внутренний хук для получения справочных данных.
 * Используется внутри ReferenceDataProvider.
 */
export const useReferenceDataInternal = (query: ReferenceQuery): ReferenceDataResult => {
  const cacheKey = getCacheKey(query);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [options, setOptions] = useState<ReferenceOption[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Проверяем кэш
  const cached = dataCache.get(cacheKey);
  const isCacheValid = cached && Date.now() - cached.timestamp < CACHE_TTL;

  useEffect(() => {
    if (isCacheValid && cached) {
      // Используем данные из кэша
      setOptions(cached.data);
      return;
    }

    // Загружаем данные
    const loadData = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const data = await loadReferenceData(query);
        setOptions(data);
        // Сохраняем в кэш
        dataCache.set(cacheKey, { data, timestamp: Date.now() });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load reference data');
        setError(error);
        onError(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [cacheKey, isCacheValid, query]);

  // Ref для хранения timeoutId debounce
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Функция поиска с debounce
  const search = useCallback(
    (term: string) => {
      setSearchTerm(term);

      // Очищаем предыдущий timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Если поиск пустой, загружаем обычные данные
      if (!term) {
        const loadData = async () => {
          setLoading(true);
          try {
            const data = await loadReferenceData(query);
            setOptions(data);
            dataCache.set(cacheKey, { data, timestamp: Date.now() });
          } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to load reference data');
            setError(error);
            onError(error);
          } finally {
            setLoading(false);
          }
        };
        loadData();
        return;
      }

      // Debounce поиска (300ms)
      searchTimeoutRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const searchQuery = { ...query, params: { ...query.params, q: term } };
          const searchKey = getCacheKey(searchQuery);
          const data = await loadReferenceData(searchQuery);
          setOptions(data);
          dataCache.set(searchKey, { data, timestamp: Date.now() });
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to search reference data');
          setError(error);
          onError(error);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [query, cacheKey]
  );

  // Очищаем timeout при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Фильтруем опции по поисковому запросу, если он есть
  const filteredOptions = useMemo(() => {
    if (!searchTerm) {
      return options;
    }
    return options.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [options, searchTerm]);

  return {
    loading,
    error,
    options: filteredOptions,
    search,
  };
};

/**
 * Провайдер для работы со справочными данными.
 * Обеспечивает кэширование и единообразный доступ к справочникам.
 */
export const ReferenceDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useReferenceData = useCallback(
    (query: ReferenceQuery): ReferenceDataResult => {
      return useReferenceDataInternal(query);
    },
    []
  );

  const value = useMemo(() => ({ useReferenceData }), [useReferenceData]);

  return <ReferenceDataContext.Provider value={value}>{children}</ReferenceDataContext.Provider>;
};

/**
 * Хук для использования ReferenceDataProvider.
 * @throws {Error} Если используется вне ReferenceDataProvider.
 */
export const useReferenceDataContext = (): ReferenceDataContextValue => {
  const context = useContext(ReferenceDataContext);
  if (!context) {
    throw new Error('useReferenceDataContext must be used within ReferenceDataProvider');
  }
  return context;
};

