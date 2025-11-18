[**admin**](../../../README.md)

***

# Variable: zEntryPayload

> `const` **zEntryPayload**: `ZodObject`\<\{ `content_json`: `ZodOptional`\<`ZodOptional`\<`ZodNullable`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>\>\>; `is_published`: `ZodOptional`\<`ZodBoolean`\>; `meta_json`: `ZodOptional`\<`ZodOptional`\<`ZodNullable`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>\>\>; `post_type`: `ZodOptional`\<`ZodString`\>; `published_at`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `slug`: `ZodString`; `template_override`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `term_ids`: `ZodOptional`\<`ZodArray`\<`ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>\>\>; `title`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/entries.ts:153](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/entries.ts#L153)

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
