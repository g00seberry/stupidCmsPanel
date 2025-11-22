import { rest } from '@/api/rest';
import { zBlueprintEmbed } from '@/types/blueprintEmbed';
import type { ZBlueprintEmbed } from '@/types/blueprintEmbed';
import { z } from 'zod';

const getAdminEmbedsUrl = (path: string): string => `/api/v1/admin/embeds${path}`;
const getAdminBlueprintsEmbedsUrl = (blueprintId: number, path: string): string =>
  `/api/v1/admin/blueprints/${blueprintId}/embeds${path}`;

/**
 * Схема валидации ответа со списком встраиваний.
 */
const zEmbedsResponse = z.object({
  data: z.array(zBlueprintEmbed),
});

/**
 * Схема валидации ответа с одним встраиванием.
 */
const zEmbedResponse = z.object({
  data: zBlueprintEmbed,
});

/**
 * Схема валидации DTO для создания встраивания.
 */
const zCreateEmbedDto = z.object({
  /** Идентификатор Blueprint для встраивания. */
  embedded_blueprint_id: z.number(),
  /** Идентификатор поля-контейнера. Если не указан, встраивание происходит в корень. */
  host_path_id: z.number().optional(),
});

/**
 * Получить список встраиваний Blueprint.
 * @param blueprintId Идентификатор Blueprint-хозяина.
 * @returns Список всех встраиваний данного Blueprint.
 * @example
 * const embeds = await listEmbeds(1);
 * embeds.forEach(embed => {
 *   console.log(`${embed.embedded_blueprint?.name} встроен в ${embed.host_path?.full_path || 'корень'}`);
 * });
 */
export const listEmbeds = async (blueprintId: number): Promise<ZBlueprintEmbed[]> => {
  const response = await rest.get(getAdminBlueprintsEmbedsUrl(blueprintId, ''));
  return zEmbedsResponse.parse(response.data).data;
};

/**
 * Получить встраивание по ID.
 * @param id Идентификатор встраивания.
 * @returns Встраивание с полной информацией.
 * @example
 * const embed = await getEmbed(1);
 * console.log(embed.embedded_blueprint?.name); // 'Address'
 * console.log(embed.host_path?.full_path); // 'office' или null для корневого встраивания
 */
export const getEmbed = async (id: number): Promise<ZBlueprintEmbed> => {
  const response = await rest.get(getAdminEmbedsUrl(`/${id}`));
  return zEmbedResponse.parse(response.data).data;
};

/**
 * Создать встраивание.
 * @param blueprintId Идентификатор Blueprint-хозяина, в который встраивается другой Blueprint.
 * @param dto Данные для создания встраивания.
 * @returns Созданное встраивание.
 * @throws Ошибка, если встраивание создаст циклическую зависимость.
 * @throws Ошибка, если встраивание создаст конфликт путей.
 * @throws Ошибка, если встраивание дублируется.
 * @example
 * // Встраивание в корень
 * const embed = await createEmbed(1, {
 *   embedded_blueprint_id: 2
 * });
 * // Встраивание под поле
 * const nestedEmbed = await createEmbed(1, {
 *   embedded_blueprint_id: 2,
 *   host_path_id: 5
 * });
 */
export const createEmbed = async (
  blueprintId: number,
  dto: {
    embedded_blueprint_id: number;
    host_path_id?: number;
  }
): Promise<ZBlueprintEmbed> => {
  const parsedDto = zCreateEmbedDto.parse(dto);
  const response = await rest.post(getAdminBlueprintsEmbedsUrl(blueprintId, ''), parsedDto);
  return zEmbedResponse.parse(response.data).data;
};

/**
 * Удалить встраивание.
 * @param id Идентификатор встраивания для удаления.
 * @throws Ошибка, если встраивание не найдено.
 * @example
 * await deleteEmbed(1);
 * // Внимание: удаление встраивания приводит к удалению всех скопированных полей
 * // (с is_readonly = true) и потере всех данных в этих полях для всех Entry данного Blueprint
 */
export const deleteEmbed = async (id: number): Promise<void> => {
  await rest.delete(getAdminEmbedsUrl(`/${id}`));
};
