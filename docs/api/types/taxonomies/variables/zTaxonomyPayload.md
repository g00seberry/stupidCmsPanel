[**admin**](../../../README.md)

***

# Variable: zTaxonomyPayload

> `const` **zTaxonomyPayload**: `ZodObject`\<\{ `hierarchical`: `ZodBoolean`; `label`: `ZodString`; `options_json`: `ZodDefault`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; \}, `$strip`\>

Defined in: [src/types/taxonomies.ts:47](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/taxonomies.ts#L47)

Схема валидации данных для создания или обновления таксономии.

## Example

```ts
const payload: ZTaxonomyPayload = {
  label: 'Categories',
  hierarchical: false,
  options_json: { color: '#ffcc00' }
};
```
