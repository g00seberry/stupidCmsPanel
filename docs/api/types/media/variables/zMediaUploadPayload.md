[**admin**](../../../README.md)

***

# Variable: zMediaUploadPayload

> `const` **zMediaUploadPayload**: `ZodObject`\<\{ `alt`: `ZodOptional`\<`ZodString`\>; `title`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [src/types/media.ts:322](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L322)

Схема валидации данных для загрузки медиа-файла.

## Example

```ts
const uploadPayload: ZMediaUploadPayload = {
  title: 'Hero image',
  alt: 'Hero cover'
};
```
