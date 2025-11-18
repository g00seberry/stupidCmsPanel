[**admin**](../../../README.md)

***

# Variable: zTaxonomy

> `const` **zTaxonomy**: `ZodObject`\<\{ `created_at`: `ZodOptional`\<`ZodString`\>; `hierarchical`: `ZodBoolean`; `id`: `ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>; `label`: `ZodString`; `options_json`: `ZodDefault`\<`ZodOptional`\<`ZodNullable`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>\>\>; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [src/types/taxonomies.ts:17](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/taxonomies.ts#L17)

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
