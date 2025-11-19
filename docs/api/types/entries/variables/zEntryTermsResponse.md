[**admin**](../../../README.md)

***

# Variable: zEntryTermsResponse

> `const` **zEntryTermsResponse**: `ZodObject`\<\{ `data`: `ZodObject`\<\{ `entry_id`: `ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>; `terms_by_taxonomy`: `ZodArray`\<`ZodObject`\<\{ `taxonomy`: `ZodObject`\<\{ `created_at`: `ZodOptional`\<`ZodString`\>; `hierarchical`: `ZodBoolean`; `id`: `ZodPipe`\<`ZodUnion`\<...\>, `ZodTransform`\<..., ...\>\>; `label`: `ZodString`; `options_json`: `ZodDefault`\<`ZodOptional`\<...\>\>; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>; `terms`: `ZodArray`\<`ZodObject`\<\{ `created_at`: `ZodOptional`\<...\>; `deleted_at`: `ZodOptional`\<...\>; `id`: `ZodPipe`\<..., ...\>; `meta_json`: `ZodUnknown`; `name`: `ZodString`; `parent_id`: `ZodOptional`\<...\>; `updated_at`: `ZodOptional`\<...\>; \}, `$strip`\>\>; \}, `$strip`\>\>; \}, `$strip`\>; \}, `$strip`\>

Defined in: [src/types/entries.ts:269](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/entries.ts#L269)

Схема валидации ответа API о термах записи.

## Example

```ts
const response: ZEntryTermsResponse = {
  data: {
    entry_id: 42,
    terms_by_taxonomy: [
      {
        taxonomy: {
          id: 1,
          label: 'Categories',
          hierarchical: true,
          options_json: {},
          created_at: '2025-01-10T12:00:00+00:00',
          updated_at: '2025-01-10T12:00:00+00:00'
        },
        terms: [
          {
            id: 3,
            name: 'Guides',
            meta_json: {},
            created_at: '2025-01-10T12:00:00+00:00',
            updated_at: '2025-01-10T12:00:00+00:00',
            deleted_at: null
          }
        ]
      }
    ]
  }
};
```
