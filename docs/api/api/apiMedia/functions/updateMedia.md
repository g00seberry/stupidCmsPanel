[**admin**](../../../README.md)

***

# Function: updateMedia()

> **updateMedia**(`id`, `payload`): `Promise`\<\{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `height`: `number`; `id`: `string`; `kind`: `"image"`; `mime`: `string`; `name`: `string`; `preview_urls`: \{ `large`: `string`; `medium`: `string`; `thumbnail`: `string`; \}; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `width`: `number`; \} \| \{ `alt`: `string` \| `null`; `audio_codec`: `string`; `bitrate_kbps`: `number`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms`: `number`; `ext`: `string`; `frame_count`: `number`; `frame_rate`: `number`; `id`: `string`; `kind`: `"video"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `video_codec`: `string`; \} \| \{ `alt`: `string` \| `null`; `audio_codec?`: `string` \| `null`; `bitrate_kbps?`: `number` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms?`: `number` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"audio"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \} \| \{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"document"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \}\>

Defined in: [src/api/apiMedia.ts:208](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiMedia.ts#L208)

Обновляет метаданные существующего медиа-файла.

## Parameters

### id

`string`

ULID идентификатор медиа-файла для обновления.

### payload

Новые значения полей метаданных.

#### alt?

`string` = `...`

Альтернативный текст для изображений. Минимум 1 символ, максимум 255 символов.

#### title?

`string` = `...`

Название медиа-файла. Минимум 1 символ, максимум 255 символов.

## Returns

`Promise`\<\{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `height`: `number`; `id`: `string`; `kind`: `"image"`; `mime`: `string`; `name`: `string`; `preview_urls`: \{ `large`: `string`; `medium`: `string`; `thumbnail`: `string`; \}; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `width`: `number`; \} \| \{ `alt`: `string` \| `null`; `audio_codec`: `string`; `bitrate_kbps`: `number`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms`: `number`; `ext`: `string`; `frame_count`: `number`; `frame_rate`: `number`; `id`: `string`; `kind`: `"video"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `video_codec`: `string`; \} \| \{ `alt`: `string` \| `null`; `audio_codec?`: `string` \| `null`; `bitrate_kbps?`: `number` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms?`: `number` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"audio"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \} \| \{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"document"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \}\>

Обновлённый медиа-файл.

## Throws

Если медиа-файл не найден (404), нет авторизации (401), ошибка валидации (422) или превышен лимит запросов (429).

## Example

```ts
const updatedMedia = await updateMedia('01HXZYXQJ123456789ABCDEF', {
  title: 'Updated title',
  alt: 'Updated alt text'
});
```
