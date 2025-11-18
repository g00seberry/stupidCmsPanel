[**admin**](../../../README.md)

***

# Function: createTerm()

> **createTerm**(`taxonomyId`, `payload`): `Promise`\<\{ `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `string`; `meta_json`: `unknown`; `name`: `string`; `parent_id?`: `string` \| `null`; `taxonomy`: `string`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiTerms.ts:74](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/api/apiTerms.ts#L74)

Создаёт новый термин в указанной таксономии.

## Parameters

### taxonomyId

`string`

ID таксономии, в которой создаётся термин.

### payload

Данные нового термина.

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

Созданный термин.

## Example

```ts
const newTerm = await createTerm(1, {
  name: 'Guides',
  meta_json: { color: '#ffcc00' }
});
```
