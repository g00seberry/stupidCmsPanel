[**admin**](../../../README.md)

***

# Variable: zPostType

> `const` **zPostType**: `ZodObject`\<\{ `created_at`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `options_json`: `ZodDefault`\<`ZodObject`\<\{ `taxonomies`: `ZodDefault`\<`ZodOptional`\<`ZodArray`\<`ZodPipe`\<`ZodUnion`\<\[..., ...\]\>, `ZodTransform`\<`string`, ... \| ...\>\>\>\>\>; \}, `$catchall`\<`ZodUnknown`\>\>\>; `slug`: `ZodString`; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [src/types/postTypes.ts:37](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/postTypes.ts#L37)

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
