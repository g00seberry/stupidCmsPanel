[**admin**](../../../README.md)

***

# Variable: zEntriesResponse

> `const` **zEntriesResponse**: `ZodObject`\<\{ `data`: `ZodArray`\<`ZodObject`\<\{ `content_json`: `ZodDefault`\<`ZodOptional`\<`ZodNullable`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>\>\>; `created_at`: `ZodOptional`\<`ZodString`\>; `deleted_at`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `id`: `ZodNumber`; `is_published`: `ZodBoolean`; `meta_json`: `ZodDefault`\<`ZodOptional`\<`ZodNullable`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>\>\>; `post_type`: `ZodString`; `published_at`: `ZodNullable`\<`ZodString`\>; `slug`: `ZodString`; `status`: `ZodEnum`\<\{ `draft`: `"draft"`; `published`: `"published"`; `scheduled`: `"scheduled"`; `trashed`: `"trashed"`; \}\>; `template_override`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `title`: `ZodString`; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>\>; `links`: `ZodObject`\<\{ `first`: `ZodNullable`\<`ZodString`\>; `last`: `ZodNullable`\<`ZodString`\>; `next`: `ZodNullable`\<`ZodString`\>; `prev`: `ZodNullable`\<`ZodString`\>; \}, `$strip`\>; `meta`: `ZodObject`\<\{ `current_page`: `ZodNumber`; `last_page`: `ZodNumber`; `per_page`: `ZodNumber`; `total`: `ZodNumber`; \}, `$strip`\>; \}, `$strip`\>

Defined in: [src/types/entries.ts:61](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/entries.ts#L61)

Схема валидации ответа API со списком записей.
