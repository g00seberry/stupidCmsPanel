[**admin**](../../../README.md)

***

# Variable: zEntryTermsPayload

> `const` **zEntryTermsPayload**: `ZodObject`\<\{ `term_ids`: `ZodArray`\<`ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>\>; \}, `$strip`\>

Defined in: [src/types/entries.ts:286](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/entries.ts#L286)

Схема валидации тела запроса для привязки/отвязки/синхронизации термов.

## Example

```ts
const payload: ZEntryTermsPayload = {
  term_ids: [3, 8]
};
```
