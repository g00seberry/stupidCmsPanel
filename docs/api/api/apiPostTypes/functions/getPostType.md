[**admin**](../../../README.md)

***

# Function: getPostType()

> **getPostType**(`slug`): `Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `template?`: `string` \| `null`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiPostTypes.ts:26](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/api/apiPostTypes.ts#L26)

Загружает сведения о конкретном типе контента.

## Parameters

### slug

`string`

Уникальный идентификатор типа контента.

## Returns

`Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `template?`: `string` \| `null`; `updated_at?`: `string`; \}\>

Тип контента, прошедший валидацию схемой `zPostType`.
