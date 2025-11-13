[**admin**](../../../README.md)

***

# Variable: zPostType

> `const` **zPostType**: `ZodObject`\<\{ `created_at`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `options_json`: `ZodDefault`\<`ZodOptional`\<`ZodNullable`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>\>\>; `slug`: `ZodString`; `template`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `updated_at`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [src/types/postTypes.ts:16](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/types/postTypes.ts#L16)

Схема валидации типа контента CMS.
Тип контента определяет структуру и настройки для записей определённого вида.

## Example

```ts
const postType: ZPostType = {
  slug: 'article',
  name: 'Статья',
  template: 'article-template',
  options_json: { allowComments: true },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-02T00:00:00Z'
};
```
