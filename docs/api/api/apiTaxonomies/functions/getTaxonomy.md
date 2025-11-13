[**admin**](../../../README.md)

***

# Function: getTaxonomy()

> **getTaxonomy**(`slug`): `Promise`\<\{ `created_at?`: `string`; `hierarchical`: `boolean`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiTaxonomies.ts:39](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/api/apiTaxonomies.ts#L39)

Загружает сведения о конкретной таксономии.

## Parameters

### slug

`string`

Уникальный идентификатор таксономии.

## Returns

`Promise`\<\{ `created_at?`: `string`; `hierarchical`: `boolean`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `updated_at?`: `string`; \}\>

Таксономия, прошедшая валидацию схемой `zTaxonomy`.
