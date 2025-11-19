[**admin**](../../../README.md)

***

# Variable: zMediaDocument

> `const` **zMediaDocument**: `ZodObject`\<\{ `alt`: `ZodNullable`\<`ZodString`\>; `created_at`: `ZodString`; `deleted_at`: `ZodNullable`\<`ZodString`\>; `ext`: `ZodString`; `id`: `ZodString`; `kind`: `ZodLiteral`\<`"document"`\>; `mime`: `ZodString`; `name`: `ZodString`; `size_bytes`: `ZodNumber`; `title`: `ZodNullable`\<`ZodString`\>; `updated_at`: `ZodString`; `url`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/media.ts:217](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L217)

Схема валидации медиа-файла типа "документ".

## Example

```ts
const documentMedia: ZMediaDocument = {
  id: '01HXZYXQJFEDCBA9876543210',
  kind: 'document',
  name: 'document.pdf',
  ext: 'pdf',
  mime: 'application/pdf',
  size_bytes: 102400,
  title: 'Document title',
  alt: null,
  url: 'https://api.stupidcms.dev/api/v1/media/01HXZYXQJFEDCBA9876543210',
  created_at: '2025-01-10T12:03:00+00:00',
  updated_at: '2025-01-10T12:03:00+00:00',
  deleted_at: null
};
```
