import { rest } from '@/api/rest';
import { zPostTypePayload, zPostTypesResponse, zPostTypeResponse } from '@/types/postTypes';
import type { ZPostType, ZPostTypePayload } from '@/types/postTypes';

const getAdminPostTypesUrl = (path: string): string => `/api/v1/admin/post-types${path}`;

/**
 * Загружает список доступных типов контента.
 * @returns Массив типов контента, прошедших валидацию схемой `zPostType`.
 */
export const listPostTypes = async (): Promise<ZPostType[]> => {
  const response = await rest.get(getAdminPostTypesUrl(''));
  return zPostTypesResponse.parse(response.data).data;
};

/**
 * Загружает сведения о конкретном типе контента.
 * @param slug Уникальный идентификатор типа контента.
 * @returns Тип контента, прошедший валидацию схемой `zPostType`.
 */
export const getPostType = async (slug: string): Promise<ZPostType> => {
  const response = await rest.get(getAdminPostTypesUrl(`/${slug}`));
  return zPostTypeResponse.parse(response.data).data;
};

/**
 * Создаёт новый тип контента.
 * @param payload Данные нового типа контента.
 * @returns Созданный тип контента.
 */
export const createPostType = async (payload: ZPostTypePayload): Promise<ZPostType> => {
  const parsedPayload = zPostTypePayload.parse(payload);
  const response = await rest.post(getAdminPostTypesUrl(''), parsedPayload);
  return zPostTypeResponse.parse(response.data).data;
};

/**
 * Обновляет существующий тип контента.
 * @param slug Текущий slug (идентификатор) типа контента.
 * @param payload Новые значения полей типа контента.
 * @returns Обновлённый тип контента.
 */
export const updatePostType = async (
  slug: string,
  payload: ZPostTypePayload
): Promise<ZPostType> => {
  const parsedPayload = zPostTypePayload.parse(payload);
  const response = await rest.put(getAdminPostTypesUrl(`/${slug}`), parsedPayload);
  return zPostTypeResponse.parse(response.data).data;
};
