[**admin**](../../../README.md)

***

# Function: getPostType()

> **getPostType**(`slug`): `Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `template?`: `string` \| `null`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiPostTypes.ts:26](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/api/apiPostTypes.ts#L26)

Загружает сведения о конкретном типе контента.

## Parameters

### slug

`string`

Уникальный идентификатор типа контента.

## Returns

`Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `template?`: `string` \| `null`; `updated_at?`: `string`; \}\>

Тип контента, прошедший валидацию схемой `zPostType`.
