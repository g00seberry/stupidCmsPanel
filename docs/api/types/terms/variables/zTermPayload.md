[**admin**](../../../README.md)

***

# Variable: zTermPayload

> `const` **zTermPayload**: `ZodObject`\<\{ `meta_json`: `ZodUnknown`; `name`: `ZodString`; `parent_id`: `ZodOptional`\<`ZodNullable`\<`ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>\>\>; \}, `$strip`\>

Defined in: [src/types/terms.ts:96](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/terms.ts#L96)

Схема валидации данных для создания или обновления термина.

## Example

```ts
const payload: ZTermPayload = {
  name: 'Guides',
  parent_id: 1,
  meta_json: { color: '#ffcc00' }
};
```
