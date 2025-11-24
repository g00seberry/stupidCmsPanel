import { rest } from '@/api/rest';
import type { ZEditComponent } from '@/components/schemaForm/componentDefs/ZComponent';
import { z } from 'zod';
import { zFormConfigResponse, zFormConfigSaveResponse } from '@/types/formConfig';

const getAdminFormConfigUrl = (postTypeSlug: string, blueprintId: number): string =>
  `/api/v1/admin/post-types/${postTypeSlug}/form-config/${blueprintId}`;

/**
 * Получает сохранённую конфигурацию формы для типа контента и blueprint.
 * @param postTypeSlug Slug типа контента.
 * @param blueprintId Идентификатор blueprint.
 * @returns Конфигурация формы (объект, где ключ - путь к узлу, значение - конфигурация компонента).
 * @throws Ошибка, если тип контента не найден (404) или произошла ошибка сети.
 * @example
 * const config = await getFormConfig('article', 1);
 * console.log(config['title']); // { name: 'inputText', props: { label: 'Заголовок' } }
 */
export const getFormConfig = async (
  postTypeSlug: string,
  blueprintId: number
): Promise<Record<string, ZEditComponent>> => {
  const response = await rest.get(getAdminFormConfigUrl(postTypeSlug, blueprintId));
  return zFormConfigResponse.parse(response.data);
};

/**
 * Сохраняет или обновляет конфигурацию формы для типа контента и blueprint.
 * @param postTypeSlug Slug типа контента.
 * @param blueprintId Идентификатор blueprint.
 * @param config Конфигурация формы для сохранения (объект, где ключ - путь к узлу, значение - конфигурация компонента).
 * @returns Ответ API с сохранённой конфигурацией.
 * @throws Ошибка валидации, если данные некорректны, или ошибка сети.
 * @example
 * await saveFormConfig('article', 1, {
 *   'title': { name: 'inputText', props: { label: 'Заголовок', placeholder: 'Введите заголовок' } },
 *   'author.name': { name: 'inputText', props: { label: 'Имя автора' } }
 * });
 */
export const saveFormConfig = async (
  postTypeSlug: string,
  blueprintId: number,
  config: Record<string, ZEditComponent>
): Promise<z.infer<typeof zFormConfigSaveResponse>> => {
  const response = await rest.put(getAdminFormConfigUrl(postTypeSlug, blueprintId), {
    config_json: config,
  });

  return zFormConfigSaveResponse.parse(response.data);
};

/**
 * Удаляет конфигурацию формы для типа контента и blueprint.
 * @param postTypeSlug Slug типа контента.
 * @param blueprintId Идентификатор blueprint.
 * @throws Ошибка, если конфигурация не найдена (404) или произошла ошибка сети.
 * @example
 * await deleteFormConfig('article', 1);
 */
export const deleteFormConfig = async (
  postTypeSlug: string,
  blueprintId: number
): Promise<void> => {
  await rest.delete(getAdminFormConfigUrl(postTypeSlug, blueprintId));
};
