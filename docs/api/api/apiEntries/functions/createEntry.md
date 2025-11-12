[**admin**](../../../README.md)

***

# Function: createEntry()

> **createEntry**(`payload`): `Promise`\<\{ `content_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `number`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiEntries.ts:143](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/api/apiEntries.ts#L143)

Создаёт новую запись.

## Parameters

### payload

Данные новой записи.

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

`number`[] = `...`

Массив ID терминов для связи с записью.

#### title

`string` = `...`

Заголовок записи.

## Returns

`Promise`\<\{ `content_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `number`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \}\>

Созданная запись.

## Example

```ts
const newEntry = await createEntry({
  post_type: 'article',
  title: 'Headless CMS launch checklist',
  slug: 'launch-checklist',
  content_json: { hero: { title: 'Launch' } },
  meta_json: { title: 'Launch', description: 'Checklist' }
});
```
