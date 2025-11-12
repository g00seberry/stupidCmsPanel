import { rest } from '@/api/rest';
import { z } from 'zod';

/**
 * Схема ответа API генерации slug.
 */
const zSlugifyResponse = z.object({
  base: z.string(),
  unique: z.string(),
});

/**
 * Тип ответа API генерации slug.
 */
export type ZSlugifyResponse = z.infer<typeof zSlugifyResponse>;

/**
 * Генерирует slug из заголовка.
 * @param title Заголовок для преобразования в slug.
 * @param postType Опциональный slug типа записи для проверки уникальности.
 * @returns Объект с базовым и уникальным slug.
 */
export const slugify = async (title: string, postType?: string): Promise<ZSlugifyResponse> => {
  const params = new URLSearchParams({ title });
  if (postType) {
    params.append('postType', postType);
  }

  const response = await rest.get<ZSlugifyResponse>(`/api/v1/admin/utils/slugify?${params.toString()}`);
  return zSlugifyResponse.parse(response.data);
};

