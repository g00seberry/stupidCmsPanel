[**admin**](../../../README.md)

***

# Variable: zTaxonomyPayload

> `const` **zTaxonomyPayload**: `ZodObject`\<\{ `hierarchical`: `ZodBoolean`; `label`: `ZodString`; `options_json`: `ZodDefault`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `slug`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/taxonomies.ts:47](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/taxonomies.ts#L47)

Схема валидации данных для создания или обновления таксономии.

## Example

```ts
const payload: ZTaxonomyPayload = {
  label: 'Categories',
  slug: 'category',
  hierarchical: false,
  options_json: { color: '#ffcc00' }
};
```
