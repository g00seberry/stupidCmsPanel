import { rest } from '@/api/rest';
import { zSlugifyResponse, type ZSlugifyResponse } from '@/types/slugify';

const getAdminUtilsUrl = (part: string) => {
  return `/api/v1/admin/utils${part}`;
};

/**
 * Генерирует slug из заголовка через API.
 * Создаёт URL-friendly строку из текста и проверяет уникальность.
 * @param title Заголовок для преобразования в slug.
 * @param postType Опциональный slug типа записи для проверки уникальности в рамках этого типа.
 * @returns Объект с базовым и уникальным slug (если базовый уже занят).
 * @example
 * const result = await slugify('Моя первая статья');
 * console.log(result.base); // 'moya-pervaya-statya'
 * console.log(result.unique); // 'moya-pervaya-statya-1' (если базовый занят)
 */
export const slugify = async (title: string, postType?: string): Promise<ZSlugifyResponse> => {
  const response = await rest.get<ZSlugifyResponse>(getAdminUtilsUrl('/slugify'), {
    params: { title, postType },
  });
  return zSlugifyResponse.parse(response.data);
};
