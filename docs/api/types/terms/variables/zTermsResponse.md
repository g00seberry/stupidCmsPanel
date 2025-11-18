[**admin**](../../../README.md)

***

# Variable: zTermsResponse

> `const` **zTermsResponse**: `ZodObject`\<\{ `data`: `ZodArray`\<`ZodObject`\<\{ `created_at`: `ZodOptional`\<`ZodString`\>; `deleted_at`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `id`: `ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>; `meta_json`: `ZodUnknown`; `name`: `ZodString`; `parent_id`: `ZodOptional`\<`ZodNullable`\<`ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>\>\>; `taxonomy`: `ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>\>; `links`: `ZodObject`\<\{ `first`: `ZodNullable`\<`ZodString`\>; `last`: `ZodNullable`\<`ZodString`\>; `next`: `ZodNullable`\<`ZodString`\>; `prev`: `ZodNullable`\<`ZodString`\>; \}, `$strip`\>; `meta`: `ZodObject`\<\{ `current_page`: `ZodNumber`; `last_page`: `ZodNumber`; `per_page`: `ZodNumber`; `total`: `ZodNumber`; \}, `$strip`\>; \}, `$strip`\>

Defined in: [src/types/terms.ts:128](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/terms.ts#L128)

Ответ API со списком терминов.
