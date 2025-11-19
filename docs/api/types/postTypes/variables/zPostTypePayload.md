[**admin**](../../../README.md)

***

# Variable: zPostTypePayload

> `const` **zPostTypePayload**: `ZodObject`\<\{ `name`: `ZodString`; `options_json`: `ZodDefault`\<`ZodObject`\<\{ `taxonomies`: `ZodDefault`\<`ZodOptional`\<`ZodArray`\<`ZodPipe`\<`ZodUnion`\<\[..., ...\]\>, `ZodTransform`\<`string`, ... \| ...\>\>\>\>\>; \}, `$catchall`\<`ZodUnknown`\>\>\>; `slug`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/postTypes.ts:65](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/postTypes.ts#L65)

Схема валидации данных для создания или обновления типа контента.

## Example

```ts
const payload: ZPostTypePayload = {
  slug: 'product',
  name: 'Products',
  options_json: { taxonomies: ['categories'], fields: { price: { type: 'number' } } }
};
```
