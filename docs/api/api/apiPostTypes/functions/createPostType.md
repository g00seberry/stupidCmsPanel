[**admin**](../../../README.md)

***

# Function: createPostType()

> **createPostType**(`payload`): `Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `template?`: `string` \| `null`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiPostTypes.ts:43](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/api/apiPostTypes.ts#L43)

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

#### template?

`string` \| `null` = `...`

Имя шаблона для рендеринга. Может быть `null` или `undefined`.

## Returns

`Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `template?`: `string` \| `null`; `updated_at?`: `string`; \}\>

Созданный тип контента.

## Example

```ts
const newType = await createPostType({
  slug: 'article',
  name: 'Статья',
  template: 'article-template',
  options_json: { allowComments: true }
});
```
