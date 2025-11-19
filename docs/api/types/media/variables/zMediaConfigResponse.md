[**admin**](../../../README.md)

***

# Variable: zMediaConfigResponse

> `const` **zMediaConfigResponse**: `ZodObject`\<\{ `allowed_mimes`: `ZodArray`\<`ZodString`\>; `image_variants`: `ZodRecord`\<`ZodString`, `ZodObject`\<\{ `format`: `ZodNullable`\<`ZodString`\>; `max`: `ZodNumber`; `quality`: `ZodNullable`\<`ZodNumber`\>; \}, `$strip`\>\>; `max_upload_mb`: `ZodNumber`; \}, `$strip`\> = `zMediaConfig`

Defined in: [src/types/media.ts:408](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L408)

Схема валидации ответа API с конфигурацией медиа-системы.
