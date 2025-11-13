[**admin**](../../../README.md)

***

# Function: createPostType()

> **createPostType**(`payload`): `Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\>; `slug`: `string`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiPostTypes.ts:42](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/api/apiPostTypes.ts#L42)

Создаёт новый тип контента.

## Parameters

### payload

Данные нового типа контента.

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

Созданный тип контента.

## Example

```ts
const newType = await createPostType({
  slug: 'product',
  name: 'Products',
  options_json: { fields: { price: { type: 'number' } } }
});
```
