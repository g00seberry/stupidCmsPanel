[**admin**](../../../README.md)

***

# Function: updateTerm()

> **updateTerm**(`termId`, `payload`): `Promise`\<\{ `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `string`; `meta_json`: `unknown`; `name`: `string`; `parent_id?`: `string` \| `null`; `taxonomy`: `string`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiTerms.ts:86](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/api/apiTerms.ts#L86)

Обновляет существующий термин.

## Parameters

### termId

`string`

ID термина для обновления.

### payload

Новые значения полей термина.

#### meta_json

`unknown` = `...`

Дополнительные метаданные в формате JSON. По умолчанию пустой объект.

#### name

`string` = `...`

Отображаемое название термина. Не может быть пустым.

#### parent_id?

`string` \| `null` = `...`

ID родительского термина для иерархических таксономий. `null` для корневых терминов.

## Returns

`Promise`\<\{ `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `string`; `meta_json`: `unknown`; `name`: `string`; `parent_id?`: `string` \| `null`; `taxonomy`: `string`; `updated_at?`: `string`; \}\>

Обновлённый термин.
