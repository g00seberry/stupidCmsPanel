[**admin**](../../../README.md)

***

# Function: getEntry()

> **getEntry**(`id`): `Promise`\<\{ `content_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `number`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \}\>

Defined in: [src/api/apiEntries.ts:124](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/api/apiEntries.ts#L124)

Загружает сведения о конкретной записи по ID.

## Parameters

### id

`number`

Уникальный идентификатор записи.

## Returns

`Promise`\<\{ `content_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `number`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \}\>

Запись, прошедшая валидацию схемой `zEntry`.

## Example

```ts
const entry = await getEntry(42);
console.log(entry.title); // 'Headless CMS launch checklist'
```
