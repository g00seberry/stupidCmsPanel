[**admin**](../../../README.md)

***

# Variable: zPostTypePayload

> `const` **zPostTypePayload**: `ZodObject`\<\{ `name`: `ZodString`; `options_json`: `ZodDefault`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `slug`: `ZodString`; `template`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; \}, `$strip`\>

Defined in: [src/types/postTypes.ts:47](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/types/postTypes.ts#L47)

Схема валидации данных для создания или обновления типа контента.

## Example

```ts
const payload: ZPostTypePayload = {
  slug: 'article',
  name: 'Статья',
  template: 'article-template',
  options_json: { allowComments: true }
};
```
