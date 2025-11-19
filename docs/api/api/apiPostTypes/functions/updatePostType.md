[**admin**](../../../README.md)

***

# Function: updatePostType()

> **updatePostType**(`slug`, `payload`): `Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: \{\[`key`: `string`\]: `unknown`; `taxonomies`: `string`[]; \}; `slug`: `string`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiPostTypes.ts:54](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiPostTypes.ts#L54)

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

\{\[`key`: `string`\]: `unknown`; `taxonomies`: `string`[]; \} = `...`

Дополнительные настройки в формате JSON. По умолчанию пустой объект.

#### options_json.taxonomies

`string`[] = `...`

Массив slug'ов разрешённых таксономий. Если пуст или отсутствует, разрешены все таксономии.

#### slug

`string` = `...`

Уникальный идентификатор типа контента. Не может быть пустым.

## Returns

`Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: \{\[`key`: `string`\]: `unknown`; `taxonomies`: `string`[]; \}; `slug`: `string`; `updated_at?`: `string`; \}\>

Обновлённый тип контента.
