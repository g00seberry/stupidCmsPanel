import { rest } from '@/api/rest';
import { zPostTypePayload, zPostTypesResponse, zPostTypeResponse } from '@/types/postTypes';
import type { ZPostType, ZPostTypePayload } from '@/types/postTypes';
import type { ZId } from '@/types/ZId';

const getAdminPostTypesUrl = (path: string): string => `/api/v1/admin/post-types${path}`;

/**
 * Загружает список доступных типов контента.
 * @returns Массив типов контента, прошедших валидацию схемой `zPostType`.
 * @example
 * const postTypes = await listPostTypes();
 * postTypes.forEach(type => {
 *   console.log(`${type.name} (${type.slug})`);
 * });
 */
export const listPostTypes = async (): Promise<ZPostType[]> => {
  const response = await rest.get(getAdminPostTypesUrl(''));
  return zPostTypesResponse.parse(response.data).data;
};

/**
 * Загружает сведения о конкретном типе контента.
 * @param id Уникальный идентификатор типа контента.
 * @returns Тип контента, прошедший валидацию схемой `zPostType`.
 */
export const getPostType = async (id: ZId): Promise<ZPostType> => {
  const response = await rest.get(getAdminPostTypesUrl(`/${id}`));
  return zPostTypeResponse.parse(response.data).data;
};

/**
 * Создаёт новый тип контента.
 * @param payload Данные нового типа контента.
 * @returns Созданный тип контента.
 * @example
 * const newType = await createPostType({
 *   slug: 'product',
 *   name: 'Products',
 *   options_json: { fields: { price: { type: 'number' } } }
 * });
 */
export const createPostType = async (payload: ZPostTypePayload): Promise<ZPostType> => {
  const parsedPayload = zPostTypePayload.parse(payload);
  const response = await rest.post(getAdminPostTypesUrl(''), parsedPayload);
  return zPostTypeResponse.parse(response.data).data;
};

/**
 * Обновляет существующий тип контента.
 * @param id ID типа контента.
 * @param payload Новые значения полей типа контента.
 * @returns Обновлённый тип контента.
 */
export const updatePostType = async (id: ZId, payload: ZPostTypePayload): Promise<ZPostType> => {
  const parsedPayload = zPostTypePayload.parse(payload);
  const response = await rest.put(getAdminPostTypesUrl(`/${id}`), parsedPayload);
  return zPostTypeResponse.parse(response.data).data;
};

/**
 * Удаляет тип контента.
 * @param id ID типа контента для удаления.
 * @param force Если `true`, каскадно удаляет все записи этого типа. По умолчанию `false`.
 * @returns `true`, если удаление выполнено успешно.
 * @throws Ошибка, если тип контента не найден или содержит записи (без `force=true`).
 * @example
 * // Обычное удаление (не удалит, если есть записи)
 * await deletePostType(1);
 *
 * // Каскадное удаление (удалит тип и все его записи)
 * await deletePostType(1, true);
 */
export const deletePostType = async (id: ZId, force = false): Promise<boolean> => {
  const url = getAdminPostTypesUrl(`/${id}`);
  const config = force ? { params: { force: '1' } } : undefined;
  await rest.delete(url, config);
  return true;
};
