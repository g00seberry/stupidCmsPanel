import { rest } from '@/api/rest';
import { zTaxonomyPayload, zTaxonomiesResponse, zTaxonomyResponse } from '@/types/taxonomies';
import type { ZTaxonomy, ZTaxonomyPayload } from '@/types/taxonomies';

const getAdminTaxonomiesUrl = (path: string): string => `/api/v1/admin/taxonomies${path}`;

/**
 * Параметры запроса списка таксономий.
 */
export type ListTaxonomiesParams = {
  /** Поиск по slug/label. */
  q?: string;
  /** Сортировка. Values: created_at.desc,created_at.asc,slug.asc,slug.desc,label.asc,label.desc. Default: created_at.desc. */
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
 *   console.log(`${taxonomy.label} (${taxonomy.slug})`);
 * });
 */
export const listTaxonomies = async (params?: ListTaxonomiesParams): Promise<ZTaxonomy[]> => {
  const response = await rest.get(getAdminTaxonomiesUrl(''), { params });
  return zTaxonomiesResponse.parse(response.data).data;
};

/**
 * Загружает сведения о конкретной таксономии.
 * @param slug Уникальный идентификатор таксономии.
 * @returns Таксономия, прошедшая валидацию схемой `zTaxonomy`.
 */
export const getTaxonomy = async (slug: string): Promise<ZTaxonomy> => {
  const response = await rest.get(getAdminTaxonomiesUrl(`/${slug}`));
  return zTaxonomyResponse.parse(response.data).data;
};

/**
 * Создаёт новую таксономию.
 * @param payload Данные новой таксономии.
 * @returns Созданная таксономия.
 * @example
 * const newTaxonomy = await createTaxonomy({
 *   label: 'Categories',
 *   slug: 'category',
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
 * @param slug Текущий slug (идентификатор) таксономии.
 * @param payload Новые значения полей таксономии.
 * @returns Обновлённая таксономия.
 */
export const updateTaxonomy = async (
  slug: string,
  payload: ZTaxonomyPayload
): Promise<ZTaxonomy> => {
  const parsedPayload = zTaxonomyPayload.parse(payload);
  const response = await rest.put(getAdminTaxonomiesUrl(`/${slug}`), parsedPayload);
  return zTaxonomyResponse.parse(response.data).data;
};

/**
 * Удаляет таксономию.
 * @param slug Slug таксономии для удаления.
 * @param force Если `true`, каскадно удаляет все термины этой таксономии. По умолчанию `false`.
 * @returns `true`, если удаление выполнено успешно.
 * @throws Ошибка, если таксономия не найдена или содержит термины (без `force=true`).
 * @example
 * // Обычное удаление (не удалит, если есть термины)
 * await deleteTaxonomy('category');
 *
 * // Каскадное удаление (удалит таксономию и все её термины)
 * await deleteTaxonomy('category', true);
 */
export const deleteTaxonomy = async (slug: string, force = false): Promise<boolean> => {
  const url = getAdminTaxonomiesUrl(`/${slug}`);
  const config = force ? { params: { force: '1' } } : undefined;
  await rest.delete(url, config);
  return true;
};

