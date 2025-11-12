[**admin**](../../../README.md)

***

# Function: getPostType()

> **getPostType**(`slug`): `Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `template?`: `string` \| `null`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiPostTypes.ts:26](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/api/apiPostTypes.ts#L26)

Загружает сведения о конкретном типе контента.

## Parameters

### slug

`string`

Уникальный идентификатор типа контента.

## Returns

`Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `template?`: `string` \| `null`; `updated_at?`: `string`; \}\>

Тип контента, прошедший валидацию схемой `zPostType`.
