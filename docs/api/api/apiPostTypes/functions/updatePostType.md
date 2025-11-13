[**admin**](../../../README.md)

***

# Function: updatePostType()

> **updatePostType**(`slug`, `payload`): `Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\>; `slug`: `string`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiPostTypes.ts:54](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/api/apiPostTypes.ts#L54)

Обновляет существующий тип контента.

## Parameters

### slug

`string`

Текущий slug (идентификатор) типа контента.

### payload

Новые значения полей типа контента.

#### name

`string` = `...`

Отображаемое название типа контента. Не может быть пустым.

#### options_json

`Record`\<`string`, `unknown`\> = `...`

Дополнительные настройки в формате JSON. По умолчанию пустой объект.

#### slug

`string` = `...`

Уникальный идентификатор типа контента. Не может быть пустым.

## Returns

`Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\>; `slug`: `string`; `updated_at?`: `string`; \}\>

Обновлённый тип контента.
