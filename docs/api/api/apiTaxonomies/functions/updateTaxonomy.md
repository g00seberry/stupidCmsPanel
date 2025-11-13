[**admin**](../../../README.md)

***

# Function: updateTaxonomy()

> **updateTaxonomy**(`slug`, `payload`): `Promise`\<\{ `created_at?`: `string`; `hierarchical`: `boolean`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiTaxonomies.ts:68](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/api/apiTaxonomies.ts#L68)

Обновляет существующую таксономию.

## Parameters

### slug

`string`

Текущий slug (идентификатор) таксономии.

### payload

Новые значения полей таксономии.

#### hierarchical

`boolean` = `...`

Является ли таксономия иерархической.

#### label

`string` = `...`

Отображаемое название таксономии. Не может быть пустым.

#### options_json

`Record`\<`string`, `unknown`\> = `...`

Дополнительные настройки в формате JSON. По умолчанию пустой объект.

#### slug

`string` = `...`

Уникальный идентификатор таксономии. Не может быть пустым.

## Returns

`Promise`\<\{ `created_at?`: `string`; `hierarchical`: `boolean`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `updated_at?`: `string`; \}\>

Обновлённая таксономия.
