[**admin**](../../../README.md)

***

# Variable: zMediaBulkPayload

> `const` **zMediaBulkPayload**: `ZodObject`\<\{ `ids`: `ZodArray`\<`ZodString`\>; \}, `$strip`\>

Defined in: [src/types/media.ts:422](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/media.ts#L422)

Схема валидации тела запроса для массовых операций с медиа.

## Example

```ts
const bulkPayload: ZMediaBulkPayload = {
  ids: ['01HXZYXQJ123456789ABCDEF', '01HXZYXQJ987654321FEDCBA']
};
```
