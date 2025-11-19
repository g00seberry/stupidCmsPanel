[**admin**](../../../../README.md)

***

# Class: MediaListStore

Defined in: [src/pages/MediaListPage/MediaListStore.ts:25](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L25)

Store для управления состоянием списка медиа-файлов.
Обеспечивает загрузку, фильтрацию, пагинацию и массовые операции с медиа.

## Constructors

### Constructor

> **new MediaListStore**(): `MediaListStore`

Defined in: [src/pages/MediaListPage/MediaListStore.ts:41](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L41)

#### Returns

`MediaListStore`

## Properties

### config

> **config**: \{ `allowed_mimes`: `string`[]; `image_variants`: `Record`\<`string`, \{ `format`: `string` \| `null`; `max`: `number`; `quality`: `number` \| `null`; \}\>; `max_upload_mb`: `number`; \} \| `null` = `null`

Defined in: [src/pages/MediaListPage/MediaListStore.ts:30](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L30)

Конфигурация системы медиа-файлов.

#### Type Declaration

\{ `allowed_mimes`: `string`[]; `image_variants`: `Record`\<`string`, \{ `format`: `string` \| `null`; `max`: `number`; `quality`: `number` \| `null`; \}\>; `max_upload_mb`: `number`; \}

#### allowed\_mimes

> **allowed\_mimes**: `string`[]

Массив разрешенных MIME-типов файлов.

#### image\_variants

> **image\_variants**: `Record`\<`string`, \{ `format`: `string` \| `null`; `max`: `number`; `quality`: `number` \| `null`; \}\>

Объект доступных вариантов изображений, где ключ - название варианта (thumbnail, medium, large).

#### max\_upload\_mb

> **max\_upload\_mb**: `number`

Максимальный размер файла в мегабайтах.

`null`

***

### configPending

> **configPending**: `boolean` = `false`

Defined in: [src/pages/MediaListPage/MediaListStore.ts:33](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L33)

Флаг выполнения запроса загрузки конфигурации.

***

### filterStore

> `readonly` **filterStore**: [`FilterFormStore`](../../../../components/FilterForm/FilterFormStore/classes/FilterFormStore.md)

Defined in: [src/pages/MediaListPage/MediaListStore.ts:39](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L39)

Store для управления формой фильтрации.

***

### loader

> `readonly` **loader**: [`PaginatedDataLoader`](../../../../utils/paginatedDataLoader/classes/PaginatedDataLoader.md)\<\{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `height`: `number`; `id`: `string`; `kind`: `"image"`; `mime`: `string`; `name`: `string`; `preview_urls`: \{ `large`: `string`; `medium`: `string`; `thumbnail`: `string`; \}; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `width`: `number`; \} \| \{ `alt`: `string` \| `null`; `audio_codec`: `string`; `bitrate_kbps`: `number`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms`: `number`; `ext`: `string`; `frame_count`: `number`; `frame_rate`: `number`; `id`: `string`; `kind`: `"video"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `video_codec`: `string`; \} \| \{ `alt`: `string` \| `null`; `audio_codec?`: `string` \| `null`; `bitrate_kbps?`: `number` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms?`: `number` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"audio"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \} \| \{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"document"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \}, [`ZMediaListParams`](../../../../types/media/type-aliases/ZMediaListParams.md)\>

Defined in: [src/pages/MediaListPage/MediaListStore.ts:27](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L27)

Универсальный загрузчик пагинированных данных.

***

### selectedIds

> **selectedIds**: `ObservableSet`\<`string`\>

Defined in: [src/pages/MediaListPage/MediaListStore.ts:36](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L36)

Множество выбранных идентификаторов медиа-файлов.

## Accessors

### hasSelection

#### Get Signature

> **get** **hasSelection**(): `boolean`

Defined in: [src/pages/MediaListPage/MediaListStore.ts:52](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L52)

Флаг наличия выбранных элементов.

##### Returns

`boolean`

***

### selectedCount

#### Get Signature

> **get** **selectedCount**(): `number`

Defined in: [src/pages/MediaListPage/MediaListStore.ts:47](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L47)

Количество выбранных медиа-файлов.

##### Returns

`number`

## Methods

### bulkDelete()

> **bulkDelete**(`ids`): `Promise`\<`void`\>

Defined in: [src/pages/MediaListPage/MediaListStore.ts:157](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L157)

Выполняет массовое мягкое удаление медиа-файлов.

#### Parameters

##### ids

`string`[]

Массив ULID идентификаторов медиа-файлов для удаления.

#### Returns

`Promise`\<`void`\>

***

### bulkForceDelete()

> **bulkForceDelete**(`ids`): `Promise`\<`void`\>

Defined in: [src/pages/MediaListPage/MediaListStore.ts:173](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L173)

Выполняет окончательное удаление медиа-файлов.

#### Parameters

##### ids

`string`[]

Массив ULID идентификаторов медиа-файлов для окончательного удаления.

#### Returns

`Promise`\<`void`\>

***

### bulkRestore()

> **bulkRestore**(`ids`): `Promise`\<`void`\>

Defined in: [src/pages/MediaListPage/MediaListStore.ts:165](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L165)

Выполняет массовое восстановление мягко удаленных медиа-файлов.

#### Parameters

##### ids

`string`[]

Массив ULID идентификаторов медиа-файлов для восстановления.

#### Returns

`Promise`\<`void`\>

***

### deselectAll()

> **deselectAll**(): `void`

Defined in: [src/pages/MediaListPage/MediaListStore.ts:141](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L141)

Снимает выбор со всех медиа-файлов.

#### Returns

`void`

***

### deselectMedia()

> **deselectMedia**(`id`): `void`

Defined in: [src/pages/MediaListPage/MediaListStore.ts:125](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L125)

Снимает выбор с медиа-файла.

#### Parameters

##### id

`string`

ULID идентификатор медиа-файла.

#### Returns

`void`

***

### getSelectedIds()

> **getSelectedIds**(): `string`[]

Defined in: [src/pages/MediaListPage/MediaListStore.ts:149](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L149)

Возвращает массив выбранных идентификаторов.

#### Returns

`string`[]

Массив ULID идентификаторов выбранных медиа-файлов.

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [src/pages/MediaListPage/MediaListStore.ts:74](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L74)

Инициализирует загрузку данных при первом открытии страницы.

#### Returns

`Promise`\<`void`\>

***

### loadConfig()

> **loadConfig**(): `Promise`\<`void`\>

Defined in: [src/pages/MediaListPage/MediaListStore.ts:101](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L101)

Загружает конфигурацию системы медиа-файлов.

#### Returns

`Promise`\<`void`\>

***

### loadMedia()

> **loadMedia**(): `Promise`\<`void`\>

Defined in: [src/pages/MediaListPage/MediaListStore.ts:59](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L59)

Загружает список медиа-файлов с текущими фильтрами.

#### Returns

`Promise`\<`void`\>

***

### resetFilters()

> **resetFilters**(): `Promise`\<`void`\>

Defined in: [src/pages/MediaListPage/MediaListStore.ts:66](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L66)

Сбрасывает фильтры к значениям по умолчанию.

#### Returns

`Promise`\<`void`\>

***

### selectAll()

> **selectAll**(): `void`

Defined in: [src/pages/MediaListPage/MediaListStore.ts:132](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L132)

Выбирает все медиа-файлы на текущей странице.

#### Returns

`void`

***

### selectMedia()

> **selectMedia**(`id`): `void`

Defined in: [src/pages/MediaListPage/MediaListStore.ts:117](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L117)

Выбирает медиа-файл.

#### Parameters

##### id

`string`

ULID идентификатор медиа-файла.

#### Returns

`void`

***

### setConfig()

> **setConfig**(`config`): `void`

Defined in: [src/pages/MediaListPage/MediaListStore.ts:86](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L86)

Устанавливает конфигурацию системы медиа-файлов.

#### Parameters

##### config

Конфигурация системы медиа-файлов.

\{ `allowed_mimes`: `string`[]; `image_variants`: `Record`\<`string`, \{ `format`: `string` \| `null`; `max`: `number`; `quality`: `number` \| `null`; \}\>; `max_upload_mb`: `number`; \}

Конфигурация системы медиа-файлов.

###### allowed_mimes

`string`[] = `...`

Массив разрешенных MIME-типов файлов.

###### image_variants

`Record`\<`string`, \{ `format`: `string` \| `null`; `max`: `number`; `quality`: `number` \| `null`; \}\> = `...`

Объект доступных вариантов изображений, где ключ - название варианта (thumbnail, medium, large).

###### max_upload_mb

`number` = `...`

Максимальный размер файла в мегабайтах.

| `null`

#### Returns

`void`

***

### setConfigPending()

> **setConfigPending**(`pending`): `void`

Defined in: [src/pages/MediaListPage/MediaListStore.ts:94](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaListPage/MediaListStore.ts#L94)

Устанавливает флаг выполнения запроса загрузки конфигурации.

#### Parameters

##### pending

`boolean`

Значение флага.

#### Returns

`void`
