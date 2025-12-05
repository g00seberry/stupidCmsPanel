# План миграции: PostType slug → ID

**Дата создания:** 2025-12-04  
**Приоритет:** 🔴 Высокий  
**Тип:** Breaking Changes (без обратной совместимости)

---

## 📌 Цель миграции

Полностью перевести систему на использование **ID** для всех операций с PostType:
- Slug используется **только** в форме создания/редактирования PostType
- Все API запросы используют ID
- Все роуты используют ID
- Все сторы и компоненты работают с ID
- Удалить весь legacy код, связанный со slug

---

## 🔍 Анализ текущего состояния

### Файлы, требующие изменений

#### 1. API слой (`src/api/`)
- ✅ `apiPostTypes.ts` - все функции используют slug
- ✅ `apiEntries.ts` - фильтрация и создание используют `post_type: string`
- ✅ `apiFormConfig.ts` - все функции используют `postTypeSlug: string`

#### 2. Типы (`src/types/`)
- ✅ `entries.ts` - `post_type: string` → `post_type_id: number`
- ✅ `formConfig.ts` - `post_type_slug: string` → `post_type_id: number`
- ✅ `postTypes.ts` - структура остается, но slug только для формы

#### 3. Сторы (`src/pages/*/`)
- ✅ `EntryEditorStore.ts` - использует `postTypeSlug: string`
- ✅ `EntriesListStore.ts` - фильтрация по `post_type: string`
- ✅ `PostTypeEditorStore.ts` - использует slug для API вызовов
- ✅ `FormConfigStore.ts` - использует `postTypeSlug: string`

#### 4. Роутинг (`src/`)
- ✅ `PageUrl.ts` - маршруты с `:slug` → `:id`
- ✅ `routes.tsx` - без изменений (использует PageUrl)

#### 5. Компоненты/Страницы (`src/pages/`)
- ✅ `EntryEditorPage.tsx` - получает slug из URL
- ✅ `EntriesListPage.tsx` - использует slug из URL
- ✅ `PostTypeEditorPage.tsx` - использует slug из URL
- ✅ `FormConfigPage.tsx` - использует slug из URL
- ✅ `PostTypeBlueprintsPage.tsx` - использует slug из URL
- ✅ Все компоненты, использующие `buildUrl` с `slug` или `postType`

#### 6. Утилиты (`src/utils/`)
- ✅ `transforms.ts` (EntryEditorPage) - использует `postTypeSlug`

---

## 📋 Детальный план миграции

### Этап 1: Обновление типов данных

#### 1.1. Обновить `src/types/entries.ts`

**Изменения:**
- `zEntry.post_type: z.string()` → `zEntry.post_type_id: z.number()`
- `zEntryPayload.post_type: z.string().optional()` → `zEntryPayload.post_type_id: z.number().optional()`
- `ZEntriesListParams.post_type?: string` → `ZEntriesListParams.post_type_id?: number`

**Файл:** `src/types/entries.ts`
- Строка 50: `post_type: z.string()` → `post_type_id: z.number()`
- Строка 117: `post_type?: string` → `post_type_id?: number`
- Строка 176: `post_type: z.string().optional()` → `post_type_id: z.number().optional()`

#### 1.2. Обновить `src/types/formConfig.ts`

**Изменения:**
- `zFormConfigSaveResponse.data.post_type_slug: z.string()` → `zFormConfigSaveResponse.data.post_type_id: z.number()`

**Файл:** `src/types/formConfig.ts`
- Строка 15: `post_type_slug: z.string()` → `post_type_id: z.number()`

#### 1.3. `src/types/postTypes.ts` - без изменений

Slug остается в структуре PostType, но используется только для формы.

---

### Этап 2: Обновление API функций

#### 2.1. Обновить `src/api/apiPostTypes.ts`

**Изменения:**
- `getPostType(slug: string)` → `getPostType(id: number)`
- `updatePostType(slug: string, ...)` → `updatePostType(id: number, ...)`
- `deletePostType(slug: string, ...)` → `deletePostType(id: number, ...)`
- URL: `/api/v1/admin/post-types/${slug}` → `/api/v1/admin/post-types/${id}`

**Функции для изменения:**
- `getPostType` (строка 26)
- `updatePostType` (строка 54)
- `deletePostType` (строка 76)

#### 2.2. Обновить `src/api/apiEntries.ts`

**Изменения:**
- `buildQueryParams` - `post_type` → `post_type_id` (строка 31-32)
- Обновить JSDoc примеры (строки 86, 144)

**Функции для изменения:**
- `buildQueryParams` (строка 26-78)
- JSDoc комментарии

#### 2.3. Обновить `src/api/apiFormConfig.ts`

**Изменения:**
- `getAdminFormConfigUrl(postTypeSlug: string, ...)` → `getAdminFormConfigUrl(postTypeId: number, ...)`
- URL: `/api/v1/admin/post-types/${postTypeSlug}/form-config/...` → `/api/v1/admin/post-types/${postTypeId}/form-config/...`
- Все функции: `postTypeSlug: string` → `postTypeId: number`

**Функции для изменения:**
- `getAdminFormConfigUrl` (строка 6)
- `getFormConfig` (строка 19)
- `saveFormConfig` (строка 40)
- `deleteFormConfig` (строка 60)

---

### Этап 3: Обновление роутинга

#### 3.1. Обновить `src/PageUrl.ts`

**Изменения:**
- `ContentTypesEdit: '/content-types/:slug'` → `ContentTypesEdit: '/content-types/:id'`
- `ContentTypesBlueprints: '/content-types/:slug/blueprints'` → `ContentTypesBlueprints: '/content-types/:id/blueprints'`
- `ContentTypesFormConfig: '/content-types/:slug/form-config/:blueprintId'` → `ContentTypesFormConfig: '/content-types/:id/form-config/:blueprintId'`
- `EntriesByType: '/entries/:postType'` → `EntriesByType: '/entries/:postTypeId'`
- `EntryEdit: '/entries/:postType/:id'` → `EntryEdit: '/entries/:postTypeId/:id'`

**Файл:** `src/PageUrl.ts`
- Строка 14: `ContentTypesEdit: '/content-types/:slug'` → `ContentTypesEdit: '/content-types/:id'`
- Строка 15: `ContentTypesBlueprints: '/content-types/:slug/blueprints'` → `ContentTypesBlueprints: '/content-types/:id/blueprints'`
- Строка 16: `ContentTypesFormConfig: '/content-types/:slug/form-config/:blueprintId'` → `ContentTypesFormConfig: '/content-types/:id/form-config/:blueprintId'`
- Строка 21: `EntriesByType: '/entries/:postType'` → `EntriesByType: '/entries/:postTypeId'`
- Строка 22: `EntryEdit: '/entries/:postType/:id'` → `EntryEdit: '/entries/:postTypeId/:id'`

---

### Этап 4: Обновление сторов

#### 4.1. Обновить `src/pages/EntryEditorPage/EntryEditorStore.ts`

**Изменения:**
- `postTypeSlug: string` → `postTypeId: number`
- `constructor(postTypeSlug: string, ...)` → `constructor(postTypeId: number, ...)`
- `getPostType(this.postTypeSlug)` → `getPostType(this.postTypeId)`
- `formValues2entryPayload(values, this.postTypeSlug)` → `formValues2entryPayload(values, this.postTypeId)`
- `createFormModelFromBlueprintSchema(..., this.postTypeSlug)` → `createFormModelFromBlueprintSchema(..., this.postTypeId)` (если используется)

**Файл:** `src/pages/EntryEditorPage/EntryEditorStore.ts`
- Строка 42: `postTypeSlug: string` → `postTypeId: number`
- Строка 52: `constructor(postTypeSlug: string, ...)` → `constructor(postTypeId: number, ...)`
- Строка 53: `this.postTypeSlug = postTypeSlug` → `this.postTypeId = postTypeId`
- Строка 115: `getPostType(this.postTypeSlug)` → `getPostType(this.postTypeId)`
- Строка 138: `this.postTypeSlug` → `this.postTypeId` (если используется)
- Строка 158: `formValues2entryPayload(values, this.postTypeSlug)` → `formValues2entryPayload(values, this.postTypeId)`

#### 4.2. Обновить `src/pages/EntriesListPage/EntriesListStore.ts`

**Изменения:**
- Все методы: `postType?: string` → `postTypeId?: number`
- `post_type: postType` → `post_type_id: postTypeId`

**Файл:** `src/pages/EntriesListPage/EntriesListStore.ts`
- Строка 72: `loadEntries(postType?: string)` → `loadEntries(postTypeId?: number)`
- Строка 74: `post_type: postType` → `post_type_id: postTypeId`
- Строка 85: `setFilters(..., postType?: string)` → `setFilters(..., postTypeId?: number)`
- Строка 88: `post_type: postType` → `post_type_id: postTypeId`
- Строка 101: `goToPage(..., postType?: string)` → `goToPage(..., postTypeId?: number)`
- Строка 104: `post_type: postType` → `post_type_id: postTypeId`
- Строка 113: `resetFilters(postType?: string)` → `resetFilters(postTypeId?: number)`
- Строка 118: `post_type: postType` → `post_type_id: postTypeId`
- Строка 127: `initialize(postType?: string)` → `initialize(postTypeId?: number)`
- Строка 132: `post_type: postType` → `post_type_id: postTypeId`

#### 4.3. Обновить `src/pages/PostTypeEditorPage/PostTypeEditorStore.ts`

**Изменения:**
- `loadPostType(slug: string)` → `loadPostType(id: number)`
- `savePostType(..., currentSlug?: string)` → `savePostType(..., currentId?: number)`
- `deletePostType(slug: string, ...)` → `deletePostType(id: number, ...)`
- `updatePostType(currentSlug, ...)` → `updatePostType(currentId, ...)`

**Файл:** `src/pages/PostTypeEditorPage/PostTypeEditorStore.ts`
- Строка 104: `loadPostType(slug: string)` → `loadPostType(id: number)`
- Строка 107: `getPostType(slug)` → `getPostType(id)`
- Строка 143: `savePostType(..., currentSlug?: string)` → `savePostType(..., currentId?: number)`
- Строка 154: `updatePostType(currentSlug, ...)` → `updatePostType(currentId, ...)`
- Строка 177: `deletePostType(slug: string, ...)` → `deletePostType(id: number, ...)`

#### 4.4. Обновить `src/pages/FormConfigPage/FormConfigStore.ts`

**Изменения:**
- `loadData(postTypeSlug: string, ...)` → `loadData(postTypeId: number, ...)`
- `saveConfig(postTypeSlug: string, ...)` → `saveConfig(postTypeId: number, ...)`
- `getPostType(postTypeSlug)` → `getPostType(postTypeId)`
- `getFormConfig(postTypeSlug, ...)` → `getFormConfig(postTypeId, ...)`
- `saveFormConfig(postTypeSlug, ...)` → `saveFormConfig(postTypeId, ...)`

**Файл:** `src/pages/FormConfigPage/FormConfigStore.ts`
- Строка 121: `loadData(postTypeSlug: string, ...)` → `loadData(postTypeId: number, ...)`
- Строка 125: `getPostType(postTypeSlug)` → `getPostType(postTypeId)`
- Строка 127: `getFormConfig(postTypeSlug, ...)` → `getFormConfig(postTypeId, ...)`
- Строка 145: `saveConfig(postTypeSlug: string, ...)` → `saveConfig(postTypeId: number, ...)`
- Строка 148: `saveFormConfig(postTypeSlug, ...)` → `saveFormConfig(postTypeId, ...)`

---

### Этап 5: Обновление утилит и трансформаций

#### 5.1. Обновить `src/pages/EntryEditorPage/transforms.ts`

**Изменения:**
- `formValues2entryPayload(..., postTypeSlug: string)` → `formValues2entryPayload(..., postTypeId: number)`
- `post_type: postTypeSlug` → `post_type_id: postTypeId`

**Файл:** `src/pages/EntryEditorPage/transforms.ts`
- Строка 40: `postTypeSlug: string` → `postTypeId: number`
- Строка 43: `post_type: postTypeSlug` → `post_type_id: postTypeId`

---

### Этап 6: Обновление компонентов и страниц

#### 6.1. Обновить `src/pages/EntryEditorPage/EntryEditorPage.tsx`

**Изменения:**
- `useParams<{ postType?: string; id: string }>()` → `useParams<{ postTypeId?: string; id: string }>()`
- `const postTypeId = postTypeIdParam ? Number(postTypeIdParam) : undefined`
- `new EntryEditorStore(postTypeId!, entryId)` (если postTypeId обязателен)
- `buildUrl(PageUrl.EntryEdit, { postType: postTypeSlug, ... })` → `buildUrl(PageUrl.EntryEdit, { postTypeId: postTypeId, ... })`
- `buildUrl(PageUrl.EntriesByType, { postType: postTypeSlug })` → `buildUrl(PageUrl.EntriesByType, { postTypeId: postTypeId })`

**Файл:** `src/pages/EntryEditorPage/EntryEditorPage.tsx`
- Получить `postTypeId` из URL параметров
- Передать `postTypeId` в `EntryEditorStore`
- Обновить все `buildUrl` вызовы

#### 6.2. Обновить `src/pages/EntriesListPage/EntriesListPage.tsx`

**Изменения:**
- `useParams<{ postType?: string }>()` → `useParams<{ postTypeId?: string }>()`
- `const postTypeId = postTypeIdParam ? Number(postTypeIdParam) : undefined`
- `getPostType(postTypeSlug)` → `getPostType(postTypeId!)` (если postTypeId есть)
- `store.initialize(postTypeSlug)` → `store.initialize(postTypeId)`
- `store.setFilters(..., postTypeSlug)` → `store.setFilters(..., postTypeId)`
- `store.goToPage(..., postTypeSlug)` → `store.goToPage(..., postTypeId)`
- `buildUrl(PageUrl.EntryEdit, { postType: postTypeSlug, ... })` → `buildUrl(PageUrl.EntryEdit, { postTypeId: postTypeId, ... })`
- `buildUrl(PageUrl.EntryEdit, { postType: postTypeSlug, id: 'new' })` → `buildUrl(PageUrl.EntryEdit, { postTypeId: postTypeId, id: 'new' })`

**Файл:** `src/pages/EntriesListPage/EntriesListPage.tsx`
- Строка 28: `const { postType: postTypeSlug }` → `const { postTypeId: postTypeIdParam }`
- Все использования `postTypeSlug` → `postTypeId`

#### 6.3. Обновить `src/pages/PostTypeEditorPage/PostTypeEditorPage.tsx`

**Изменения:**
- `useParams<{ slug?: string }>()` → `useParams<{ id?: string }>()`
- `const postTypeId = id ? Number(id) : undefined`
- `store.loadPostType(slug!)` → `store.loadPostType(postTypeId!)`
- `store.savePostType(..., slug)` → `store.savePostType(..., postTypeId)`
- `store.deletePostType(slug!)` → `store.deletePostType(postTypeId!)`
- `buildUrl(PageUrl.ContentTypesEdit, { slug: ... })` → `buildUrl(PageUrl.ContentTypesEdit, { id: ... })`
- `buildUrl(PageUrl.ContentTypesBlueprints, { slug: ... })` → `buildUrl(PageUrl.ContentTypesBlueprints, { id: ... })`
- `buildUrl(PageUrl.ContentTypesFormConfig, { slug: ..., ... })` → `buildUrl(PageUrl.ContentTypesFormConfig, { id: ..., ... })`

**Файл:** `src/pages/PostTypeEditorPage/PostTypeEditorPage.tsx`
- Все использования `slug` → `id` (число)

#### 6.4. Обновить `src/pages/FormConfigPage/FormConfigPage.tsx`

**Изменения:**
- `useParams<{ slug: string; blueprintId: string }>()` → `useParams<{ id: string; blueprintId: string }>()`
- `const postTypeId = Number(id)`
- `store.loadData(slug, ...)` → `store.loadData(postTypeId, ...)`
- `store.saveConfig(slug, ...)` → `store.saveConfig(postTypeId, ...)`
- `buildUrl(PageUrl.ContentTypesEdit, { slug: ... })` → `buildUrl(PageUrl.ContentTypesEdit, { id: ... })`

**Файл:** `src/pages/FormConfigPage/FormConfigPage.tsx`
- Все использования `slug` → `id` (число)

#### 6.5. Обновить `src/pages/PostTypeBlueprintsPage/PostTypeBlueprintsPage.tsx`

**Изменения:**
- `useParams<{ slug: string }>()` → `useParams<{ id: string }>()`
- `const postTypeId = Number(id)`
- `getPostType(slug)` → `getPostType(postTypeId)`
- `buildUrl(PageUrl.ContentTypesEdit, { slug: ... })` → `buildUrl(PageUrl.ContentTypesEdit, { id: ... })`

**Файл:** `src/pages/PostTypeBlueprintsPage/PostTypeBlueprintsPage.tsx`
- Все использования `slug` → `id` (число)

#### 6.6. Обновить `src/pages/PostTypesPage/PostTypesPage.tsx`

**Изменения:**
- `buildUrl(PageUrl.ContentTypesEdit, { slug: 'new' })` → `buildUrl(PageUrl.ContentTypesEdit, { id: 'new' })` (для создания)
- `buildUrl(PageUrl.ContentTypesEdit, { slug: postType.slug })` → `buildUrl(PageUrl.ContentTypesEdit, { id: postType.id })`
- `buildUrl(PageUrl.EntriesByType, { postType: postType.slug })` → `buildUrl(PageUrl.EntriesByType, { postTypeId: postType.id })`

**Файл:** `src/pages/PostTypesPage/PostTypesPage.tsx`
- Все использования `slug` → `id`

#### 6.7. Обновить `src/pages/EntryEditorPage/EntryEditorHeader.tsx`

**Изменения:**
- `buildUrl(PageUrl.EntriesByType, { postType: postType.slug })` → `buildUrl(PageUrl.EntriesByType, { postTypeId: postType.id })`

**Файл:** `src/pages/EntryEditorPage/EntryEditorHeader.tsx`
- Строка 48: обновить `buildUrl`

---

### Этап 7: Обновление других компонентов

#### 7.1. Проверить все компоненты, использующие `buildUrl` с `slug` или `postType`

**Файлы для проверки:**
- Все файлы из grep результатов с `buildUrl` и `slug`/`postType`

---

### Этап 8: Удаление legacy кода

#### 8.1. Удалить все неиспользуемые функции/переменные

**Что удалить:**
- Все переменные `postTypeSlug` (заменить на `postTypeId`)
- Все параметры `slug` в функциях, связанных с PostType (кроме формы создания/редактирования)
- Все упоминания `post_type` в контексте API (кроме формы)

#### 8.2. Обновить документацию

**Файлы:**
- Обновить JSDoc комментарии во всех измененных функциях
- Обновить примеры в документации

---

## ✅ Чек-лист выполнения

### Подготовка
- [ ] Создать ветку для миграции
- [ ] Убедиться, что бэкенд готов (API работает с ID)
- [ ] Создать резервную копию текущего состояния

### Типы
- [ ] Обновить `src/types/entries.ts`
- [ ] Обновить `src/types/formConfig.ts`
- [ ] Проверить `src/types/postTypes.ts` (без изменений)

### API
- [ ] Обновить `src/api/apiPostTypes.ts`
- [ ] Обновить `src/api/apiEntries.ts`
- [ ] Обновить `src/api/apiFormConfig.ts`

### Роутинг
- [ ] Обновить `src/PageUrl.ts`

### Сторы
- [ ] Обновить `src/pages/EntryEditorPage/EntryEditorStore.ts`
- [ ] Обновить `src/pages/EntriesListPage/EntriesListStore.ts`
- [ ] Обновить `src/pages/PostTypeEditorPage/PostTypeEditorStore.ts`
- [ ] Обновить `src/pages/FormConfigPage/FormConfigStore.ts`

### Утилиты
- [ ] Обновить `src/pages/EntryEditorPage/transforms.ts`

### Компоненты
- [ ] Обновить `src/pages/EntryEditorPage/EntryEditorPage.tsx`
- [ ] Обновить `src/pages/EntriesListPage/EntriesListPage.tsx`
- [ ] Обновить `src/pages/PostTypeEditorPage/PostTypeEditorPage.tsx`
- [ ] Обновить `src/pages/FormConfigPage/FormConfigPage.tsx`
- [ ] Обновить `src/pages/PostTypeBlueprintsPage/PostTypeBlueprintsPage.tsx`
- [ ] Обновить `src/pages/PostTypesPage/PostTypesPage.tsx`
- [ ] Обновить `src/pages/EntryEditorPage/EntryEditorHeader.tsx`
- [ ] Проверить все остальные компоненты

### Тестирование
- [ ] Протестировать создание записи
- [ ] Протестировать редактирование записи
- [ ] Протестировать фильтрацию записей по типу
- [ ] Протестировать создание PostType
- [ ] Протестировать редактирование PostType
- [ ] Протестировать удаление PostType
- [ ] Протестировать FormConfig API
- [ ] Протестировать навигацию между страницами
- [ ] Проверить все ссылки в приложении

### Финальная проверка
- [ ] Нет ошибок TypeScript
- [ ] Нет ошибок ESLint
- [ ] Все тесты проходят
- [ ] Нет неиспользуемых импортов
- [ ] Документация обновлена
- [ ] Код соответствует правилам проекта

---

## 🚨 Важные замечания

### 1. Обработка ID из URL

Все ID из URL параметров нужно преобразовывать в число:
```typescript
const { id: idParam } = useParams<{ id: string }>();
const postTypeId = idParam ? Number(idParam) : undefined;
```

### 2. Валидация ID

Перед использованием ID из URL нужно проверять:
- ID существует
- ID является валидным числом
- ID > 0

### 3. Обработка ошибок 404

При несуществующем PostType по ID API вернет стандартный 404. Нужно обработать это в компонентах.

### 4. Создание новых записей

При создании новой записи нужно передавать `post_type_id` вместо `post_type`:
```typescript
// ❌ Было
{ post_type: 'article' }

// ✅ Стало
{ post_type_id: 1 }
```

### 5. Навигация

Все ссылки должны использовать ID:
```typescript
// ❌ Было
buildUrl(PageUrl.ContentTypesEdit, { slug: postType.slug })

// ✅ Стало
buildUrl(PageUrl.ContentTypesEdit, { id: postType.id })
```

---

## 📝 Порядок выполнения

1. **Сначала типы** - обновить все типы данных
2. **Затем API** - обновить все API функции
3. **Потом роутинг** - обновить маршруты
4. **Далее сторы** - обновить все сторы
5. **Утилиты** - обновить трансформации
6. **Компоненты** - обновить все компоненты
7. **Тестирование** - протестировать все функции
8. **Очистка** - удалить legacy код

---

## 🎯 Критерии успеха

- ✅ Все API запросы используют ID
- ✅ Все роуты используют ID
- ✅ Все компоненты работают с ID
- ✅ Нет упоминаний `post_type` slug в API контексте (кроме формы PostType)
- ✅ Все тесты проходят
- ✅ Нет ошибок в консоли
- ✅ Навигация работает корректно

---

**Последнее обновление:** 2025-12-04  
**Статус:** 📋 Готов к выполнению

