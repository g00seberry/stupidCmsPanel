[**admin**](../../../README.md)

***

# Variable: zPostType

> `const` **zPostType**: `ZodObject`\<\{ `created_at`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `options_json`: `ZodDefault`\<`ZodObject`\<\{ `taxonomies`: `ZodDefault`\<`ZodOptional`\<`ZodArray`\<`ZodPipe`\<`ZodUnion`\<\[..., ...\]\>, `ZodTransform`\<`string`, ... \| ...\>\>\>\>\>; \}, `$catchall`\<`ZodUnknown`\>\>\>; `slug`: `ZodString`; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [src/types/postTypes.ts:37](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/postTypes.ts#L37)

Схема валидации типа контента CMS.
Тип контента определяет структуру и настройки для записей определённого вида.

## Example

```ts
const postType: ZPostType = {
  slug: 'article',
  name: 'Articles',
  options_json: { taxonomies: ['categories'], fields: { price: { type: 'number' } } },
  created_at: '2025-01-10T12:45:00+00:00',
  updated_at: '2025-01-10T12:45:00+00:00'
};
```
