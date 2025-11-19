[**admin**](../../../README.md)

***

# Variable: zTermPayload

> `const` **zTermPayload**: `ZodObject`\<\{ `meta_json`: `ZodUnknown`; `name`: `ZodString`; `parent_id`: `ZodOptional`\<`ZodNullable`\<`ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>\>\>; \}, `$strip`\>

Defined in: [src/types/terms.ts:96](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/terms.ts#L96)

Схема валидации данных для создания или обновления термина.

## Example

```ts
const payload: ZTermPayload = {
  name: 'Guides',
  parent_id: 1,
  meta_json: { color: '#ffcc00' }
};
```
