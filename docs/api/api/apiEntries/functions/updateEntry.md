[**admin**](../../../README.md)

---

# Function: updateEntry()

> **updateEntry**(`id`, `payload`): `Promise`\<\{ `data_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `string`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiEntries.ts:170](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiEntries.ts#L170)

Обновляет существующую запись.

## Parameters

### id

`string`

Идентификатор записи для обновления.

### payload

Новые значения полей записи.

#### data_json?

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

`Promise`\<\{ `data_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `string`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \}\>

Обновлённая запись.

## Example

```ts
const updatedEntry = await updateEntry(42, {
  title: 'Updated checklist',
  data_json: { body: { blocks: [] } },
});
```
