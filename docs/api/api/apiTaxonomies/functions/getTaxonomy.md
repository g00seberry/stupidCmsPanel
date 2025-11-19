[**admin**](../../../README.md)

***

# Function: getTaxonomy()

> **getTaxonomy**(`id`): `Promise`\<\{ `created_at?`: `string`; `hierarchical`: `boolean`; `id`: `string`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiTaxonomies.ts:40](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiTaxonomies.ts#L40)

Загружает сведения о конкретной таксономии.

## Parameters

### id

`string`

ID таксономии.

## Returns

`Promise`\<\{ `created_at?`: `string`; `hierarchical`: `boolean`; `id`: `string`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `updated_at?`: `string`; \}\>

Таксономия, прошедшая валидацию схемой `zTaxonomy`.
