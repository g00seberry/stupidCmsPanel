import { rest } from '@/api/rest';
import type {
  ZEntriesListParams,
  ZEntry,
  ZEntryPayload,
  ZEntryTermsData,
  ZEntryTermsPayload,
} from '@/types/entries';
import {
  zEntriesResponse,
  zEntriesStatusesResponse,
  zEntryPayload,
  zEntryResponse,
  zEntryTermsPayload,
  zEntryTermsResponse,
} from '@/types/entries';
import type { ZPaginationLinks, ZPaginationMeta } from '@/types/pagination';
import type { ZId } from '@/types/ZId';

const getAdminEntriesUrl = (path: string): string => `/api/v1/admin/entries${path}`;

/**
 * Преобразует параметры запроса в query-параметры для URL.
 * @param params Параметры запроса списка записей.
 * @returns Объект с query-параметрами для Axios.
 */
const buildQueryParams = (
  params: ZEntriesListParams
): Record<string, number | ZId | number[] | ZId[]> => {
  const queryParams: Record<string, number | ZId | number[] | ZId[]> = {};

  if (params.post_type) {
    queryParams.post_type = params.post_type;
  }

  if (params.status && params.status !== 'all') {
    queryParams.status = params.status;
  }

  if (params.q) {
    queryParams.q = params.q;
  }

  if (params.author_id !== undefined) {
    queryParams.author_id = params.author_id;
  }

  if (params.term && params.term.length > 0) {
    // Используем специальный формат для массива term[] согласно API
    // Axios автоматически преобразует массив в формат term[]=1&term[]=2 при использовании paramsSerializer
    queryParams.term = params.term;
  }

  if (params.date_field) {
    queryParams.date_field = params.date_field;
  }

  if (params.date_from) {
    queryParams.date_from = params.date_from;
  }

  if (params.date_to) {
    queryParams.date_to = params.date_to;
  }

  if (params.sort) {
    queryParams.sort = params.sort;
  }

  if (params.per_page !== undefined) {
    queryParams.per_page = params.per_page;
  }

  if (params.page !== undefined) {
    queryParams.page = params.page;
  }

  return queryParams;
};

/**
 * Загружает список записей с фильтрами и пагинацией.
 * @param params Параметры фильтрации и пагинации.
 * @returns Объект с массивом записей, метаданными пагинации и ссылками.
 * @example
 * const result = await listEntries({
 *   post_type: 'article',
 *   status: 'published',
 *   per_page: 20,
 *   page: 1
 * });
 * console.log(result.data); // Массив записей
 * console.log(result.meta.total); // Общее количество
 */
export const listEntries = async (
  params: ZEntriesListParams = {}
): Promise<{
  data: ZEntry[];
  links: ZPaginationLinks;
  meta: ZPaginationMeta;
}> => {
  const queryParams = buildQueryParams(params);
  const response = await rest.get(getAdminEntriesUrl(''), { params: queryParams });
  const parsed = zEntriesResponse.parse(response.data);
  return {
    data: parsed.data,
    links: parsed.links,
    meta: parsed.meta,
  };
};

/**
 * Загружает список возможных статусов для записей.
 * @returns Массив строк со статусами записей.
 * @example
 * const statuses = await getEntriesStatuses();
 * console.log(statuses); // ['draft', 'published']
 */
export const getEntriesStatuses = async (): Promise<string[]> => {
  const response = await rest.get(getAdminEntriesUrl('/statuses'));
  const parsed = zEntriesStatusesResponse.parse(response.data);
  return parsed.data;
};

/**
 * Загружает сведения о конкретной записи по ID.
 * @param id Уникальный идентификатор записи.
 * @returns Запись, прошедшая валидацию схемой `zEntry`.
 * @example
 * const entry = await getEntry(42);
 * console.log(entry.title); // 'Headless CMS launch checklist'
 */
export const getEntry = async (id: ZId): Promise<ZEntry> => {
  const response = await rest.get(getAdminEntriesUrl(`/${id}`));
  const parsed = zEntryResponse.parse(response.data);
  return parsed.data;
};

/**
 * Создаёт новую запись.
 * @param payload Данные новой записи.
 * @returns Созданная запись.
 * @example
 * const newEntry = await createEntry({
 *   post_type: 'article',
 *   title: 'Headless CMS launch checklist',
 *   slug: 'launch-checklist',
 *   content_json: { hero: { title: 'Launch' } },
 *   meta_json: { title: 'Launch', description: 'Checklist' }
 * });
 */
export const createEntry = async (payload: ZEntryPayload): Promise<ZEntry> => {
  const parsedPayload = zEntryPayload.parse(payload);
  const response = await rest.post(getAdminEntriesUrl(''), parsedPayload);
  const parsed = zEntryResponse.parse(response.data);
  return parsed.data;
};

/**
 * Обновляет существующую запись.
 * @param id Идентификатор записи для обновления.
 * @param payload Новые значения полей записи.
 * @returns Обновлённая запись.
 * @example
 * const updatedEntry = await updateEntry(42, {
 *   title: 'Updated checklist',
 *   content_json: { body: { blocks: [] } }
 * });
 */
export const updateEntry = async (id: ZId, payload: ZEntryPayload): Promise<ZEntry> => {
  const response = await rest.put(getAdminEntriesUrl(`/${id}`), payload);
  const parsed = zEntryResponse.parse(response.data);
  return parsed.data;
};

/**
 * Загружает список термов, привязанных к записи.
 * @param entryId ID записи, для которой нужно получить термы.
 * @returns Данные о термах записи, включая группировку по таксономиям с полной информацией о таксономиях.
 * @example
 * const entryTerms = await getEntryTerms(42);
 * console.log(entryTerms.terms_by_taxonomy); // Массив группировок по таксономиям
 * // Каждая группа содержит полный объект таксономии и массив её термов
 * const firstGroup = entryTerms.terms_by_taxonomy[0];
 * console.log(firstGroup.taxonomy.label); // 'Categories'
 * console.log(firstGroup.terms); // Массив термов этой таксономии
 */
export const getEntryTerms = async (entryId: ZId): Promise<ZEntryTermsData> => {
  const response = await rest.get(getAdminEntriesUrl(`/${entryId}/terms`));
  const parsed = zEntryTermsResponse.parse(response.data);
  return parsed.data;
};

/**
 * Полная синхронизация термов записи.
 * Устанавливает указанный список термов как финальный (выполняет detach всех + attach указанных).
 * Полностью заменяет привязки термов записи.
 * @param entryId ID записи, для которой нужно синхронизировать термы.
 * @param termIds Массив ID терминов для установки (может быть пустым для очистки всех термов).
 * @returns Обновлённые данные о термах записи.
 * @throws {Error} Если запись не найдена (404), нет авторизации (401), ошибка валидации (422) или превышен лимит запросов (429).
 * @example
 * const updatedTerms = await syncEntryTerms(42, [3, 8]);
 * console.log(updatedTerms.terms_by_taxonomy); // Группировка по таксономиям с синхронизированными термами
 */
export const syncEntryTerms = async (entryId: ZId, termIds: ZId[]): Promise<ZEntryTermsData> => {
  const payload: ZEntryTermsPayload = { term_ids: termIds };
  const parsedPayload = zEntryTermsPayload.parse(payload);
  const response = await rest.put(getAdminEntriesUrl(`/${entryId}/terms/sync`), parsedPayload);
  const parsed = zEntryTermsResponse.parse(response.data);
  return parsed.data;
};
