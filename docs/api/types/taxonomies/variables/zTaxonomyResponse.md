[**admin**](../../../README.md)

***

# Variable: zTaxonomyResponse

> `const` **zTaxonomyResponse**: `ZodObject`\<\{ `data`: `ZodObject`\<\{ `created_at`: `ZodOptional`\<`ZodString`\>; `hierarchical`: `ZodBoolean`; `id`: `ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>; `label`: `ZodString`; `options_json`: `ZodDefault`\<`ZodOptional`\<`ZodNullable`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>\>\>; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>; \}, `$strip`\>

Defined in: [src/types/taxonomies.ts:72](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/taxonomies.ts#L72)

Ответ API с данными одной таксономии.
