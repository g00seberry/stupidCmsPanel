import { rest } from '@/api/rest';
import type {
  LoaderParams,
  LoadPaginatedDataFn,
} from '@/components/PaginatedTable/paginatedDataLoader';
import type {
  ZBlueprint,
  ZBlueprintListItem,
  ZCreateBlueprintDto,
  ZUpdateBlueprintDto,
} from '@/types/blueprint';
import {
  zBlueprint,
  zBlueprintListItem,
  zCreateBlueprintDto,
  zEmbeddableBlueprints,
  zPaginatedResponse,
  zUpdateBlueprintDto,
} from '@/types/blueprint';
import type { ZBlueprintSchema } from '@/types/blueprintSchema';
import { zBlueprintSchema } from '@/types/blueprintSchema';
import type { ZId } from '@/types/ZId';
import { z } from 'zod';

const getAdminBlueprintsUrl = (path: string): string => `/api/v1/admin/blueprints${path}`;

/**
 * Схема валидации ответа со списком Blueprint.
 */
const zBlueprintsResponse = zPaginatedResponse(zBlueprintListItem);

/**
 * Схема валидации ответа с одним Blueprint.
 */
const zBlueprintResponse = z.object({
  data: zBlueprint,
});

/**
 * Фильтры для списка Blueprint (без параметров пагинации).
 */
export type BlueprintListFilters = {
  /** Поисковый запрос. */
  search?: string;
};

/**
 * Получить список Blueprint с пагинацией и фильтрацией.
 * @param params Параметры фильтрации и пагинации.
 * @returns Пагинированный список Blueprint.
 * @example
 * const result = await listBlueprints({
 *   filters: { search: 'article', sort_by: 'name', sort_dir: 'asc' },
 *   pagination: { per_page: 25, page: 1 }
 * });
 * console.log(result.data); // Массив Blueprint
 * console.log(result.meta.total); // Общее количество
 */
export const listBlueprints: LoadPaginatedDataFn<ZBlueprintListItem, BlueprintListFilters> = async (
  params: LoaderParams<BlueprintListFilters>
) => {
  const url = getAdminBlueprintsUrl('');
  const response = await rest.get(url, { params });
  return zBlueprintsResponse.parse(response.data);
};

/**
 * Получить Blueprint по ID.
 * @param id Идентификатор Blueprint.
 * @returns Blueprint с полной информацией.
 * @example
 * const blueprint = await getBlueprint(1);
 * console.log(blueprint.name); // 'Article'
 * console.log(blueprint.post_types); // Массив типов контента
 */
export const getBlueprint = async (id: ZId): Promise<ZBlueprint> => {
  const response = await rest.get(getAdminBlueprintsUrl(`/${id}`));
  return zBlueprintResponse.parse(response.data).data;
};

/**
 * Создать новый Blueprint.
 * @param dto Данные для создания Blueprint.
 * @returns Созданный Blueprint.
 * @throws Ошибка валидации, если данные некорректны или code уже существует.
 * @example
 * const blueprint = await createBlueprint({
 *   name: 'Article',
 *   code: 'article',
 *   description: 'Blog article structure'
 * });
 */
export const createBlueprint = async (dto: ZCreateBlueprintDto): Promise<ZBlueprint> => {
  const parsedDto = zCreateBlueprintDto.parse(dto);
  const response = await rest.post(getAdminBlueprintsUrl(''), parsedDto);
  return zBlueprintResponse.parse(response.data).data;
};

/**
 * Обновить Blueprint.
 * @param id Идентификатор Blueprint.
 * @param dto Данные для обновления (только изменяемые поля).
 * @returns Обновлённый Blueprint.
 * @throws Ошибка валидации, если данные некорректны или code уже используется другим Blueprint.
 * @example
 * const updated = await updateBlueprint(1, {
 *   name: 'Article Updated',
 *   description: 'Updated description'
 * });
 */
export const updateBlueprint = async (id: ZId, dto: ZUpdateBlueprintDto): Promise<ZBlueprint> => {
  const parsedDto = zUpdateBlueprintDto.parse(dto);
  const response = await rest.put(getAdminBlueprintsUrl(`/${id}`), parsedDto);
  return zBlueprintResponse.parse(response.data).data;
};

/**
 * Удалить Blueprint.
 * @param id Идентификатор Blueprint для удаления.
 * @throws Ошибка, если Blueprint не найден или не может быть удалён (используется в других местах).
 * @example
 * await deleteBlueprint(1);
 */
export const deleteBlueprint = async (id: ZId): Promise<void> => {
  await rest.delete(getAdminBlueprintsUrl(`/${id}`));
};

/**
 * Получить список Blueprint для безопасного встраивания.
 * @param id Идентификатор Blueprint, в который планируется встраивание.
 * @returns Список Blueprint, которые можно безопасно встроить (без циклических зависимостей).
 * @example
 * const embeddable = await getEmbeddableBlueprints(1);
 * embeddable.data.forEach(bp => {
 *   console.log(`${bp.name} (${bp.code})`);
 * });
 */
export const getEmbeddableBlueprints = async (
  id: ZId
): Promise<z.infer<typeof zEmbeddableBlueprints>> => {
  const response = await rest.get(getAdminBlueprintsUrl(`/${id}/embeddable`));
  return zEmbeddableBlueprints.parse(response.data);
};

/**
 * Получить JSON схему Blueprint.
 * Возвращает готовую JSON схему структуры данных Blueprint из paths.
 * @param id Идентификатор Blueprint.
 * @returns JSON схема Blueprint с иерархической структурой полей.
 * @example
 * const schema = await getBlueprintSchema(1);
 * console.log(schema.schema.title.type); // 'string'
 * console.log(schema.schema.author.children?.name.type); // 'string'
 */
export const getBlueprintSchema = async (id: ZId): Promise<ZBlueprintSchema> => {
  const response = await rest.get(getAdminBlueprintsUrl(`/${id}/schema`));
  return zBlueprintSchema.parse(response.data);
};
