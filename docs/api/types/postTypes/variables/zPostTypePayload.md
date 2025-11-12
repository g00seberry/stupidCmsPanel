[**admin**](../../../README.md)

***

# Variable: zPostTypePayload

> `const` **zPostTypePayload**: `ZodObject`\<\{ `name`: `ZodString`; `options_json`: `ZodDefault`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `slug`: `ZodString`; `template`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; \}, `$strip`\>

Defined in: [src/types/postTypes.ts:47](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/types/postTypes.ts#L47)

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
