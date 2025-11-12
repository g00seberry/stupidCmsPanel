[**admin**](../../../README.md)

***

# Function: updatePostType()

> **updatePostType**(`slug`, `payload`): `Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `template?`: `string` \| `null`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiPostTypes.ts:55](https://github.com/g00seberry/stupidCmsPanel/blob/b46ec655471b9baff665cdcaf149a74d55508713/src/api/apiPostTypes.ts#L55)

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

#### template?

`string` \| `null` = `...`

Имя шаблона для рендеринга. Может быть `null` или `undefined`.

## Returns

`Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `template?`: `string` \| `null`; `updated_at?`: `string`; \}\>

Обновлённый тип контента.
