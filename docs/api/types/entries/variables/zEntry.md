[**admin**](../../../README.md)

***

# Variable: zEntry

> `const` **zEntry**: `ZodObject`\<\{ `content_json`: `ZodDefault`\<`ZodOptional`\<`ZodNullable`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>\>\>; `created_at`: `ZodOptional`\<`ZodString`\>; `deleted_at`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `id`: `ZodNumber`; `is_published`: `ZodBoolean`; `meta_json`: `ZodDefault`\<`ZodOptional`\<`ZodNullable`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>\>\>; `post_type`: `ZodString`; `published_at`: `ZodNullable`\<`ZodString`\>; `slug`: `ZodString`; `status`: `ZodEnum`\<\{ `draft`: `"draft"`; `published`: `"published"`; `scheduled`: `"scheduled"`; `trashed`: `"trashed"`; \}\>; `template_override`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `title`: `ZodString`; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [src/types/entries.ts:24](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/types/entries.ts#L24)

Схема валидации записи CMS.
Запись представляет собой единицу контента определённого типа.

## Example

```ts
const entry: ZEntry = {
  id: 42,
  post_type: 'article',
  title: 'Headless CMS launch checklist',
  slug: 'launch-checklist',
  status: 'published',
  is_published: true,
  published_at: '2025-02-10T08:00:00+00:00',
  content_json: { hero: { title: 'Launch' } },
  meta_json: { title: 'Launch', description: 'Checklist' },
  template_override: 'templates.landing',
  created_at: '2025-02-09T10:15:00+00:00',
  updated_at: '2025-02-10T08:05:00+00:00',
  deleted_at: null
};
```
