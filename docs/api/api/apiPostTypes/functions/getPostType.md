[**admin**](../../../README.md)

***

# Function: getPostType()

> **getPostType**(`slug`): `Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: \{\[`key`: `string`\]: `unknown`; `taxonomies`: `string`[]; \}; `slug`: `string`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiPostTypes.ts:26](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/api/apiPostTypes.ts#L26)

Загружает сведения о конкретном типе контента.

## Parameters

### slug

`string`

Уникальный идентификатор типа контента.

## Returns

`Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: \{\[`key`: `string`\]: `unknown`; `taxonomies`: `string`[]; \}; `slug`: `string`; `updated_at?`: `string`; \}\>

Тип контента, прошедший валидацию схемой `zPostType`.
