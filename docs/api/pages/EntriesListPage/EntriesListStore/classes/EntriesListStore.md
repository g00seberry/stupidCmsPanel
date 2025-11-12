[**admin**](../../../../README.md)

***

# Class: EntriesListStore

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:11](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/pages/EntriesListPage/EntriesListStore.ts#L11)

Store для управления состоянием списка записей CMS.
Обеспечивает загрузку, фильтрацию и пагинацию записей.

## Constructors

### Constructor

> **new EntriesListStore**(): `EntriesListStore`

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:15](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/pages/EntriesListPage/EntriesListStore.ts#L15)

#### Returns

`EntriesListStore`

## Accessors

### entries

#### Get Signature

> **get** **entries**(): `object`[]

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:27](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/pages/EntriesListPage/EntriesListStore.ts#L27)

Массив загруженных записей.

##### Returns

***

### filters

#### Get Signature

> **get** **filters**(): [`ZEntriesListParams`](../../../../types/entries/type-aliases/ZEntriesListParams.md)

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:52](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/pages/EntriesListPage/EntriesListStore.ts#L52)

Текущие параметры фильтрации.

##### Returns

[`ZEntriesListParams`](../../../../types/entries/type-aliases/ZEntriesListParams.md)

***

### initialLoading

#### Get Signature

> **get** **initialLoading**(): `boolean`

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:47](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/pages/EntriesListPage/EntriesListStore.ts#L47)

Флаг начальной загрузки данных.

##### Returns

`boolean`

***

### paginatedLoader

#### Get Signature

> **get** **paginatedLoader**(): [`PaginatedDataLoader`](../../../../utils/paginatedDataLoader/classes/PaginatedDataLoader.md)\<\{ `content_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `number`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \}, [`ZEntriesListParams`](../../../../types/entries/type-aliases/ZEntriesListParams.md)\>

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:57](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/pages/EntriesListPage/EntriesListStore.ts#L57)

Универсальный загрузчик пагинированных данных.

##### Returns

[`PaginatedDataLoader`](../../../../utils/paginatedDataLoader/classes/PaginatedDataLoader.md)\<\{ `content_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `number`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \}, [`ZEntriesListParams`](../../../../types/entries/type-aliases/ZEntriesListParams.md)\>

***

### paginationLinks

#### Get Signature

> **get** **paginationLinks**(): \{ `first`: `string` \| `null`; `last`: `string` \| `null`; `next`: `string` \| `null`; `prev`: `string` \| `null`; \} \| `null`

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:37](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/pages/EntriesListPage/EntriesListStore.ts#L37)

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

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:32](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/pages/EntriesListPage/EntriesListStore.ts#L32)

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

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:42](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/pages/EntriesListPage/EntriesListStore.ts#L42)

Флаг выполнения запроса загрузки.

##### Returns

`boolean`

## Methods

### goToPage()

> **goToPage**(`page`, `postType?`): `Promise`\<`void`\>

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:91](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/pages/EntriesListPage/EntriesListStore.ts#L91)

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

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:117](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/pages/EntriesListPage/EntriesListStore.ts#L117)

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

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:65](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/pages/EntriesListPage/EntriesListStore.ts#L65)

Загружает список записей с текущими фильтрами.

#### Parameters

##### postType?

`string`

Slug типа контента для фильтрации.

#### Returns

`Promise`\<`void`\>

***

### resetFilters()

> **resetFilters**(`postType?`): `Promise`\<`void`\>

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:103](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/pages/EntriesListPage/EntriesListStore.ts#L103)

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

Defined in: [src/pages/EntriesListPage/EntriesListStore.ts:78](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/pages/EntriesListPage/EntriesListStore.ts#L78)

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
