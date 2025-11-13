[**admin**](../../../README.md)

***

# Variable: zPostType

> `const` **zPostType**: `ZodObject`\<\{ `created_at`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `options_json`: `ZodDefault`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `slug`: `ZodString`; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [src/types/postTypes.ts:15](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/postTypes.ts#L15)

Схема валидации типа контента CMS.
Тип контента определяет структуру и настройки для записей определённого вида.

## Example

```ts
const postType: ZPostType = {
  slug: 'article',
  name: 'Articles',
  options_json: { fields: { price: { type: 'number' } } },
  created_at: '2025-01-10T12:45:00+00:00',
  updated_at: '2025-01-10T12:45:00+00:00'
};
```
