[**admin**](../../../README.md)

***

# Variable: zMedia

> `const` **zMedia**: `ZodDiscriminatedUnion`\<\[`ZodObject`\<\{ `alt`: `ZodNullable`\<`ZodString`\>; `created_at`: `ZodString`; `deleted_at`: `ZodNullable`\<`ZodString`\>; `ext`: `ZodString`; `height`: `ZodNumber`; `id`: `ZodString`; `kind`: `ZodLiteral`\<`"image"`\>; `mime`: `ZodString`; `name`: `ZodString`; `preview_urls`: `ZodObject`\<\{ `large`: `ZodString`; `medium`: `ZodString`; `thumbnail`: `ZodString`; \}, `$strip`\>; `size_bytes`: `ZodNumber`; `title`: `ZodNullable`\<`ZodString`\>; `updated_at`: `ZodString`; `url`: `ZodString`; `width`: `ZodNumber`; \}, `$strip`\>, `ZodObject`\<\{ `alt`: `ZodNullable`\<`ZodString`\>; `audio_codec`: `ZodString`; `bitrate_kbps`: `ZodNumber`; `created_at`: `ZodString`; `deleted_at`: `ZodNullable`\<`ZodString`\>; `duration_ms`: `ZodNumber`; `ext`: `ZodString`; `frame_count`: `ZodNumber`; `frame_rate`: `ZodNumber`; `id`: `ZodString`; `kind`: `ZodLiteral`\<`"video"`\>; `mime`: `ZodString`; `name`: `ZodString`; `size_bytes`: `ZodNumber`; `title`: `ZodNullable`\<`ZodString`\>; `updated_at`: `ZodString`; `url`: `ZodString`; `video_codec`: `ZodString`; \}, `$strip`\>, `ZodObject`\<\{ `alt`: `ZodNullable`\<`ZodString`\>; `audio_codec`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `bitrate_kbps`: `ZodOptional`\<`ZodNullable`\<`ZodNumber`\>\>; `created_at`: `ZodString`; `deleted_at`: `ZodNullable`\<`ZodString`\>; `duration_ms`: `ZodOptional`\<`ZodNullable`\<`ZodNumber`\>\>; `ext`: `ZodString`; `id`: `ZodString`; `kind`: `ZodLiteral`\<`"audio"`\>; `mime`: `ZodString`; `name`: `ZodString`; `size_bytes`: `ZodNumber`; `title`: `ZodNullable`\<`ZodString`\>; `updated_at`: `ZodString`; `url`: `ZodString`; \}, `$strip`\>, `ZodObject`\<\{ `alt`: `ZodNullable`\<`ZodString`\>; `created_at`: `ZodString`; `deleted_at`: `ZodNullable`\<`ZodString`\>; `ext`: `ZodString`; `id`: `ZodString`; `kind`: `ZodLiteral`\<`"document"`\>; `mime`: `ZodString`; `name`: `ZodString`; `size_bytes`: `ZodNumber`; `title`: `ZodNullable`\<`ZodString`\>; `updated_at`: `ZodString`; `url`: `ZodString`; \}, `$strip`\>\], `"kind"`\>

Defined in: [src/types/media.ts:237](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L237)

Схема валидации медиа-файла любого типа.
Использует discriminated union по полю `kind` для определения конкретного типа.

## Example

```ts
const media: ZMedia = {
  id: '01HXZYXQJ123456789ABCDEF',
  kind: 'image',
  name: 'hero.jpg',
  // ... остальные поля в зависимости от kind
};
```
