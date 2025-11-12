import { rest } from '@/api/rest';
import { z } from 'zod';

const getAdminUtilsUrl = (part: string) => {
  return `/api/v1/admin/utils${part}`;
};
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

/**
 * Схема ответа API получения списка шаблонов.
 */
const zTemplatesResponse = z.object({
  data: z.array(z.string()),
});

/**
 * Тип ответа API получения списка шаблонов.
 */
export type ZTemplatesResponse = z.infer<typeof zTemplatesResponse>;

/**
 * Получает список доступных шаблонов через API.
 * @returns Массив имён шаблонов.
 * @example
 * const templates = await getTemplates();
 * console.log(templates); // ['pages.show', 'home.default', 'welcome']
 */
export const getTemplates = async (): Promise<string[]> => {
  const response = await rest.get<ZTemplatesResponse>(getAdminUtilsUrl('/templates'));
  const parsed = zTemplatesResponse.parse(response.data);
  return parsed.data;
};
