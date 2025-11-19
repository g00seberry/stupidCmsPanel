[**admin**](../../../README.md)

***

# Function: getMediaConfig()

> **getMediaConfig**(): `Promise`\<\{ `allowed_mimes`: `string`[]; `image_variants`: `Record`\<`string`, \{ `format`: `string` \| `null`; `max`: `number`; `quality`: `number` \| `null`; \}\>; `max_upload_mb`: `number`; \}\>

Defined in: [src/api/apiMedia.ts:106](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiMedia.ts#L106)

Загружает конфигурацию системы медиа-файлов.

## Returns

`Promise`\<\{ `allowed_mimes`: `string`[]; `image_variants`: `Record`\<`string`, \{ `format`: `string` \| `null`; `max`: `number`; `quality`: `number` \| `null`; \}\>; `max_upload_mb`: `number`; \}\>

Конфигурация с разрешенными типами файлов, максимальным размером и вариантами изображений.

## Example

```ts
const config = await getMediaConfig();
console.log(config.allowed_mime_types); // ['image/jpeg', 'image/png', 'video/mp4']
console.log(config.max_file_size_bytes); // 10485760
```
