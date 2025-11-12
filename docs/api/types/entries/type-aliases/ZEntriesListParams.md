[**admin**](../../../README.md)

***

# Type Alias: ZEntriesListParams

> **ZEntriesListParams** = `object`

Defined in: [src/types/entries.ts:78](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/types/entries.ts#L78)

Параметры запроса списка записей.

## Properties

### author\_id?

> `optional` **author\_id**: `number`

Defined in: [src/types/entries.ts:86](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/types/entries.ts#L86)

ID автора.

***

### date\_field?

> `optional` **date\_field**: `"updated"` \| `"published"`

Defined in: [src/types/entries.ts:90](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/types/entries.ts#L90)

Поле даты для диапазона: updated, published. По умолчанию: updated.

***

### date\_from?

> `optional` **date\_from**: `string`

Defined in: [src/types/entries.ts:92](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/types/entries.ts#L92)

Начальная дата диапазона (ISO 8601).

***

### date\_to?

> `optional` **date\_to**: `string`

Defined in: [src/types/entries.ts:94](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/types/entries.ts#L94)

Конечная дата диапазона (ISO 8601, >= date_from).

***

### page?

> `optional` **page**: `number`

Defined in: [src/types/entries.ts:106](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/types/entries.ts#L106)

Номер страницы (>=1). По умолчанию: 1.

***

### per\_page?

> `optional` **per\_page**: `number`

Defined in: [src/types/entries.ts:104](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/types/entries.ts#L104)

Количество элементов на странице (10-100). По умолчанию: 15.

***

### post\_type?

> `optional` **post\_type**: `string`

Defined in: [src/types/entries.ts:80](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/types/entries.ts#L80)

Фильтр по slug типа контента.

***

### q?

> `optional` **q**: `string`

Defined in: [src/types/entries.ts:84](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/types/entries.ts#L84)

Поиск по названию/slug.

***

### sort?

> `optional` **sort**: `"updated_at.desc"` \| `"updated_at.asc"` \| `"published_at.desc"` \| `"published_at.asc"` \| `"title.asc"` \| `"title.desc"`

Defined in: [src/types/entries.ts:96](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/types/entries.ts#L96)

Поле сортировки: updated_at.desc, updated_at.asc, published_at.desc, published_at.asc, title.asc, title.desc. По умолчанию: updated_at.desc.

***

### status?

> `optional` **status**: `"all"` \| `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`

Defined in: [src/types/entries.ts:82](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/types/entries.ts#L82)

Фильтр по статусу: all, draft, published, scheduled, trashed. По умолчанию: all.

***

### term?

> `optional` **term**: `number`[]

Defined in: [src/types/entries.ts:88](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/types/entries.ts#L88)

Массив ID терминов для фильтрации.
