[**admin**](../../../README.md)

***

# Variable: zTaxonomiesResponse

> `const` **zTaxonomiesResponse**: `ZodObject`\<\{ `data`: `ZodArray`\<`ZodObject`\<\{ `created_at`: `ZodOptional`\<`ZodString`\>; `hierarchical`: `ZodBoolean`; `id`: `ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>; `label`: `ZodString`; `options_json`: `ZodDefault`\<`ZodOptional`\<`ZodNullable`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>\>\>; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>\>; \}, `$strip`\>

Defined in: [src/types/taxonomies.ts:65](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/taxonomies.ts#L65)

Ответ API со списком таксономий.
