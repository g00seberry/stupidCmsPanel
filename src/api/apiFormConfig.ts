import { rest } from '@/api/rest';
import type { ZEditComponent } from '@/components/schemaForm/ZComponent';
import { z } from 'zod';
import { zFormConfigResponse, zFormConfigSaveResponse } from '@/types/formConfig';
import type { ZId } from '@/types/ZId';

const getAdminFormConfigUrl = (postTypeId: ZId, blueprintId: ZId): string =>
  `/api/v1/admin/post-types/${postTypeId}/form-config/${blueprintId}`;

/**
 * Получает сохранённую конфигурацию формы для типа контента и blueprint.
 * @param postTypeId ID типа контента.
 * @param blueprintId Идентификатор blueprint.
 * @returns Конфигурация формы (объект, где ключ - путь к узлу, значение - конфигурация компонента).
 * @throws Ошибка, если тип контента не найден (404) или произошла ошибка сети.
 * @example
 * const config = await getFormConfig(1, 1);
 * console.log(config['title']); // { name: 'inputText', props: { label: 'Заголовок' } }
 */
export const getFormConfig = async (
  postTypeId: ZId,
  blueprintId: ZId
): Promise<Record<string, ZEditComponent>> => {
  const response = await rest.get(getAdminFormConfigUrl(postTypeId, blueprintId));
  return zFormConfigResponse.parse(response.data);
};

/**
 * Сохраняет или обновляет конфигурацию формы для типа контента и blueprint.
 * @param postTypeId ID типа контента.
 * @param blueprintId Идентификатор blueprint.
 * @param config Конфигурация формы для сохранения (объект, где ключ - путь к узлу, значение - конфигурация компонента).
 * @returns Ответ API с сохранённой конфигурацией.
 * @throws Ошибка валидации, если данные некорректны, или ошибка сети.
 * @example
 * await saveFormConfig(1, 1, {
 *   'title': { name: 'inputText', props: { label: 'Заголовок', placeholder: 'Введите заголовок' } },
 *   'author.name': { name: 'inputText', props: { label: 'Имя автора' } }
 * });
 */
export const saveFormConfig = async (
  postTypeId: ZId,
  blueprintId: ZId,
  config: Record<string, ZEditComponent>
): Promise<z.infer<typeof zFormConfigSaveResponse>> => {
  const response = await rest.put(getAdminFormConfigUrl(postTypeId, blueprintId), {
    config_json: config,
  });

  return zFormConfigSaveResponse.parse(response.data);
};

/**
 * Удаляет конфигурацию формы для типа контента и blueprint.
 * @param postTypeId ID типа контента.
 * @param blueprintId Идентификатор blueprint.
 * @throws Ошибка, если конфигурация не найдена (404) или произошла ошибка сети.
 * @example
 * await deleteFormConfig(1, 1);
 */
export const deleteFormConfig = async (postTypeId: ZId, blueprintId: ZId): Promise<void> => {
  await rest.delete(getAdminFormConfigUrl(postTypeId, blueprintId));
};
