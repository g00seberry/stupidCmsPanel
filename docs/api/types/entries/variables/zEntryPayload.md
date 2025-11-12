[**admin**](../../../README.md)

***

# Variable: zEntryPayload

> `const` **zEntryPayload**: `ZodObject`\<\{ `content_json`: `ZodOptional`\<`ZodOptional`\<`ZodNullable`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>\>\>; `is_published`: `ZodOptional`\<`ZodBoolean`\>; `meta_json`: `ZodOptional`\<`ZodOptional`\<`ZodNullable`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>\>\>; `post_type`: `ZodOptional`\<`ZodString`\>; `published_at`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `slug`: `ZodString`; `template_override`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `term_ids`: `ZodOptional`\<`ZodArray`\<`ZodNumber`\>\>; `title`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/entries.ts:150](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/types/entries.ts#L150)

Схема валидации данных для создания или обновления записи.

## Example

```ts
const payload: ZEntryPayload = {
  post_type: 'article',
  title: 'Headless CMS launch checklist',
  slug: 'launch-checklist',
  content_json: { hero: { title: 'Launch' } },
  meta_json: { title: 'Launch', description: 'Checklist' },
  is_published: false,
  published_at: '2025-02-10T08:00:00Z',
  template_override: 'templates.landing',
  term_ids: [3, 8]
};
```
