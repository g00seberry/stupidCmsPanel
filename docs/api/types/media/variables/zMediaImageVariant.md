[**admin**](../../../README.md)

***

# Variable: zMediaImageVariant

> `const` **zMediaImageVariant**: `ZodObject`\<\{ `format`: `ZodNullable`\<`ZodString`\>; `max`: `ZodNumber`; `quality`: `ZodNullable`\<`ZodNumber`\>; \}, `$strip`\>

Defined in: [src/types/media.ts:363](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L363)

Схема валидации варианта изображения в конфигурации.

## Example

```ts
const variant: ZMediaImageVariant = {
  max: 320,
  format: null,
  quality: null
};
```
