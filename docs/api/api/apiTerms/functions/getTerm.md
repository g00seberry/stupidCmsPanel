[**admin**](../../../README.md)

***

# Function: getTerm()

> **getTerm**(`termId`): `Promise`\<\{ `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `string`; `meta_json`: `unknown`; `name`: `string`; `parent_id?`: `string` \| `null`; `taxonomy`: `string`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiTerms.ts:58](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiTerms.ts#L58)

Загружает сведения о конкретном термине.

## Parameters

### termId

`string`

Уникальный идентификатор термина.

## Returns

`Promise`\<\{ `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `string`; `meta_json`: `unknown`; `name`: `string`; `parent_id?`: `string` \| `null`; `taxonomy`: `string`; `updated_at?`: `string`; \}\>

Термин, прошедший валидацию схемой `zTerm`.
