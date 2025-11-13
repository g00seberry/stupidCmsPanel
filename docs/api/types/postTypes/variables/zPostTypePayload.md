[**admin**](../../../README.md)

***

# Variable: zPostTypePayload

> `const` **zPostTypePayload**: `ZodObject`\<\{ `name`: `ZodString`; `options_json`: `ZodDefault`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `slug`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/postTypes.ts:43](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/postTypes.ts#L43)

Схема валидации данных для создания или обновления типа контента.

## Example

```ts
const payload: ZPostTypePayload = {
  slug: 'product',
  name: 'Products',
  options_json: { fields: { price: { type: 'number' } } }
};
```
