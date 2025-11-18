[**admin**](../../../README.md)

***

# Variable: zEntryTermsPayload

> `const` **zEntryTermsPayload**: `ZodObject`\<\{ `term_ids`: `ZodArray`\<`ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>\>; \}, `$strip`\>

Defined in: [src/types/entries.ts:286](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/entries.ts#L286)

Схема валидации тела запроса для привязки/отвязки/синхронизации термов.

## Example

```ts
const payload: ZEntryTermsPayload = {
  term_ids: [3, 8]
};
```
