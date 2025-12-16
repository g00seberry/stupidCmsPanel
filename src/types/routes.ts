import { z } from 'zod';

// ============================================================================
// Константы и базовые типы данных
// ============================================================================

/**
 * Схема валидации типа узла маршрута.
 * Определяет, является ли узел группой маршрутов или конкретным маршрутом.
 * @example
 * const kind: ZRouteNodeKind = 'route';
 */
export const zRouteNodeKind = z.enum(['group', 'route']);

/**
 * Тип узла маршрута.
 */
export type ZRouteNodeKind = z.infer<typeof zRouteNodeKind>;

/**
 * Схема валидации типа действия маршрута.
 * Определяет, какой тип действия используется для обработки маршрута.
 * @example
 * const actionType: ZRouteNodeActionType = 'controller';
 */
export const zRouteNodeActionType = z.enum(['controller', 'entry']);

/**
 * Тип действия маршрута.
 */
export type ZRouteNodeActionType = z.infer<typeof zRouteNodeActionType>;

/**
 * Схема валидации HTTP метода.
 * Определяет допустимые HTTP методы для маршрутов.
 * @example
 * const method: ZHttpMethod = 'GET';
 */
export const zHttpMethod = z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']);

/**
 * Тип HTTP метода.
 */
export type ZHttpMethod = z.infer<typeof zHttpMethod>;

// ============================================================================
// Связанные типы
// ============================================================================

/**
 * Схема валидации связанной Entry в маршруте.
 * Используется для представления Entry, привязанной к маршруту с action_type=entry.
 */
const zRouteNodeEntry = z.object({
  /** Уникальный идентификатор Entry. */
  id: z.number(),
  /** Заголовок Entry. */
  title: z.string(),
  /** Статус Entry. */
  status: z.string(),
});

/**
 * Тип связанной Entry в маршруте.
 */
export type ZRouteNodeEntry = z.infer<typeof zRouteNodeEntry>;

/**
 * Схема валидации родительского узла маршрута.
 * Используется для представления родительского узла в иерархии маршрутов.
 */
const zRouteNodeParent = z.object({
  /** Уникальный идентификатор родительского узла. */
  id: z.number(),
  /** Имя родительского узла. Может быть `null`. */
  name: z.string().nullable(),
  /** Тип родительского узла. */
  kind: zRouteNodeKind,
});

/**
 * Тип родительского узла маршрута.
 */
export type ZRouteNodeParent = z.infer<typeof zRouteNodeParent>;

// ============================================================================
// Базовая схема RouteNode
// ============================================================================

/**
 * Базовая схема валидации узла маршрута без рекурсивного поля children.
 * Используется как основа для создания полной схемы с рекурсией.
 * @example
 * const routeNodeBase: ZRouteNodeBase = {
 *   id: 1,
 *   parent_id: null,
 *   sort_order: 0,
 *   enabled: true,
 *   readonly: false,
 *   kind: 'route',
 *   name: 'about',
 *   uri: '/about',
 *   methods: ['GET'],
 *   action_type: 'controller',
 *   action: 'App\\Http\\Controllers\\AboutController@show',
 *   entry_id: null,
 *   middleware: ['web'],
 *   created_at: '2025-01-10T12:00:00+00:00',
 *   updated_at: '2025-01-10T12:00:00+00:00',
 *   deleted_at: null
 * };
 */
export const zRouteNodeBase = z.object({
  /** Уникальный идентификатор узла (отрицательные для декларативных). */
  id: z.number(),
  /** Идентификатор родительского узла. `null` для корневых узлов. */
  parent_id: z.number().nullable(),
  /** Порядок сортировки узла (>= 0). */
  sort_order: z.number().int().nullable(),
  /** Включён ли маршрут. */
  enabled: z.boolean(),
  /** Защита от изменения (true для декларативных маршрутов). */
  readonly: z.boolean(),
  /** Тип узла: группа или маршрут. */
  kind: zRouteNodeKind,
  /** Имя маршрута. Может быть `null`. */
  name: z.string().max(255).nullable(),
  /** Домен для маршрута. Может быть `null`. */
  domain: z.string().max(255).nullable(),
  /** Префикс URI для группы маршрутов. Может быть `null`. */
  prefix: z.string().max(255).nullable(),
  /** Namespace контроллеров для группы. Может быть `null`. */
  namespace: z.string().max(255).nullable(),
  /** HTTP методы (только для kind=route). Может быть `null`. */
  methods: z.array(zHttpMethod).nullable(),
  /** URI паттерн (только для kind=route). Может быть `null`. */
  uri: z.string().max(255).nullable(),
  /** Тип действия маршрута. */
  action_type: zRouteNodeActionType.nullable(),
  /** Действие для обработки (для action_type=controller). Может быть `null`. */
  action: z.string().max(255).nullable(),
  /** ID Entry (для action_type=entry). Может быть `null`. */
  entry_id: z.number().nullable(),
  /** Массив middleware. Может быть `null`. */
  middleware: z.array(z.string()).nullable(),
  /** Ограничения параметров маршрута. Может быть `null`. */
  where: z.record(z.string(), z.string()).nullable(),
  /** Значения по умолчанию для параметров. Может быть `null`. */
  defaults: z.record(z.string(), z.unknown()).nullable(),
  /** Связанная Entry (при загрузке). Может быть `null` или `undefined`. */
  entry: zRouteNodeEntry.nullish(),
  /** Родительский узел (при загрузке). Может быть `null` или `undefined`. */
  parent: zRouteNodeParent.nullish(),
  /** Дата создания в формате ISO 8601. */
  created_at: z.string().nullish(),
  /** Дата последнего обновления в формате ISO 8601. */
  updated_at: z.string().nullish(),
  /** Дата мягкого удаления в формате ISO 8601. Может быть `null`. */
  deleted_at: z.string().nullish(),
});

/**
 * Тип базового узла маршрута без рекурсивного поля children.
 */
export type ZRouteNodeBase = z.infer<typeof zRouteNodeBase>;

/**
 * Схема валидации узла маршрута с опциональными дочерними узлами.
 * RouteNode представляет узел в иерархии маршрутов (группу или конкретный маршрут).
 * @example
 * const routeNode: ZRouteNode = {
 *   id: 1,
 *   parent_id: null,
 *   sort_order: 0,
 *   enabled: true,
 *   readonly: false,
 *   kind: 'route',
 *   name: 'about',
 *   uri: '/about',
 *   methods: ['GET'],
 *   action_type: 'controller',
 *   action: 'App\\Http\\Controllers\\AboutController@show',
 *   entry_id: null,
 *   middleware: ['web'],
 *   where: null,
 *   defaults: null,
 *   options: null,
 *   entry: null,
 *   parent: null,
 *   children: undefined,
 *   created_at: '2025-01-10T12:00:00+00:00',
 *   updated_at: '2025-01-10T12:00:00+00:00',
 *   deleted_at: null
 * };
 */
/**
 * Тип данных узла маршрута.
 * Используется для представления узла в иерархии маршрутов.
 */
export type ZRouteNode = ZRouteNodeBase & { children?: ZRouteNode[] | null };

export const zRouteNode: z.ZodType<ZRouteNode> = zRouteNodeBase.extend({
  children: z.lazy(() => zRouteNode.array().nullish()),
});
// ============================================================================
// Схема для списка маршрутов (с полем source)
// ============================================================================

/**
 * Схема валидации элемента списка маршрутов.
 * Упрощённая версия RouteNode с полем source для плоского списка.
 * @example
 * const listItem: ZRouteNodeListItem = {
 *   id: 1,
 *   uri: '/about',
 *   methods: ['GET'],
 *   name: 'about',
 *   action_type: 'entry',
 *   entry_id: 5,
 *   enabled: true,
 *   readonly: false,
 *   source: 'database'
 * };
 */
export const zRouteNodeListItem = zRouteNode;
/**
 * Тип элемента списка маршрутов.
 */
export type ZRouteNodeListItem = ZRouteNode;

/**
 * Схема валидации ответа API со списком маршрутов.
 * Используется для валидации ответа GET /api/v1/admin/routes.
 * @example
 * const response = await rest.get('/api/v1/admin/routes');
 * const validated = zRouteNodeListResponse.parse(response.data);
 * validated.data.forEach(route => console.log(route.uri));
 */
export const zRouteNodeListResponse = z.object({
  /** Массив узлов маршрутов (плоский список). */
  data: z.array(zRouteNodeListItem),
});

/**
 * Тип ответа API со списком маршрутов.
 */
export type ZRouteNodeListResponse = z.infer<typeof zRouteNodeListResponse>;

// ============================================================================
// DTO схемы (для создания и обновления)
// ============================================================================

/**
 * Схема валидации данных для создания нового узла маршрута.
 * Основана на zRouteNodeBase с исключением полей, которые генерируются сервером.
 * @example
 * const createDto: ZCreateRouteNodeDto = {
 *   kind: 'route',
 *   action_type: 'controller',
 *   uri: '/about',
 *   methods: ['GET'],
 *   name: 'about',
 *   action: 'App\\Http\\Controllers\\AboutController@show',
 *   enabled: true
 * };
 */
export const zCreateRouteNodeDto = zRouteNodeBase
  .omit({
    id: true,
    readonly: true,
    entry: true,
    parent: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
  })
  .partial()
  .extend({
    /** Тип узла: группа или маршрут. Обязателен. */
    kind: zRouteNodeKind,
    /** Тип действия маршрута. Обязателен. */
    action_type: zRouteNodeActionType,
  })
  .refine(
    data => {
      // Для kind=route обязательны uri и methods
      if (data.kind === 'route') {
        return (
          data.uri !== null &&
          data.uri !== undefined &&
          data.methods !== null &&
          data.methods !== undefined
        );
      }
      return true;
    },
    {
      message: 'Поля uri и methods обязательны для kind=route',
      path: ['uri'],
    }
  )
  .refine(
    data => {
      // Для action_type=entry обязателен entry_id
      if (data.action_type === 'entry') {
        return data.entry_id !== null && data.entry_id !== undefined;
      }
      return true;
    },
    {
      message: 'Поле entry_id обязательно для action_type=entry',
      path: ['entry_id'],
    }
  )
  .refine(
    data => {
      // Для action_type=entry запрещён action
      if (data.action_type === 'entry' && data.action !== null && data.action !== undefined) {
        return false;
      }
      return true;
    },
    {
      message: 'Поле action запрещено для action_type=entry',
      path: ['action'],
    }
  );

/**
 * Тип данных для создания нового узла маршрута.
 * Используется при отправке запроса на создание узла.
 */
export type ZCreateRouteNodeDto = z.infer<typeof zCreateRouteNodeDto>;

/**
 * Схема валидации данных для обновления узла маршрута.
 * Все поля опциональны - обновляются только переданные поля.
 * @example
 * const updateDto: ZUpdateRouteNodeDto = {
 *   uri: '/about-updated',
 *   enabled: false
 * };
 */
export const zUpdateRouteNodeDto = zCreateRouteNodeDto.partial();

/**
 * Тип данных для обновления узла маршрута.
 * Используется при отправке запроса на обновление узла.
 */
export type ZUpdateRouteNodeDto = z.infer<typeof zUpdateRouteNodeDto>;

/**
 * Схема валидации узла для переупорядочивания.
 * Используется в запросе на переупорядочивание маршрутов.
 */
const zReorderRouteNode = z.object({
  /** ID узла (обязателен). */
  id: z.number().int(),
  /** ID родителя. `null` для корневых узлов. */
  parent_id: z.number().int().nullable().optional(),
  /** Порядок сортировки. Минимум 0. */
  sort_order: z.number().int().optional(),
});

/**
 * Тип узла для переупорядочивания.
 */
export type ZReorderRouteNode = z.infer<typeof zReorderRouteNode>;

/**
 * Схема валидации запроса на переупорядочивание маршрутов.
 * @example
 * const reorderRequest: ZReorderRouteNodesRequest = {
 *   nodes: [
 *     { id: 1, parent_id: null, sort_order: 0 },
 *     { id: 2, parent_id: 1, sort_order: 0 },
 *     { id: 3, parent_id: 1, sort_order: 1 }
 *   ]
 * };
 */
export const zReorderRouteNodesRequest = z.object({
  /** Массив узлов для переупорядочивания. Минимум 1 элемент. */
  nodes: z.array(zReorderRouteNode).min(1, 'Массив nodes должен содержать минимум 1 элемент'),
});

/**
 * Тип данных запроса на переупорядочивание маршрутов.
 */
export type ZReorderRouteNodesRequest = z.infer<typeof zReorderRouteNodesRequest>;

// ============================================================================
// API Response схемы
// ============================================================================

/**
 * Схема валидации ответа API с одним узлом маршрута.
 * Используется для валидации ответа API при получении одного узла.
 * @example
 * const response = await rest.get('/api/v1/admin/routes/1');
 * const validated = zRouteNodeResponse.parse(response.data);
 * console.log(validated.data.uri);
 */
export const zRouteNodeResponse = z.object({
  /** Узел маршрута с полной информацией (включая дочерние узлы, если есть). */
  data: zRouteNode,
});

/**
 * Тип ответа API с одним узлом маршрута.
 */
export type ZRouteNodeResponse = z.infer<typeof zRouteNodeResponse>;

/**
 * Схема валидации ответа API на переупорядочивание маршрутов.
 * @example
 * const response = await rest.post('/api/v1/admin/routes/reorder', { nodes: [...] });
 * const validated = zReorderRouteNodesResponse.parse(response.data);
 * console.log(validated.data.updated); // Количество обновлённых узлов
 */
export const zReorderRouteNodesResponse = z.object({
  /** Данные ответа на переупорядочивание. */
  data: z.object({
    /** Количество обновлённых узлов. */
    updated: z.number().int(),
  }),
});

/**
 * Тип ответа API на переупорядочивание маршрутов.
 */
export type ZReorderRouteNodesResponse = z.infer<typeof zReorderRouteNodesResponse>;
