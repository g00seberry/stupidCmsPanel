[**admin**](../../../README.md)

***

# Function: listTerms()

> **listTerms**(`taxonomyId`, `params?`): `Promise`\<\{ `data`: `object`[]; `links`: \{ `first`: `string` \| `null`; `last`: `string` \| `null`; `next`: `string` \| `null`; `prev`: `string` \| `null`; \}; `meta`: \{ `current_page`: `number`; `last_page`: `number`; `per_page`: `number`; `total`: `number`; \}; \}\>

Defined in: [src/api/apiTerms.ts:19](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/api/apiTerms.ts#L19)

Загружает список терминов для указанной таксономии с фильтрами и пагинацией.

## Parameters

### taxonomyId

`string`

ID таксономии, для которой нужно получить термины.

### params?

[`ListTermsParams`](../../../types/terms/type-aliases/ListTermsParams.md)

Параметры фильтрации, сортировки и пагинации.

## Returns

`Promise`\<\{ `data`: `object`[]; `links`: \{ `first`: `string` \| `null`; `last`: `string` \| `null`; `next`: `string` \| `null`; `prev`: `string` \| `null`; \}; `meta`: \{ `current_page`: `number`; `last_page`: `number`; `per_page`: `number`; `total`: `number`; \}; \}\>

Объект с массивом терминов, метаданными пагинации и ссылками.

## Example

```ts
const result = await listTerms(1, { q: 'guides', sort: 'name.asc', page: 1, per_page: 15 });
console.log(result.data); // Массив терминов
console.log(result.meta.total); // Общее количество
```
