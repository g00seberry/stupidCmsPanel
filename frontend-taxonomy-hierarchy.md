# Управление иерархией таксономий на фронтенде

## Что изменилось

Добавлена поддержка иерархии терминов (parent-child) для таксономий с флагом `hierarchical: true`.

## Новые возможности API

### 1. Создание термина с родителем

**POST** `/api/v1/admin/taxonomies/{taxonomy}/terms`

```json
{
  "name": "Laravel",
  "slug": "laravel",
  "parent_id": 1,  // ← Новое поле
  "meta_json": {}
}
```

**Ответ:**
```json
{
  "data": {
    "id": 2,
    "taxonomy": "categories",
    "name": "Laravel",
    "slug": "laravel",
    "parent_id": 1,  // ← Новое поле в ответе
    "meta_json": {},
    "created_at": "2025-01-10T12:00:00+00:00",
    "updated_at": "2025-01-10T12:00:00+00:00"
  }
}
```

### 2. Обновление родителя термина

**PUT** `/api/v1/admin/terms/{id}`

```json
{
  "parent_id": 3  // или null для корневого термина
}
```

### 3. Получение дерева терминов

**GET** `/api/v1/admin/taxonomies/{taxonomy}/terms/tree` ← Новый эндпоинт

**Ответ:**
```json
{
  "data": [
    {
      "id": 1,
      "taxonomy": "categories",
      "name": "Технологии",
      "slug": "tech",
      "parent_id": null,
      "children": [
        {
          "id": 2,
          "taxonomy": "categories",
          "name": "Laravel",
          "slug": "laravel",
          "parent_id": 1,
          "children": [
            {
              "id": 3,
              "name": "Eloquent",
              "slug": "eloquent",
              "parent_id": 2,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

### 4. Получение термина с информацией о родителе

**GET** `/api/v1/admin/terms/{id}`

Теперь в ответе всегда есть поле `parent_id` (для иерархических таксономий):

```json
{
  "data": {
    "id": 2,
    "taxonomy": "categories",
    "name": "Laravel",
    "slug": "laravel",
    "parent_id": 1,  // ← Новое поле
    "meta_json": {},
    "created_at": "2025-01-10T12:00:00+00:00",
    "updated_at": "2025-01-10T12:00:00+00:00"
  }
}
```

## Валидация

### Ограничения при работе с `parent_id`:

1. **Родитель должен быть из той же таксономии**
   - ❌ Нельзя указать `parent_id` из другой таксономии
   - Ответ: `422 Validation Error`

2. **Нельзя сделать родителем самого себя**
   - ❌ `PUT /terms/5` с `{"parent_id": 5}`
   - Ответ: `422 Validation Error`

3. **Нельзя создать циклическую зависимость**
   - ❌ Если A → B (A является родителем B), то нельзя сделать B → A
   - Ответ: `422 Validation Error` с сообщением "Cannot set parent: would create a cycle"

4. **Для неиерархических таксономий `parent_id` игнорируется**
   - Если `taxonomy.hierarchical === false`, поле `parent_id` в запросе игнорируется
   - В ответе поле `parent_id` отсутствует

## Примеры использования

### Построение дерева категорий

```javascript
// Получаем дерево
const response = await fetch('/api/v1/admin/taxonomies/categories/terms/tree', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-CSRF-Token': csrfToken
  }
});

const { data } = await response.json();

// data уже содержит вложенную структуру с children
// Можно сразу использовать для рендеринга дерева
```

### Создание дочернего термина

```javascript
const response = await fetch('/api/v1/admin/taxonomies/categories/terms', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify({
    name: 'Vue.js',
    parent_id: 1  // ID родительской категории "Технологии"
  })
});
```

### Перемещение термина в другую ветку

```javascript
// Делаем термин корневым
await fetch(`/api/v1/admin/terms/${termId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify({
    parent_id: null
  })
});

// Или перемещаем к другому родителю
await fetch(`/api/v1/admin/terms/${termId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify({
    parent_id: newParentId
  })
});
```

### Получение breadcrumb (хлебных крошек)

```javascript
// Получаем термин
const term = await fetch(`/api/v1/admin/terms/${termId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-CSRF-Token': csrfToken
  }
}).then(r => r.json());

// Если есть parent_id, получаем родителя рекурсивно
async function getBreadcrumb(termId) {
  const term = await fetch(`/api/v1/admin/terms/${termId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-CSRF-Token': csrfToken
    }
  }).then(r => r.json());
  
  const breadcrumb = [term.data];
  
  if (term.data.parent_id) {
    const parentBreadcrumb = await getBreadcrumb(term.data.parent_id);
    return [...parentBreadcrumb, ...breadcrumb];
  }
  
  return breadcrumb;
}
```

## Важные замечания

1. **Поле `parent_id` появляется только для иерархических таксономий**
   - Проверяйте `taxonomy.hierarchical` перед использованием

2. **Эндпоинт `/tree` оптимизирован для получения полной иерархии**
   - Используйте его вместо `/terms` когда нужна структура с `children`

3. **Изменение `parent_id` автоматически обновляет все связи в базе**
   - Не нужно делать дополнительные запросы после обновления

4. **Плоский список терминов (`/terms`) не содержит `children`**
   - Для получения дерева используйте `/terms/tree`

## Обработка ошибок

```javascript
try {
  const response = await fetch('/api/v1/admin/taxonomies/categories/terms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify({
      name: 'Child',
      parent_id: invalidParentId
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    
    if (error.status === 422) {
      // Ошибка валидации
      console.error('Validation errors:', error.meta.errors);
      // error.meta.errors.parent_id содержит массив сообщений
    }
  }
} catch (error) {
  console.error('Network error:', error);
}
```

## Миграция существующего кода

Если у вас уже есть код работы с терминами:

1. **Добавьте проверку `parent_id` в формы создания/редактирования**
2. **Используйте `/tree` для отображения иерархических списков**
3. **Обновите типы TypeScript/PropTypes для включения `parent_id`**

```typescript
interface Term {
  id: number;
  taxonomy: string;
  name: string;
  slug: string;
  parent_id: number | null;  // ← Добавить
  children?: Term[];          // ← Добавить (только в /tree)
  meta_json: object;
  created_at: string;
  updated_at: string;
}
```

