import { rest } from '@/api/rest';
import type {
  ZCreateRouteNodeDto,
  ZRouteNode,
  ZReorderRouteNode,
  ZUpdateRouteNodeDto,
} from '@/types/routes';
import {
  zRouteNodeListResponse,
  zRouteNodeResponse,
  zReorderRouteNodesRequest,
  zReorderRouteNodesResponse,
  zCreateRouteNodeDto,
  zUpdateRouteNodeDto,
} from '@/types/routes';

const getAdminRoutesUrl = (path: string): string => `/api/v1/admin/routes${path}`;

/**
 * Загружает плоский список всех маршрутов (декларативные + из БД).
 * @returns Массив узлов маршрутов с полем source.
 * @example
 * const routes = await listRoutes();
 * routes.forEach(route => {
 *   console.log(`${route.uri} (${route.source})`);
 * });
 */
export const listRoutes = async (): Promise<ZRouteNode[]> => {
  const response = await rest.get(getAdminRoutesUrl(''));
  const parsed = zRouteNodeListResponse.parse(response.data);
  return parsed.data;
};

/**
 * Загружает сведения о конкретном узле маршрута по ID.
 * @param id Уникальный идентификатор узла (может быть отрицательным для декларативных).
 * @returns Узел маршрута с полной информацией (включая дочерние узлы, если есть).
 * @example
 * const route = await getRoute(1);
 * console.log(route.uri); // '/about'
 * if (route.children) {
 *   console.log(`Дочерних узлов: ${route.children.length}`);
 * }
 */
export const getRoute = async (id: string): Promise<ZRouteNode> => {
  const response = await rest.get(getAdminRoutesUrl(`/${id}`));
  const parsed = zRouteNodeResponse.parse(response.data);
  return parsed.data;
};

/**
 * Создаёт новый узел маршрута.
 * @param payload Данные нового узла маршрута.
 * @returns Созданный узел маршрута.
 * @throws {Error} Если данные некорректны (422), нет прав (403) или конфликт URI/методов (409).
 * @example
 * const newRoute = await createRoute({
 *   kind: 'route',
 *   action_type: 'controller',
 *   uri: '/about',
 *   methods: ['GET'],
 *   name: 'about',
 *   action: 'App\\Http\\Controllers\\AboutController@show',
 *   enabled: true
 * });
 */
export const createRoute = async (payload: ZCreateRouteNodeDto): Promise<ZRouteNode> => {
  const parsedPayload = zCreateRouteNodeDto.parse(payload);
  const response = await rest.post(getAdminRoutesUrl(''), parsedPayload);
  const parsed = zRouteNodeResponse.parse(response.data);
  return parsed.data;
};

/**
 * Обновляет существующий узел маршрута.
 * @param id Идентификатор узла для обновления.
 * @param payload Новые значения полей узла (все поля опциональны).
 * @returns Обновлённый узел маршрута.
 * @throws {Error} Если узел не найден (404), узел readonly (403), ошибка валидации (422) или конфликт (409).
 * @example
 * const updatedRoute = await updateRoute(1, {
 *   uri: '/about-updated',
 *   enabled: false,
 *   middleware: ['web', 'auth']
 * });
 */
export const updateRoute = async (
  id: string,
  payload: ZUpdateRouteNodeDto
): Promise<ZRouteNode> => {
  const parsedPayload = zUpdateRouteNodeDto.parse(payload);
  const response = await rest.put(getAdminRoutesUrl(`/${id}`), parsedPayload);
  const parsed = zRouteNodeResponse.parse(response.data);
  return parsed.data;
};

/**
 * Удаляет узел маршрута.
 * Выполняется каскадное удаление (удаляются все дочерние узлы).
 * Используется soft delete, кэш маршрутов автоматически очищается.
 * @param id Идентификатор узла для удаления.
 * @throws {Error} Если узел не найден (404) или узел readonly (403).
 * @example
 * await deleteRoute(1);
 * // Внимание: удаление узла приводит к каскадному удалению всех дочерних узлов
 */
export const deleteRoute = async (id: string): Promise<void> => {
  await rest.delete(getAdminRoutesUrl(`/${id}`));
};

/**
 * Переупорядочивает узлы маршрутов.
 * Выполняется в транзакции (все или ничего).
 * Все указанные узлы должны существовать, parent_id должен существовать или быть null.
 * @param nodes Массив узлов с id, parent_id и sort_order для переупорядочивания.
 * @returns Количество обновлённых узлов.
 * @throws {Error} Если ошибка валидации (422) или внутренняя ошибка сервера (500).
 * @example
 * const result = await reorderRoutes({
 *   nodes: [
 *     { id: 1, parent_id: null, sort_order: 0 },
 *     { id: 2, parent_id: 1, sort_order: 0 },
 *     { id: 3, parent_id: 1, sort_order: 1 }
 *   ]
 * });
 * console.log(`Обновлено узлов: ${result.updated}`);
 */
export const reorderRoutes = async (nodes: ZReorderRouteNode[]): Promise<{ updated: number }> => {
  const payload = { nodes };
  const parsedPayload = zReorderRouteNodesRequest.parse(payload);
  const response = await rest.post(getAdminRoutesUrl('/reorder'), parsedPayload);
  const parsed = zReorderRouteNodesResponse.parse(response.data);
  return parsed.data;
};
