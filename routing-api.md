# API для управления маршрутами

## Базовый URL

```
/api/v1/admin/routes
```

**Требования**:

-   Аутентификация: JWT токен в cookie `cms_at` или заголовке `Authorization: Bearer {token}`
-   Middleware: `api`, `jwt.auth`, `throttle:api`

---

## Endpoints

### 1. Список всех маршрутов

```
GET /api/v1/admin/routes
```

Возвращает плоский список всех маршрутов (декларативные + из БД).

**Ответ**: `200 OK`

```json
{
    "data": [
        {
            "id": -1,
            "uri": "/",
            "methods": ["GET"],
            "name": "home",
            "action_type": "controller",
            "action": "App\\Http\\Controllers\\HomeController",
            "enabled": true,
            "readonly": true,
            "source": "web_core.php"
        },
        {
            "id": 1,
            "uri": "/about",
            "methods": ["GET"],
            "name": "about",
            "action_type": "entry",
            "entry_id": 5,
            "enabled": true,
            "readonly": false,
            "source": "database"
        }
    ]
}
```

**Поля ответа**:

-   `id` - ID узла (отрицательные для декларативных)
-   `uri` - URI паттерн
-   `methods` - Массив HTTP методов
-   `name` - Имя маршрута
-   `action_type` - `"controller"` или `"entry"`
-   `action` - Действие (для `action_type=controller`)
-   `entry_id` - ID Entry (для `action_type=entry`)
-   `enabled` - Включён ли маршрут
-   `readonly` - Защита от изменения
-   `source` - Источник: `"database"` или имя файла

---

### 2. Создание узла маршрута

```
POST /api/v1/admin/routes
Content-Type: application/json
```

**Тело запроса**:

```json
{
    "kind": "route",
    "parent_id": null,
    "sort_order": 0,
    "enabled": true,
    "name": "about",
    "uri": "/about",
    "methods": ["GET"],
    "action_type": "controller",
    "action": "App\\Http\\Controllers\\AboutController@show",
    "middleware": ["web"]
}
```

**Обязательные поля**:

-   `kind` - `"group"` или `"route"`
-   `action_type` - `"controller"` или `"entry"`

**Условно обязательные**:

-   Для `action_type=entry`: `entry_id` (обязателен)
-   Для `kind=route`: `uri`, `methods`

**Ответ**: `201 Created`

```json
{
    "data": {
        "id": 1,
        "kind": "route",
        "parent_id": null,
        "sort_order": 0,
        "enabled": true,
        "readonly": false,
        "name": "about",
        "uri": "/about",
        "methods": ["GET"],
        "action_type": "controller",
        "action": "App\\Http\\Controllers\\AboutController@show",
        "entry_id": null,
        "middleware": ["web"],
        "where": null,
        "defaults": null,
        "options": null,
        "created_at": "2025-01-10T12:00:00+00:00",
        "updated_at": "2025-01-10T12:00:00+00:00"
    }
}
```

**Ошибки**:

-   `422 Validation Error` - Ошибки валидации
-   `403 Forbidden` - Нет прав на создание
-   `409 Conflict` - Конфликт URI/методов или зарезервированный префикс

---

### 3. Получение узла маршрута

```
GET /api/v1/admin/routes/{id}
```

**Параметры**:

-   `id` - ID узла (integer)

**Ответ**: `200 OK`

```json
{
    "data": {
        "id": 1,
        "kind": "route",
        "parent_id": null,
        "sort_order": 0,
        "enabled": true,
        "readonly": false,
        "name": "about",
        "uri": "/about",
        "methods": ["GET"],
        "action_type": "controller",
        "action": "App\\Http\\Controllers\\AboutController@show",
        "entry_id": null,
        "middleware": ["web"],
        "where": null,
        "defaults": null,
        "options": null,
        "entry": null,
        "parent": null,
        "children": null,
        "created_at": "2025-01-10T12:00:00+00:00",
        "updated_at": "2025-01-10T12:00:00+00:00",
        "deleted_at": null
    }
}
```

**Ошибки**:

-   `404 Not Found` - Узел не найден

---

### 4. Обновление узла маршрута

```
PUT /api/v1/admin/routes/{id}
Content-Type: application/json
```

**Параметры**:

-   `id` - ID узла (integer)

**Тело запроса** (все поля опциональны):

```json
{
    "uri": "/about-updated",
    "enabled": false,
    "middleware": ["web", "auth"]
}
```

**Ответ**: `200 OK`

```json
{
    "data": {
        "id": 1,
        "uri": "/about-updated",
        "enabled": false,
        "middleware": ["web", "auth"],
        "updated_at": "2025-01-10T12:05:00+00:00"
    }
}
```

**Ошибки**:

-   `404 Not Found` - Узел не найден
-   `403 Forbidden` - Узел помечен как `readonly` (декларативный маршрут)
-   `422 Validation Error` - Ошибки валидации
-   `409 Conflict` - Конфликт URI/методов

**Ограничения**:

-   Поле `readonly` нельзя изменять
-   Декларативные маршруты (`readonly=true`) нельзя обновлять

---

### 5. Удаление узла маршрута

```
DELETE /api/v1/admin/routes/{id}
```

**Параметры**:

-   `id` - ID узла (integer)

**Ответ**: `204 No Content`

**Особенности**:

-   Выполняется каскадное удаление (удаляются все дочерние узлы)
-   Используется soft delete
-   Кэш маршрутов автоматически очищается

**Ошибки**:

-   `404 Not Found` - Узел не найден
-   `403 Forbidden` - Узел помечен как `readonly` (декларативный маршрут)

---

### 6. Переупорядочивание узлов

```
POST /api/v1/admin/routes/reorder
Content-Type: application/json
```

**Тело запроса**:

```json
{
    "nodes": [
        {
            "id": 1,
            "parent_id": null,
            "sort_order": 0
        },
        {
            "id": 2,
            "parent_id": 1,
            "sort_order": 0
        },
        {
            "id": 3,
            "parent_id": 1,
            "sort_order": 1
        }
    ]
}
```

**Параметры узла**:

-   `id` - ID узла (обязателен, integer)
-   `parent_id` - ID родителя (nullable, integer)
-   `sort_order` - Порядок сортировки (nullable, integer >= 0)

**Ответ**: `200 OK`

```json
{
    "data": {
        "updated": 3
    }
}
```

**Ошибки**:

-   `422 Validation Error` - Ошибки валидации
-   `500 Internal Server Error` - Ошибка при обновлении

**Особенности**:

-   Выполняется в транзакции (все или ничего)
-   Все указанные узлы должны существовать
-   `parent_id` должен существовать или быть `null`

---

## Типы данных

### RouteNode (полная структура)

```typescript
interface RouteNode {
    id: number; // ID узла (отрицательные для декларативных)
    parent_id: number | null; // ID родителя
    sort_order: number; // Порядок сортировки (>= 0)
    enabled: boolean; // Включён ли маршрут
    readonly: boolean; // Защита от изменения
    kind: "group" | "route"; // Тип узла
    name: string | null; // Имя маршрута
    domain: string | null; // Домен
    prefix: string | null; // Префикс URI (для группы)
    namespace: string | null; // Namespace контроллеров (для группы)
    methods: string[] | null; // HTTP методы (только для route)
    uri: string | null; // URI паттерн (только для route)
    action_type: "controller" | "entry"; // Тип действия
    action: string | null; // Действие (для controller)
    entry_id: number | null; // ID Entry (для entry)
    middleware: string[] | null; // Массив middleware
    where: Record<string, string> | null; // Ограничения параметров
    defaults: Record<string, any> | null; // Значения по умолчанию
    options: Record<string, any> | null; // Дополнительные опции
    entry?: {
        // Связанная Entry (при загрузке)
        id: number;
        title: string;
        status: string;
    } | null;
    parent?: {
        // Родительский узел (при загрузке)
        id: number;
        name: string | null;
        kind: "group" | "route";
    } | null;
    children?: RouteNode[] | null; // Дочерние узлы (при загрузке)
    created_at: string; // ISO 8601
    updated_at: string; // ISO 8601
    deleted_at: string | null; // ISO 8601
}
```

### RouteNodeKind

```typescript
type RouteNodeKind = "group" | "route";
```

-   `group` - Группа маршрутов (для организации иерархии)
-   `route` - Конкретный HTTP endpoint

### RouteNodeActionType

```typescript
type RouteNodeActionType = "controller" | "entry";
```

-   `controller` - Универсальный тип для контроллеров, view и redirect
-   `entry` - Жёсткое назначение конкретной Entry на URL

### HTTP методы

```typescript
type HttpMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | "OPTIONS"
    | "HEAD";
```

---

## Валидация

### Создание маршрута (POST)

**Обязательные поля**:

-   `kind`: `'group'` | `'route'`
-   `action_type`: `'controller'` | `'entry'`

**Условно обязательные**:

-   Для `action_type=entry`: `entry_id` (integer, должен существовать)
-   Для `kind=route`: `uri` (string, max 255), `methods` (array)

**Правила валидации**:

-   `parent_id`: nullable, integer, должен существовать в `route_nodes`
-   `sort_order`: nullable, integer, min 0
-   `enabled`: nullable, boolean
-   `name`: nullable, string, max 255
-   `domain`: nullable, string, max 255
-   `prefix`: nullable, string, max 255, не должен быть зарезервирован
-   `namespace`: nullable, string, max 255
-   `methods`: nullable, array, каждый элемент - один из HTTP методов
-   `uri`: nullable, string, max 255, не должен быть зарезервирован, не должен конфликтовать
-   `action`: nullable, string, max 255, запрещён для `action_type=entry`, проверка формата для `action_type=controller`
-   `entry_id`: nullable, integer, обязателен для `action_type=entry`, должен существовать в `entries`
-   `middleware`: nullable, array, каждый элемент - string
-   `where`: nullable, array
-   `defaults`: nullable, array
-   `options`: nullable, array
-   `readonly`: prohibited (нельзя устанавливать через API)

**Зарезервированные префиксы**:

-   `api`, `admin`, `sanctum`, `_ignition`, `horizon`, `telescope`

**Проверка конфликтов**:

-   URI и методы не должны совпадать с существующими маршрутами (декларативными или из БД)

### Обновление маршрута (PUT)

Все поля опциональны (`sometimes`). Правила валидации те же, что и при создании, но:

-   `uri` проверяется на конфликты с исключением текущего маршрута
-   `readonly` нельзя изменять
-   Декларативные маршруты (`readonly=true`) нельзя обновлять (403)

### Переупорядочивание (POST /reorder)

**Обязательные поля**:

-   `nodes`: array, min 1 элемент

**Правила валидации**:

-   `nodes.*.id`: required, integer, должен существовать в `route_nodes`
-   `nodes.*.parent_id`: nullable, integer, должен существовать в `route_nodes` или быть null
-   `nodes.*.sort_order`: nullable, integer, min 0

---

## Форматы action

### Для `action_type=controller`

1. **Controller@method**:

    ```
    App\Http\Controllers\BlogController@show
    ```

2. **Invokable controller**:

    ```
    App\Http\Controllers\HomeController
    ```

3. **View**:

    ```
    view:pages.about
    ```

4. **Redirect** (с кодом статуса):

    ```
    redirect:/new-page:301
    ```

5. **Redirect** (по умолчанию 302):
    ```
    redirect:/new-page
    ```

### Для `action_type=entry`

Поле `action` не используется. Автоматически используется `EntryPageController@show`. Требуется `entry_id`.

---

## Ошибки

### Формат ошибки

```json
{
    "type": "https://stupidcms.dev/problems/{error-type}",
    "title": "Error Title",
    "status": 422,
    "code": "ERROR_CODE",
    "detail": "Error message",
    "meta": {
        "request_id": "uuid",
        "field": "field_name",
        "errors": {
            "field": ["Error message"]
        }
    },
    "trace_id": "trace-id"
}
```

### Коды ошибок

-   `UNAUTHORIZED` (401) - Не авторизован
-   `FORBIDDEN` (403) - Нет прав или попытка изменить `readonly` маршрут
-   `NOT_FOUND` (404) - Ресурс не найден
-   `VALIDATION_ERROR` (422) - Ошибки валидации
-   `CONFLICT` (409) - Конфликт URI/методов или зарезервированный префикс
-   `INTERNAL_ERROR` (500) - Внутренняя ошибка сервера

### Примеры ошибок

**422 Validation Error**:

```json
{
    "type": "https://stupidcms.dev/problems/validation-error",
    "title": "Validation Error",
    "status": 422,
    "code": "VALIDATION_ERROR",
    "detail": "The given data was invalid.",
    "meta": {
        "errors": {
            "uri": ["Поле uri обязательно для заполнения."],
            "methods": ["Поле methods обязательно для заполнения."]
        }
    }
}
```

**403 Forbidden (readonly)**:

```json
{
    "type": "https://stupidcms.dev/problems/forbidden",
    "title": "Forbidden",
    "status": 403,
    "code": "FORBIDDEN",
    "detail": "Cannot update readonly route node. Declarative routes cannot be modified.",
    "meta": {
        "route_node_id": -1,
        "readonly": true
    }
}
```

**409 Conflict**:

```json
{
    "type": "https://stupidcms.dev/problems/conflict",
    "title": "Conflict",
    "status": 409,
    "code": "CONFLICT",
    "detail": "Маршрут с URI '/about' и методами [\"GET\"] уже существует в БД",
    "meta": {
        "conflicting_route": {
            "id": 1,
            "uri": "/about"
        }
    }
}
```

---

## Примеры использования

### Создание простого маршрута

```typescript
const response = await fetch("/api/v1/admin/routes", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        kind: "route",
        uri: "/blog",
        methods: ["GET"],
        action_type: "controller",
        action: "App\\Http\\Controllers\\BlogController@index",
        name: "blog.index",
        middleware: ["web"],
        enabled: true,
    }),
});

const data = await response.json();
```

### Создание группы маршрутов

```typescript
// 1. Создаём группу
const groupResponse = await fetch("/api/v1/admin/routes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        kind: "group",
        prefix: "blog",
        middleware: ["web", "auth"],
        sort_order: 0,
        enabled: true,
    }),
});

const group = await groupResponse.json();

// 2. Создаём маршрут внутри группы
const routeResponse = await fetch("/api/v1/admin/routes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        kind: "route",
        parent_id: group.data.id,
        uri: "/posts",
        methods: ["GET"],
        action_type: "controller",
        action: "App\\Http\\Controllers\\BlogController@index",
        name: "blog.posts.index",
    }),
});
```

### Создание маршрута для Entry

```typescript
const response = await fetch("/api/v1/admin/routes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        kind: "route",
        uri: "/about",
        methods: ["GET"],
        action_type: "entry",
        entry_id: 5,
        name: "about.page",
        enabled: true,
    }),
});
```

### Обновление маршрута

```typescript
const response = await fetch(`/api/v1/admin/routes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        uri: "/about-updated",
        enabled: false,
    }),
});
```

### Переупорядочивание узлов

```typescript
const response = await fetch("/api/v1/admin/routes/reorder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        nodes: [
            { id: 1, parent_id: null, sort_order: 0 },
            { id: 2, parent_id: 1, sort_order: 0 },
            { id: 3, parent_id: 1, sort_order: 1 },
        ],
    }),
});
```

### Удаление маршрута

```typescript
const response = await fetch(`/api/v1/admin/routes/${id}`, {
    method: "DELETE",
});

if (response.status === 204) {
    // Успешно удалено
}
```

---

## Особенности

### Декларативные маршруты

-   Имеют отрицательные ID (начинаются с -1)
-   Помечены как `readonly: true`
-   Источник: имя файла (например, `"web_core.php"`)
-   Нельзя обновлять или удалять через API (403)

### Динамические маршруты

-   Имеют положительные ID
-   `readonly: false`
-   Источник: `"database"`
-   Можно обновлять и удалять через API

### Кэширование

-   Кэш автоматически очищается при создании, обновлении или удалении маршрута
-   Для принудительной очистки: команда `php artisan dynamic-routes:clear`

### Иерархия

-   Узлы могут иметь родителя (`parent_id`)
-   Группы применяют настройки к дочерним узлам:
    -   `prefix` - добавляется к URI дочерних маршрутов
    -   `middleware` - применяется ко всем дочерним маршрутам
    -   `domain`, `namespace`, `where` - наследуются

### Каскадное удаление

-   При удалении узла автоматически удаляются все дочерние узлы
-   Используется soft delete (можно восстановить)

---

## Типы TypeScript

```typescript
// Полная структура RouteNode
interface RouteNode {
    id: number;
    parent_id: number | null;
    sort_order: number;
    enabled: boolean;
    readonly: boolean;
    kind: "group" | "route";
    name: string | null;
    domain: string | null;
    prefix: string | null;
    namespace: string | null;
    methods: string[] | null;
    uri: string | null;
    action_type: "controller" | "entry";
    action: string | null;
    entry_id: number | null;
    middleware: string[] | null;
    where: Record<string, string> | null;
    defaults: Record<string, any> | null;
    options: Record<string, any> | null;
    entry?: {
        id: number;
        title: string;
        status: string;
    } | null;
    parent?: {
        id: number;
        name: string | null;
        kind: "group" | "route";
    } | null;
    children?: RouteNode[] | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

// Создание маршрута
interface CreateRouteNodeRequest {
    kind: "group" | "route";
    parent_id?: number | null;
    sort_order?: number;
    enabled?: boolean;
    name?: string | null;
    domain?: string | null;
    prefix?: string | null;
    namespace?: string | null;
    methods?: string[];
    uri?: string;
    action_type: "controller" | "entry";
    action?: string | null;
    entry_id?: number | null;
    middleware?: string[];
    where?: Record<string, string>;
    defaults?: Record<string, any>;
    options?: Record<string, any>;
}

// Обновление маршрута (все поля опциональны)
type UpdateRouteNodeRequest = Partial<CreateRouteNodeRequest>;

// Переупорядочивание
interface ReorderRouteNodesRequest {
    nodes: Array<{
        id: number;
        parent_id?: number | null;
        sort_order?: number;
    }>;
}

// Ответы API
interface RouteNodeResponse {
    data: RouteNode;
}

interface RouteNodeListResponse {
    data: Array<
        Omit<RouteNode, "entry" | "parent" | "children"> & {
            source: string;
        }
    >;
}

interface ReorderResponse {
    data: {
        updated: number;
    };
}
```
