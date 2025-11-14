import { rest } from '@/api/rest';
import { zTaxonomyPayload, zTaxonomiesResponse, zTaxonomyResponse } from '@/types/taxonomies';
import type { ZTaxonomy, ZTaxonomyPayload } from '@/types/taxonomies';
import type { ZId } from '@/types/ZId';

const getAdminTaxonomiesUrl = (path: string): string => `/api/v1/admin/taxonomies${path}`;

/**
 * Параметры запроса списка таксономий.
 */
export type ListTaxonomiesParams = {
  /** Поиск по label. */
  q?: string;
  /** Сортировка. Values: created_at.desc,created_at.asc,label.asc,label.desc. Default: created_at.desc. */
  sort?: string;
  /** Размер страницы (10-100). Default: 15. */
  per_page?: number;
};

/**
 * Загружает список доступных таксономий.
 * @param params Параметры фильтрации и сортировки.
 * @returns Массив таксономий, прошедших валидацию схемой `zTaxonomy`.
 * @example
 * const taxonomies = await listTaxonomies();
 * taxonomies.forEach(taxonomy => {
 *   console.log(`${taxonomy.label} (ID: ${taxonomy.id})`);
 * });
 */
export const listTaxonomies = async (params?: ListTaxonomiesParams): Promise<ZTaxonomy[]> => {
  const response = await rest.get(getAdminTaxonomiesUrl(''), { params });
  return zTaxonomiesResponse.parse(response.data).data;
};

/**
 * Загружает сведения о конкретной таксономии.
 * @param id ID таксономии.
 * @returns Таксономия, прошедшая валидацию схемой `zTaxonomy`.
 */
export const getTaxonomy = async (id: ZId): Promise<ZTaxonomy> => {
  const response = await rest.get(getAdminTaxonomiesUrl(`/${id}`));
  return zTaxonomyResponse.parse(response.data).data;
};

/**
 * Создаёт новую таксономию.
 * @param payload Данные новой таксономии.
 * @returns Созданная таксономия.
 * @example
 * const newTaxonomy = await createTaxonomy({
 *   label: 'Categories',
 *   hierarchical: false,
 *   options_json: { color: '#ffcc00' }
 * });
 */
export const createTaxonomy = async (payload: ZTaxonomyPayload): Promise<ZTaxonomy> => {
  const parsedPayload = zTaxonomyPayload.parse(payload);
  const response = await rest.post(getAdminTaxonomiesUrl(''), parsedPayload);
  return zTaxonomyResponse.parse(response.data).data;
};

/**
 * Обновляет существующую таксономию.
 * @param id ID таксономии.
 * @param payload Новые значения полей таксономии.
 * @returns Обновлённая таксономия.
 */
export const updateTaxonomy = async (id: ZId, payload: ZTaxonomyPayload): Promise<ZTaxonomy> => {
  const parsedPayload = zTaxonomyPayload.parse(payload);
  const response = await rest.put(getAdminTaxonomiesUrl(`/${id}`), parsedPayload);
  return zTaxonomyResponse.parse(response.data).data;
};

/**
 * Удаляет таксономию.
 * @param id ID таксономии для удаления.
 * @param force Если `true`, каскадно удаляет все термины этой таксономии. По умолчанию `false`.
 * @returns `true`, если удаление выполнено успешно.
 * @throws Ошибка, если таксономия не найдена или содержит термины (без `force=true`).
 * @example
 * // Обычное удаление (не удалит, если есть термины)
 * await deleteTaxonomy(1);
 *
 * // Каскадное удаление (удалит таксономию и все её термины)
 * await deleteTaxonomy(1, true);
 */
export const deleteTaxonomy = async (id: ZId, force = false): Promise<boolean> => {
  const url = getAdminTaxonomiesUrl(`/${id}`);
  const config = force ? { params: { force: '1' } } : undefined;
  await rest.delete(url, config);
  return true;
};
