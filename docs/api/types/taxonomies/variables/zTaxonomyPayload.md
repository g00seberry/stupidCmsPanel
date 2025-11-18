[**admin**](../../../README.md)

***

# Variable: zTaxonomyPayload

> `const` **zTaxonomyPayload**: `ZodObject`\<\{ `hierarchical`: `ZodBoolean`; `label`: `ZodString`; `options_json`: `ZodDefault`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; \}, `$strip`\>

Defined in: [src/types/taxonomies.ts:47](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/taxonomies.ts#L47)

Схема валидации данных для создания или обновления таксономии.

## Example

```ts
const payload: ZTaxonomyPayload = {
  label: 'Categories',
  hierarchical: false,
  options_json: { color: '#ffcc00' }
};
```
