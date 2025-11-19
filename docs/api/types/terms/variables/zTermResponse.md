[**admin**](../../../README.md)

***

# Variable: zTermResponse

> `const` **zTermResponse**: `ZodObject`\<\{ `data`: `ZodObject`\<\{ `created_at`: `ZodOptional`\<`ZodString`\>; `deleted_at`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `id`: `ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>; `meta_json`: `ZodUnknown`; `name`: `ZodString`; `parent_id`: `ZodOptional`\<`ZodNullable`\<`ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>\>\>; `taxonomy`: `ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>; \}, `$strip`\>

Defined in: [src/types/terms.ts:140](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/terms.ts#L140)

Ответ API с данными одного термина.
