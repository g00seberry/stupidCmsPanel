[**admin**](../../../README.md)

***

# Variable: zPostTypePayload

> `const` **zPostTypePayload**: `ZodObject`\<\{ `name`: `ZodString`; `options_json`: `ZodDefault`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `slug`: `ZodString`; `template`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; \}, `$strip`\>

Defined in: [src/types/postTypes.ts:47](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/types/postTypes.ts#L47)

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
