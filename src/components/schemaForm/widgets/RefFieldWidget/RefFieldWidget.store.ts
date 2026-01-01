import { searchEntries } from '@/api/apiEntries';
import { PaginatedDataLoader } from '@/components/PaginatedTable/paginatedDataLoader';
import { PaginatedTableStore } from '@/components/PaginatedTable/PaginatedTableStore';
import type { ZEntry, ZEntriesSearchFilters } from '@/types/entries';
import type { ZId } from '@/types/ZId';
import { refFieldConstants } from './RefFieldWidget.constants';

/**
 * Создаёт экземпляр store для пагинированной таблицы выбора записей.
 * @param allowedPostTypeIds Массив разрешённых ID типов контента для фильтрации.
 * @returns Экземпляр PaginatedTableStore для работы с записями.
 */
export const createRefFieldStore = (
  allowedPostTypeIds: ZId[]
): PaginatedTableStore<ZEntry, ZEntriesSearchFilters> => {
  const filters: ZEntriesSearchFilters =
    allowedPostTypeIds.length > 0 ? { post_type_ids: allowedPostTypeIds } : {};

  const loader = new PaginatedDataLoader<ZEntry, ZEntriesSearchFilters>(searchEntries, {
    filters,
    pagination: {
      page: 1,
      per_page: refFieldConstants.perPage,
    },
  });

  return new PaginatedTableStore<ZEntry, ZEntriesSearchFilters>(loader, 'id');
};
