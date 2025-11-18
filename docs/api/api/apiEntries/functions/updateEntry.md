[**admin**](../../../README.md)

***

# Function: updateEntry()

> **updateEntry**(`id`, `payload`): `Promise`\<\{ `content_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `string`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiEntries.ts:170](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/api/apiEntries.ts#L170)

Обновляет существующую запись.

## Parameters

### id

`string`

Идентификатор записи для обновления.

### payload

Новые значения полей записи.

#### content_json?

`Record`\<`string`, `unknown`\> \| `null` = `...`

Содержимое записи в формате JSON.

#### is_published?

`boolean` = `...`

Флаг публикации записи.

#### meta_json?

`Record`\<`string`, `unknown`\> \| `null` = `...`

Метаданные записи в формате JSON.

#### post_type?

`string` = `...`

Тип контента записи (slug типа). Обязателен при создании.

#### published_at?

`string` \| `null` = `...`

Дата публикации в формате ISO 8601. Может быть `null`.

#### slug

`string` = `...`

URL-friendly идентификатор записи.

#### template_override?

`string` \| `null` = `...`

Переопределение шаблона для записи. Может быть `null`.

#### term_ids?

`string`[] = `...`

Массив ID терминов для связи с записью.

#### title

`string` = `...`

Заголовок записи.

## Returns

`Promise`\<\{ `content_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `string`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \}\>

Обновлённая запись.

## Example

```ts
const updatedEntry = await updateEntry(42, {
  title: 'Updated checklist',
  content_json: { body: { blocks: [] } }
});
```
