import { rest } from '@/api/rest';
import { zEntriesResponse } from '@/types/entries';
import type { ZEntry, ZEntriesListParams } from '@/types/entries';
import type { ZPaginationMeta, ZPaginationLinks } from '@/types/pagination';

const getAdminEntriesUrl = (path: string): string => `/api/v1/admin/entries${path}`;

/**
 * Преобразует параметры запроса в query-параметры для URL.
 * @param params Параметры запроса списка записей.
 * @returns Объект с query-параметрами для Axios.
 */
const buildQueryParams = (params: ZEntriesListParams): Record<string, string | number | number[]> => {
  const queryParams: Record<string, string | number | number[]> = {};

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
export const listEntries = async (params: ZEntriesListParams = {}): Promise<{
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

