[**admin**](../../../../README.md)

***

# Class: EntriesListStore

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:12](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L12)

Store для управления состоянием списка записей CMS.
Обеспечивает загрузку, фильтрацию и пагинацию записей.

## Constructors

### Constructor

> **new EntriesListStore**(): `EntriesListStore`

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:22](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L22)

#### Returns

`EntriesListStore`

## Properties

### statuses

> **statuses**: `string`[] = `[]`

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:17](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L17)

Массив возможных статусов записей.

***

### statusesPending

> **statusesPending**: `boolean` = `false`

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:20](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L20)

Флаг выполнения запроса загрузки статусов.

## Accessors

### entries

#### Get Signature

> **get** **entries**(): `object`[]

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:34](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L34)

Массив загруженных записей.

##### Returns

***

### filters

#### Get Signature

> **get** **filters**(): [`ZEntriesListParams`](../../../../types/entries/type-aliases/ZEntriesListParams.md)

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:59](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L59)

Текущие параметры фильтрации.

##### Returns

[`ZEntriesListParams`](../../../../types/entries/type-aliases/ZEntriesListParams.md)

***

### initialLoading

#### Get Signature

> **get** **initialLoading**(): `boolean`

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:54](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L54)

Флаг начальной загрузки данных.

##### Returns

`boolean`

***

### paginatedLoader

#### Get Signature

> **get** **paginatedLoader**(): [`PaginatedDataLoader`](../../../../utils/paginatedDataLoader/classes/PaginatedDataLoader.md)\<\{ `content_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `number`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \}, [`ZEntriesListParams`](../../../../types/entries/type-aliases/ZEntriesListParams.md)\>

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:64](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L64)

Универсальный загрузчик пагинированных данных.

##### Returns

[`PaginatedDataLoader`](../../../../utils/paginatedDataLoader/classes/PaginatedDataLoader.md)\<\{ `content_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `number`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \}, [`ZEntriesListParams`](../../../../types/entries/type-aliases/ZEntriesListParams.md)\>

***

### paginationLinks

#### Get Signature

> **get** **paginationLinks**(): \{ `first`: `string` \| `null`; `last`: `string` \| `null`; `next`: `string` \| `null`; `prev`: `string` \| `null`; \} \| `null`

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:44](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L44)

Ссылки пагинации.

##### Returns

\{ `first`: `string` \| `null`; `last`: `string` \| `null`; `next`: `string` \| `null`; `prev`: `string` \| `null`; \}

###### first

> **first**: `string` \| `null`

Ссылка на первую страницу.

###### last

> **last**: `string` \| `null`

Ссылка на последнюю страницу.

###### next

> **next**: `string` \| `null`

Ссылка на следующую страницу.

###### prev

> **prev**: `string` \| `null`

Ссылка на предыдущую страницу.

`null`

***

### paginationMeta

#### Get Signature

> **get** **paginationMeta**(): \{ `current_page`: `number`; `last_page`: `number`; `per_page`: `number`; `total`: `number`; \} \| `null`

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:39](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L39)

Метаданные пагинации.

##### Returns

\{ `current_page`: `number`; `last_page`: `number`; `per_page`: `number`; `total`: `number`; \}

###### current\_page

> **current\_page**: `number`

Текущая страница.

###### last\_page

> **last\_page**: `number`

Последняя страница.

###### per\_page

> **per\_page**: `number`

Количество элементов на странице.

###### total

> **total**: `number`

Общее количество элементов.

`null`

***

### pending

#### Get Signature

> **get** **pending**(): `boolean`

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:49](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L49)

Флаг выполнения запроса загрузки.

##### Returns

`boolean`

## Methods

### goToPage()

> **goToPage**(`page`, `postType?`): `Promise`\<`void`\>

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:98](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L98)

Переходит на указанную страницу.

#### Parameters

##### page

`number`

Номер страницы.

##### postType?

`string`

Slug типа контента для фильтрации.

#### Returns

`Promise`\<`void`\>

***

### initialize()

> **initialize**(`postType?`): `Promise`\<`void`\>

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:124](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L124)

Инициализирует загрузку данных при первом открытии страницы.

#### Parameters

##### postType?

`string`

Slug типа контента для фильтрации.

#### Returns

`Promise`\<`void`\>

***

### loadEntries()

> **loadEntries**(`postType?`): `Promise`\<`void`\>

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:72](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L72)

Загружает список записей с текущими фильтрами.

#### Parameters

##### postType?

`string`

Slug типа контента для фильтрации.

#### Returns

`Promise`\<`void`\>

***

### loadStatuses()

> **loadStatuses**(): `Promise`\<`void`\>

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:138](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L138)

Загружает список возможных статусов для записей.

#### Returns

`Promise`\<`void`\>

***

### resetFilters()

> **resetFilters**(`postType?`): `Promise`\<`void`\>

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:110](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L110)

Сбрасывает фильтры к значениям по умолчанию.

#### Parameters

##### postType?

`string`

Slug типа контента для фильтрации.

#### Returns

`Promise`\<`void`\>

***

### setFilters()

> **setFilters**(`filters`, `postType?`): `Promise`\<`void`\>

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:85](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntriesListPage/EntriesListStore.ts#L85)

Устанавливает фильтры и перезагружает данные.

#### Parameters

##### filters

`Partial`\<[`ZEntriesListParams`](../../../../types/entries/type-aliases/ZEntriesListParams.md)\>

Новые параметры фильтрации.

##### postType?

`string`

Slug типа контента для фильтрации.

#### Returns

`Promise`\<`void`\>
