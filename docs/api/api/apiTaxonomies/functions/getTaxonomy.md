[**admin**](../../../README.md)

***

# Function: getTaxonomy()

> **getTaxonomy**(`id`): `Promise`\<\{ `created_at?`: `string`; `hierarchical`: `boolean`; `id`: `string`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiTaxonomies.ts:40](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/api/apiTaxonomies.ts#L40)

Загружает сведения о конкретной таксономии.

## Parameters

### id

`string`

ID таксономии.

## Returns

`Promise`\<\{ `created_at?`: `string`; `hierarchical`: `boolean`; `id`: `string`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `updated_at?`: `string`; \}\>

Таксономия, прошедшая валидацию схемой `zTaxonomy`.
