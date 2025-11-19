[**admin**](../../../README.md)

***

# Variable: zMediaImage

> `const` **zMediaImage**: `ZodObject`\<\{ `alt`: `ZodNullable`\<`ZodString`\>; `created_at`: `ZodString`; `deleted_at`: `ZodNullable`\<`ZodString`\>; `ext`: `ZodString`; `height`: `ZodNumber`; `id`: `ZodString`; `kind`: `ZodLiteral`\<`"image"`\>; `mime`: `ZodString`; `name`: `ZodString`; `preview_urls`: `ZodObject`\<\{ `large`: `ZodString`; `medium`: `ZodString`; `thumbnail`: `ZodString`; \}, `$strip`\>; `size_bytes`: `ZodNumber`; `title`: `ZodNullable`\<`ZodString`\>; `updated_at`: `ZodString`; `url`: `ZodString`; `width`: `ZodNumber`; \}, `$strip`\>

Defined in: [src/types/media.ts:103](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L103)

Схема валидации медиа-файла типа "изображение".

## Example

```ts
const imageMedia: ZMediaImage = {
  id: '01HXZYXQJ123456789ABCDEF',
  kind: 'image',
  name: 'hero.jpg',
  ext: 'jpg',
  mime: 'image/jpeg',
  size_bytes: 235678,
  width: 1920,
  height: 1080,
  title: 'Hero image',
  alt: 'Hero cover',
  url: 'https://api.stupidcms.dev/api/v1/media/01HXZYXQJ123456789ABCDEF',
  preview_urls: {
    thumbnail: 'https://api.stupidcms.dev/api/v1/media/01HXZYXQJ123456789ABCDEF?variant=thumbnail',
    medium: 'https://api.stupidcms.dev/api/v1/media/01HXZYXQJ123456789ABCDEF?variant=medium',
    large: 'https://api.stupidcms.dev/api/v1/media/01HXZYXQJ123456789ABCDEF?variant=large'
  },
  created_at: '2025-01-10T12:00:00+00:00',
  updated_at: '2025-01-10T12:00:00+00:00',
  deleted_at: null
};
```
