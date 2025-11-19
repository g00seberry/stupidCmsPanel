[**admin**](../../../README.md)

***

# Type Alias: ZMediaListParams

> **ZMediaListParams** = `object`

Defined in: [src/types/media.ts:295](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L295)

Параметры запроса списка медиа-файлов.

## Properties

### deleted?

> `optional` **deleted**: `"with"` \| `"only"`

Defined in: [src/types/media.ts:303](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L303)

Управление soft-deleted: with (включая удаленные), only (только удаленные).

***

### kind?

> `optional` **kind**: `"image"` \| `"video"` \| `"audio"` \| `"document"`

Defined in: [src/types/media.ts:299](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L299)

Фильтр по типу медиа: image, video, audio, document.

***

### mime?

> `optional` **mime**: `string`

Defined in: [src/types/media.ts:301](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L301)

Фильтр по MIME-типу (префиксный поиск).

***

### order?

> `optional` **order**: `"asc"` \| `"desc"`

Defined in: [src/types/media.ts:307](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L307)

Направление сортировки: asc, desc. По умолчанию: desc.

***

### page?

> `optional` **page**: `number`

Defined in: [src/types/media.ts:311](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L311)

Номер страницы (>=1). По умолчанию: 1.

***

### per\_page?

> `optional` **per\_page**: `number`

Defined in: [src/types/media.ts:309](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L309)

Размер страницы (1-100). По умолчанию: 15.

***

### q?

> `optional` **q**: `string`

Defined in: [src/types/media.ts:297](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L297)

Поиск по названию и исходному имени файла.

***

### sort?

> `optional` **sort**: `"created_at"` \| `"size_bytes"` \| `"mime"`

Defined in: [src/types/media.ts:305](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L305)

Поле сортировки: created_at, size_bytes, mime. По умолчанию: created_at.
