[**admin**](../../../README.md)

***

# Type Alias: ZEntriesListParams

> **ZEntriesListParams** = `object`

Defined in: [src/types/entries.ts:94](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/entries.ts#L94)

Параметры запроса списка записей.

## Properties

### author\_id?

> `optional` **author\_id**: [`ZId`](../../ZId/type-aliases/ZId.md)

Defined in: [src/types/entries.ts:102](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/entries.ts#L102)

ID автора.

***

### date\_field?

> `optional` **date\_field**: `"updated"` \| `"published"`

Defined in: [src/types/entries.ts:106](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/entries.ts#L106)

Поле даты для диапазона: updated, published. По умолчанию: updated.

***

### date\_from?

> `optional` **date\_from**: `string`

Defined in: [src/types/entries.ts:108](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/entries.ts#L108)

Начальная дата диапазона (ISO 8601).

***

### date\_to?

> `optional` **date\_to**: `string`

Defined in: [src/types/entries.ts:110](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/entries.ts#L110)

Конечная дата диапазона (ISO 8601, >= date_from).

***

### page?

> `optional` **page**: `number`

Defined in: [src/types/entries.ts:122](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/entries.ts#L122)

Номер страницы (>=1). По умолчанию: 1.

***

### per\_page?

> `optional` **per\_page**: `number`

Defined in: [src/types/entries.ts:120](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/entries.ts#L120)

Количество элементов на странице (10-100). По умолчанию: 15.

***

### post\_type?

> `optional` **post\_type**: `string`

Defined in: [src/types/entries.ts:96](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/entries.ts#L96)

Фильтр по slug типа контента.

***

### q?

> `optional` **q**: `string`

Defined in: [src/types/entries.ts:100](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/entries.ts#L100)

Поиск по названию/slug.

***

### sort?

> `optional` **sort**: `"updated_at.desc"` \| `"updated_at.asc"` \| `"published_at.desc"` \| `"published_at.asc"` \| `"title.asc"` \| `"title.desc"`

Defined in: [src/types/entries.ts:112](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/entries.ts#L112)

Поле сортировки: updated_at.desc, updated_at.asc, published_at.desc, published_at.asc, title.asc, title.desc. По умолчанию: updated_at.desc.

***

### status?

> `optional` **status**: `"all"` \| `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`

Defined in: [src/types/entries.ts:98](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/entries.ts#L98)

Фильтр по статусу: all, draft, published, scheduled, trashed. По умолчанию: all.

***

### term?

> `optional` **term**: [`ZId`](../../ZId/type-aliases/ZId.md)[]

Defined in: [src/types/entries.ts:104](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/entries.ts#L104)

Массив ID терминов для фильтрации.
