import { rest } from '@/api/rest';
import { zCreatePathDto, zUpdatePathDto, zPathsResponse, zPathResponse } from '@/types/path';
import type { ZPath, ZCreatePathDto, ZUpdatePathDto } from '@/types/path';

const getAdminPathsUrl = (path: string): string => `/api/v1/admin/paths${path}`;
const getAdminBlueprintsPathsUrl = (blueprintId: number, path: string): string =>
  `/api/v1/admin/blueprints/${blueprintId}/paths${path}`;

/**
 * Получить дерево полей Blueprint.
 * @param blueprintId Идентификатор Blueprint.
 * @returns Иерархическое дерево полей (собственные + материализованные из встроенных Blueprint).
 * @example
 * const paths = await listPaths(1);
 * paths.forEach(path => {
 *   console.log(`${path.full_path} (${path.data_type})`);
 *   if (path.children) {
 *     path.children.forEach(child => console.log(`  - ${child.full_path}`));
 *   }
 * });
 */
export const listPaths = async (blueprintId: number): Promise<ZPath[]> => {
  const response = await rest.get(getAdminBlueprintsPathsUrl(blueprintId, ''));
  return zPathsResponse.parse(response.data).data;
};

/**
 * Получить Path по ID.
 * @param id Идентификатор поля.
 * @returns Поле с полной информацией (включая дочерние поля, если есть).
 * @example
 * const path = await getPath(5);
 * console.log(path.full_path); // 'author.contacts.phone'
 * console.log(path.is_readonly); // true (если скопировано из другого Blueprint)
 */
export const getPath = async (id: number): Promise<ZPath> => {
  const response = await rest.get(getAdminPathsUrl(`/${id}`));
  return zPathResponse.parse(response.data).data;
};

/**
 * Создать новое поле.
 * @param blueprintId Идентификатор Blueprint, в который добавляется поле.
 * @param dto Данные для создания поля.
 * @returns Созданное поле.
 * @throws Ошибка валидации, если данные некорректны или имя конфликтует с существующими полями.
 * @example
 * const path = await createPath(1, {
 *   name: 'title',
 *   data_type: 'string',
 *   is_indexed: true,
 *   validation_rules: { required: true }
 * });
 * // Для вложенного поля:
 * const nestedPath = await createPath(1, {
 *   name: 'email',
 *   parent_id: 5,
 *   data_type: 'string'
 * });
 */
export const createPath = async (blueprintId: number, dto: ZCreatePathDto): Promise<ZPath> => {
  const parsedDto = zCreatePathDto.parse(dto);
  const response = await rest.post(getAdminBlueprintsPathsUrl(blueprintId, ''), parsedDto);
  return zPathResponse.parse(response.data).data;
};

/**
 * Обновить поле.
 * @param id Идентификатор поля.
 * @param dto Данные для обновления (только изменяемые поля).
 * @returns Обновлённое поле.
 * @throws Ошибка, если поле имеет `is_readonly: true` (скопировано из другого Blueprint).
 * @throws Ошибка валидации, если данные некорректны или имя конфликтует.
 * @example
 * const updated = await updatePath(1, {
 *   name: 'updated_title',
 *   validation_rules: { required: false }
 * });
 * // При изменении name или parent_id автоматически пересчитывается full_path для всех дочерних полей
 */
export const updatePath = async (id: number, dto: ZUpdatePathDto): Promise<ZPath> => {
  const parsedDto = zUpdatePathDto.parse(dto);
  const response = await rest.put(getAdminPathsUrl(`/${id}`), parsedDto);
  return zPathResponse.parse(response.data).data;
};

/**
 * Удалить поле.
 * @param id Идентификатор поля для удаления.
 * @throws Ошибка, если поле не найдено или имеет `is_readonly: true`.
 * @example
 * await deletePath(1);
 * // Внимание: удаление поля приводит к каскадному удалению всех дочерних полей
 * // и потере всех данных в этих полях для всех Entry данного Blueprint
 */
export const deletePath = async (id: number): Promise<void> => {
  await rest.delete(getAdminPathsUrl(`/${id}`));
};
