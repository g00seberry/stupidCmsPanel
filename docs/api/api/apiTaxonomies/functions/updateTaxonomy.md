[**admin**](../../../README.md)

***

# Function: updateTaxonomy()

> **updateTaxonomy**(`id`, `payload`): `Promise`\<\{ `created_at?`: `string`; `hierarchical`: `boolean`; `id`: `string`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiTaxonomies.ts:68](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiTaxonomies.ts#L68)

Обновляет существующую таксономию.

## Parameters

### id

`string`

ID таксономии.

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

## Returns

`Promise`\<\{ `created_at?`: `string`; `hierarchical`: `boolean`; `id`: `string`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `updated_at?`: `string`; \}\>

Обновлённая таксономия.
