[**admin**](../../../README.md)

***

# Variable: zEntryTermsData

> `const` **zEntryTermsData**: `ZodObject`\<\{ `entry_id`: `ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>; `terms_by_taxonomy`: `ZodArray`\<`ZodObject`\<\{ `taxonomy`: `ZodObject`\<\{ `created_at`: `ZodOptional`\<`ZodString`\>; `hierarchical`: `ZodBoolean`; `id`: `ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>; `label`: `ZodString`; `options_json`: `ZodDefault`\<`ZodOptional`\<`ZodNullable`\<`ZodRecord`\<..., ...\>\>\>\>; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>; `terms`: `ZodArray`\<`ZodObject`\<\{ `created_at`: `ZodOptional`\<`ZodString`\>; `deleted_at`: `ZodOptional`\<`ZodNullable`\<`ZodString`\>\>; `id`: `ZodPipe`\<`ZodUnion`\<\[..., ...\]\>, `ZodTransform`\<`string`, ... \| ...\>\>; `meta_json`: `ZodUnknown`; `name`: `ZodString`; `parent_id`: `ZodOptional`\<`ZodNullable`\<`ZodPipe`\<..., ...\>\>\>; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>\>; \}, `$strip`\>\>; \}, `$strip`\>

Defined in: [src/types/entries.ts:226](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/entries.ts#L226)

Схема валидации данных термов записи в ответе API.
Содержит группировку термов по таксономиям с полной информацией о таксономиях.

## Example

```ts
const entryTerms: ZEntryTermsData = {
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
};
```
