[**admin**](../../../README.md)

***

# Variable: zTaxonomiesResponse

> `const` **zTaxonomiesResponse**: `ZodObject`\<\{ `data`: `ZodArray`\<`ZodObject`\<\{ `created_at`: `ZodOptional`\<`ZodString`\>; `hierarchical`: `ZodBoolean`; `id`: `ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>; `label`: `ZodString`; `options_json`: `ZodDefault`\<`ZodOptional`\<`ZodNullable`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>\>\>; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>\>; \}, `$strip`\>

Defined in: [src/types/taxonomies.ts:65](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/taxonomies.ts#L65)

Ответ API со списком таксономий.
