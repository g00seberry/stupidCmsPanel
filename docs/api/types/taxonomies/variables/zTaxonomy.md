[**admin**](../../../README.md)

***

# Variable: zTaxonomy

> `const` **zTaxonomy**: `ZodObject`\<\{ `created_at`: `ZodOptional`\<`ZodString`\>; `hierarchical`: `ZodBoolean`; `label`: `ZodString`; `options_json`: `ZodDefault`\<`ZodOptional`\<`ZodNullable`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>\>\>; `slug`: `ZodString`; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [src/types/taxonomies.ts:16](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/taxonomies.ts#L16)

Схема валидации таксономии CMS.
Таксономия определяет категоризацию контента (например, категории, теги).

## Example

```ts
const taxonomy: ZTaxonomy = {
  slug: 'category',
  label: 'Categories',
  hierarchical: true,
  options_json: {},
  created_at: '2025-01-10T12:00:00+00:00',
  updated_at: '2025-01-10T12:00:00+00:00'
};
```
