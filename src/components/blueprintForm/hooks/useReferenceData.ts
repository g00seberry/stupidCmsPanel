import { useReferenceDataContext } from '../providers/ReferenceDataProvider';
import type { ReferenceQuery, ReferenceDataResult } from '../providers/ReferenceDataProvider.types';

/**
 * Хук для получения справочных данных.
 * Должен использоваться внутри ReferenceDataProvider.
 * @param query Запрос на получение справочных данных.
 * @returns Результат загрузки справочных данных.
 * @throws {Error} Если используется вне ReferenceDataProvider.
 * @example
 * const { loading, options, search } = useReferenceData({
 *   resource: 'entries',
 *   params: { per_page: 50 }
 * });
 */
export const useReferenceData = (query: ReferenceQuery): ReferenceDataResult => {
  const { useReferenceData: useReferenceDataFromContext } = useReferenceDataContext();
  return useReferenceDataFromContext(query);
};
