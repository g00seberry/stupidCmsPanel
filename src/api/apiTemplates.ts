import { rest } from '@/api/rest';
import { zTemplatesResponse, type ZTemplate, type ZTemplatesResponse } from '@/types/templates';

/**
 * Получает список доступных шаблонов через API.
 * @returns Массив объектов шаблонов с полями name, path, exists.
 * @example
 * const templates = await getTemplates();
 * console.log(templates[0].name); // 'pages.show'
 * console.log(templates[0].path); // 'pages/show.blade.php'
 */
export const getTemplates = async (): Promise<ZTemplate[]> => {
  const response = await rest.get<ZTemplatesResponse>('/api/v1/admin/templates');
  const parsed = zTemplatesResponse.parse(response.data);
  return parsed.data;
};
