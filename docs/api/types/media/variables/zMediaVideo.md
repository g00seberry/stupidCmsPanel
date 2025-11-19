[**admin**](../../../README.md)

***

# Variable: zMediaVideo

> `const` **zMediaVideo**: `ZodObject`\<\{ `alt`: `ZodNullable`\<`ZodString`\>; `audio_codec`: `ZodString`; `bitrate_kbps`: `ZodNumber`; `created_at`: `ZodString`; `deleted_at`: `ZodNullable`\<`ZodString`\>; `duration_ms`: `ZodNumber`; `ext`: `ZodString`; `frame_count`: `ZodNumber`; `frame_rate`: `ZodNumber`; `id`: `ZodString`; `kind`: `ZodLiteral`\<`"video"`\>; `mime`: `ZodString`; `name`: `ZodString`; `size_bytes`: `ZodNumber`; `title`: `ZodNullable`\<`ZodString`\>; `updated_at`: `ZodString`; `url`: `ZodString`; `video_codec`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/media.ts:142](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L142)

Схема валидации медиа-файла типа "видео".

## Example

```ts
const videoMedia: ZMediaVideo = {
  id: '01HXZYXQJ987654321FEDCBA',
  kind: 'video',
  name: 'video.mp4',
  ext: 'mp4',
  mime: 'video/mp4',
  size_bytes: 5242880,
  duration_ms: 120000,
  bitrate_kbps: 3500,
  frame_rate: 30,
  frame_count: 3600,
  video_codec: 'h264',
  audio_codec: 'aac',
  title: 'Video title',
  alt: null,
  url: 'https://api.stupidcms.dev/api/v1/media/01HXZYXQJ987654321FEDCBA',
  created_at: '2025-01-10T12:01:00+00:00',
  updated_at: '2025-01-10T12:01:00+00:00',
  deleted_at: null
};
```
