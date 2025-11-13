import { rest } from '@/api/rest';
import { zTermsResponse, zTermResponse, zTermPayload } from '@/types/terms';
import type { ZTerm, ZTermPayload, ListTermsParams } from '@/types/terms';
import type { ZPaginationMeta, ZPaginationLinks } from '@/types/pagination';

const getAdminTermsUrl = (path: string): string => `/api/v1/admin/taxonomies${path}`;

/**
 * Загружает список терминов для указанной таксономии с фильтрами и пагинацией.
 * @param taxonomySlug Slug таксономии, для которой нужно получить термины.
 * @param params Параметры фильтрации, сортировки и пагинации.
 * @returns Объект с массивом терминов, метаданными пагинации и ссылками.
 * @example
 * const result = await listTerms('category', { q: 'guides', sort: 'name.asc', page: 1, per_page: 15 });
 * console.log(result.data); // Массив терминов
 * console.log(result.meta.total); // Общее количество
 */
export const listTerms = async (
  taxonomySlug: string,
  params?: ListTermsParams
): Promise<{
  data: ZTerm[];
  links: ZPaginationLinks;
  meta: ZPaginationMeta;
}> => {
  const response = await rest.get(getAdminTermsUrl(`/${taxonomySlug}/terms`), { params });
  const parsed = zTermsResponse.parse(response.data);
  return {
    data: parsed.data,
    links: parsed.links,
    meta: parsed.meta,
  };
};

/**
 * Загружает сведения о конкретном термине.
 * @param termId Уникальный идентификатор термина.
 * @returns Термин, прошедший валидацию схемой `zTerm`.
 */
export const getTerm = async (termId: number): Promise<ZTerm> => {
  const response = await rest.get(`/api/v1/admin/terms/${termId}`);
  return zTermResponse.parse(response.data).data;
};

/**
 * Создаёт новый термин в указанной таксономии.
 * @param taxonomySlug Slug таксономии, в которой создаётся термин.
 * @param payload Данные нового термина.
 * @returns Созданный термин.
 * @example
 * const newTerm = await createTerm('category', {
 *   name: 'Guides',
 *   slug: 'guides',
 *   meta_json: { color: '#ffcc00' }
 * });
 */
export const createTerm = async (
  taxonomySlug: string,
  payload: ZTermPayload
): Promise<ZTerm> => {
  const parsedPayload = zTermPayload.parse(payload);
  const response = await rest.post(getAdminTermsUrl(`/${taxonomySlug}/terms`), parsedPayload);
  return zTermResponse.parse(response.data).data;
};

/**
 * Обновляет существующий термин.
 * @param termId ID термина для обновления.
 * @param payload Новые значения полей термина.
 * @returns Обновлённый термин.
 */
export const updateTerm = async (
  termId: number,
  payload: ZTermPayload
): Promise<ZTerm> => {
  const parsedPayload = zTermPayload.parse(payload);
  const response = await rest.put(`/api/v1/admin/terms/${termId}`, parsedPayload);
  return zTermResponse.parse(response.data).data;
};

/**
 * Удаляет термин.
 * @param termId ID термина для удаления.
 * @param forceDetach Если `true`, автоматически отвязывает термин от всех записей. По умолчанию `false`.
 * @returns `true`, если удаление выполнено успешно.
 * @throws Ошибка, если термин не найден или привязан к записям (без `forceDetach=true`).
 * @example
 * // Обычное удаление (не удалит, если термин привязан к записям)
 * await deleteTerm(3);
 *
 * // Удаление с автоматической отвязкой от записей
 * await deleteTerm(3, true);
 */
export const deleteTerm = async (termId: number, forceDetach = false): Promise<boolean> => {
  const url = `/api/v1/admin/terms/${termId}`;
  const config = forceDetach ? { params: { forceDetach: '1' } } : undefined;
  await rest.delete(url, config);
  return true;
};

