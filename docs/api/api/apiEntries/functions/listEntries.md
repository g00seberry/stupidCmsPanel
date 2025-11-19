[**admin**](../../../README.md)

***

# Function: listEntries()

> **listEntries**(`params`): `Promise`\<\{ `data`: `object`[]; `links`: \{ `first`: `string` \| `null`; `last`: `string` \| `null`; `next`: `string` \| `null`; `prev`: `string` \| `null`; \}; `meta`: \{ `current_page`: `number`; `last_page`: `number`; `per_page`: `number`; `total`: `number`; \}; \}\>

Defined in: [src/api/apiEntries.ts:95](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiEntries.ts#L95)

Загружает список записей с фильтрами и пагинацией.

## Parameters

### params

[`ZEntriesListParams`](../../../types/entries/type-aliases/ZEntriesListParams.md) = `{}`

Параметры фильтрации и пагинации.

## Returns

`Promise`\<\{ `data`: `object`[]; `links`: \{ `first`: `string` \| `null`; `last`: `string` \| `null`; `next`: `string` \| `null`; `prev`: `string` \| `null`; \}; `meta`: \{ `current_page`: `number`; `last_page`: `number`; `per_page`: `number`; `total`: `number`; \}; \}\>

Объект с массивом записей, метаданными пагинации и ссылками.

## Example

```ts
const result = await listEntries({
  post_type: 'article',
  status: 'published',
  per_page: 20,
  page: 1
});
console.log(result.data); // Массив записей
console.log(result.meta.total); // Общее количество
```
