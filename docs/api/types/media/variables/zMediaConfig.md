[**admin**](../../../README.md)

***

# Variable: zMediaConfig

> `const` **zMediaConfig**: `ZodObject`\<\{ `allowed_mimes`: `ZodArray`\<`ZodString`\>; `image_variants`: `ZodRecord`\<`ZodString`, `ZodObject`\<\{ `format`: `ZodNullable`\<`ZodString`\>; `max`: `ZodNumber`; `quality`: `ZodNullable`\<`ZodNumber`\>; \}, `$strip`\>\>; `max_upload_mb`: `ZodNumber`; \}, `$strip`\>

Defined in: [src/types/media.ts:391](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L391)

Схема валидации конфигурации системы медиа-файлов.
Содержит информацию о разрешенных типах файлов, максимальном размере и доступных вариантах изображений.

## Example

```ts
const config: ZMediaConfig = {
  allowed_mimes: ['image/jpeg', 'image/png', 'video/mp4'],
  max_upload_mb: 10,
  image_variants: {
    thumbnail: { max: 320, format: null, quality: null },
    medium: { max: 1024, format: null, quality: null },
    large: { max: 2048, format: null, quality: null }
  }
};
```
