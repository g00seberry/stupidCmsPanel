[**admin**](../../../README.md)

***

# Variable: zTaxonomy

> `const` **zTaxonomy**: `ZodObject`\<\{ `created_at`: `ZodOptional`\<`ZodString`\>; `hierarchical`: `ZodBoolean`; `id`: `ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>; `label`: `ZodString`; `options_json`: `ZodDefault`\<`ZodOptional`\<`ZodNullable`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>\>\>; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [src/types/taxonomies.ts:17](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/taxonomies.ts#L17)

Схема валидации таксономии CMS.
Таксономия определяет категоризацию контента (например, категории, теги).

## Example

```ts
const taxonomy: ZTaxonomy = {
  id: 1,
  label: 'Categories',
  hierarchical: true,
  options_json: {},
  created_at: '2025-01-10T12:00:00+00:00',
  updated_at: '2025-01-10T12:00:00+00:00'
};
```
