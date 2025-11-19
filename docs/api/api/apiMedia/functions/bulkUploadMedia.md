[**admin**](../../../README.md)

***

# Function: bulkUploadMedia()

> **bulkUploadMedia**(`files`): `Promise`\<(\{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `height`: `number`; `id`: `string`; `kind`: `"image"`; `mime`: `string`; `name`: `string`; `preview_urls`: \{ `large`: `string`; `medium`: `string`; `thumbnail`: `string`; \}; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `width`: `number`; \} \| \{ `alt`: `string` \| `null`; `audio_codec`: `string`; `bitrate_kbps`: `number`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms`: `number`; `ext`: `string`; `frame_count`: `number`; `frame_rate`: `number`; `id`: `string`; `kind`: `"video"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `video_codec`: `string`; \} \| \{ `alt`: `string` \| `null`; `audio_codec?`: `string` \| `null`; `bitrate_kbps?`: `number` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms?`: `number` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"audio"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \} \| \{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"document"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \})[]\>

Defined in: [src/api/apiMedia.ts:174](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiMedia.ts#L174)

Загружает массив медиа-файлов на сервер одним запросом.

## Parameters

### files

`File`[]

Массив файлов для загрузки (1-50 файлов).

## Returns

`Promise`\<(\{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `height`: `number`; `id`: `string`; `kind`: `"image"`; `mime`: `string`; `name`: `string`; `preview_urls`: \{ `large`: `string`; `medium`: `string`; `thumbnail`: `string`; \}; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `width`: `number`; \} \| \{ `alt`: `string` \| `null`; `audio_codec`: `string`; `bitrate_kbps`: `number`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms`: `number`; `ext`: `string`; `frame_count`: `number`; `frame_rate`: `number`; `id`: `string`; `kind`: `"video"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `video_codec`: `string`; \} \| \{ `alt`: `string` \| `null`; `audio_codec?`: `string` \| `null`; `bitrate_kbps?`: `number` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms?`: `number` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"audio"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \} \| \{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"document"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \})[]\>

Массив созданных медиа-файлов.

## Throws

Если массив файлов пуст или содержит более 50 файлов, файлы не соответствуют ограничениям (размер, тип), нет авторизации (401), ошибка валидации (422) или превышен лимит запросов (429).

## Example

```ts
const files = [
  new File(['content1'], 'image1.jpg', { type: 'image/jpeg' }),
  new File(['content2'], 'image2.png', { type: 'image/png' })
];
const mediaArray = await bulkUploadMedia(files);
console.log(mediaArray.length); // 2
console.log(mediaArray[0].id); // '01HXZYXQJ123456789ABCDEF'
```
