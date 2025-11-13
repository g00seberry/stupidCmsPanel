[**admin**](../../../README.md)

***

# Type Alias: ZEntriesListParams

> **ZEntriesListParams** = `object`

Defined in: [src/types/entries.ts:91](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/entries.ts#L91)

Параметры запроса списка записей.

## Properties

### author\_id?

> `optional` **author\_id**: `number`

Defined in: [src/types/entries.ts:99](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/entries.ts#L99)

ID автора.

***

### date\_field?

> `optional` **date\_field**: `"updated"` \| `"published"`

Defined in: [src/types/entries.ts:103](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/entries.ts#L103)

Поле даты для диапазона: updated, published. По умолчанию: updated.

***

### date\_from?

> `optional` **date\_from**: `string`

Defined in: [src/types/entries.ts:105](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/entries.ts#L105)

Начальная дата диапазона (ISO 8601).

***

### date\_to?

> `optional` **date\_to**: `string`

Defined in: [src/types/entries.ts:107](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/entries.ts#L107)

Конечная дата диапазона (ISO 8601, >= date_from).

***

### page?

> `optional` **page**: `number`

Defined in: [src/types/entries.ts:119](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/entries.ts#L119)

Номер страницы (>=1). По умолчанию: 1.

***

### per\_page?

> `optional` **per\_page**: `number`

Defined in: [src/types/entries.ts:117](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/entries.ts#L117)

Количество элементов на странице (10-100). По умолчанию: 15.

***

### post\_type?

> `optional` **post\_type**: `string`

Defined in: [src/types/entries.ts:93](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/entries.ts#L93)

Фильтр по slug типа контента.

***

### q?

> `optional` **q**: `string`

Defined in: [src/types/entries.ts:97](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/entries.ts#L97)

Поиск по названию/slug.

***

### sort?

> `optional` **sort**: `"updated_at.desc"` \| `"updated_at.asc"` \| `"published_at.desc"` \| `"published_at.asc"` \| `"title.asc"` \| `"title.desc"`

Defined in: [src/types/entries.ts:109](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/entries.ts#L109)

Поле сортировки: updated_at.desc, updated_at.asc, published_at.desc, published_at.asc, title.asc, title.desc. По умолчанию: updated_at.desc.

***

### status?

> `optional` **status**: `"all"` \| `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`

Defined in: [src/types/entries.ts:95](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/entries.ts#L95)

Фильтр по статусу: all, draft, published, scheduled, trashed. По умолчанию: all.

***

### term?

> `optional` **term**: `number`[]

Defined in: [src/types/entries.ts:101](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/entries.ts#L101)

Массив ID терминов для фильтрации.
