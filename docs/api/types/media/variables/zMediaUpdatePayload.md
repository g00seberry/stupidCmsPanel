[**admin**](../../../README.md)

***

# Variable: zMediaUpdatePayload

> `const` **zMediaUpdatePayload**: `ZodObject`\<\{ `alt`: `ZodOptional`\<`ZodString`\>; `title`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [src/types/media.ts:342](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L342)

Схема валидации данных для обновления метаданных медиа-файла.

## Example

```ts
const updatePayload: ZMediaUpdatePayload = {
  title: 'Updated title',
  alt: 'Updated alt text'
};
```
