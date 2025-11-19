[**admin**](../../../README.md)

***

# Variable: zMediaAudio

> `const` **zMediaAudio**: `ZodObject`\<\{ `alt`: `ZodNullable`\<`ZodString`\>; `audio_codec`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `bitrate_kbps`: `ZodOptional`\<`ZodNullable`\<`ZodNumber`\>\>; `created_at`: `ZodString`; `deleted_at`: `ZodNullable`\<`ZodString`\>; `duration_ms`: `ZodOptional`\<`ZodNullable`\<`ZodNumber`\>\>; `ext`: `ZodString`; `id`: `ZodString`; `kind`: `ZodLiteral`\<`"audio"`\>; `mime`: `ZodString`; `name`: `ZodString`; `size_bytes`: `ZodNumber`; `title`: `ZodNullable`\<`ZodString`\>; `updated_at`: `ZodString`; `url`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/media.ts:184](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L184)

Схема валидации медиа-файла типа "аудио".

## Example

```ts
const audioMedia: ZMediaAudio = {
  id: '01HXZYXQJABCDEF1234567890',
  kind: 'audio',
  name: 'audio.mp3',
  ext: 'mp3',
  mime: 'audio/mpeg',
  size_bytes: 3145728,
  duration_ms: 180000,
  bitrate_kbps: 256,
  audio_codec: 'mp3',
  title: 'Audio title',
  alt: null,
  url: 'https://api.stupidcms.dev/api/v1/media/01HXZYXQJABCDEF1234567890',
  created_at: '2025-01-10T12:02:00+00:00',
  updated_at: '2025-01-10T12:02:00+00:00',
  deleted_at: null
};
```
