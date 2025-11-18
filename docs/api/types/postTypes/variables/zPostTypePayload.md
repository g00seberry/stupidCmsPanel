[**admin**](../../../README.md)

***

# Variable: zPostTypePayload

> `const` **zPostTypePayload**: `ZodObject`\<\{ `name`: `ZodString`; `options_json`: `ZodDefault`\<`ZodObject`\<\{ `taxonomies`: `ZodDefault`\<`ZodOptional`\<`ZodArray`\<`ZodPipe`\<`ZodUnion`\<\[..., ...\]\>, `ZodTransform`\<`string`, ... \| ...\>\>\>\>\>; \}, `$catchall`\<`ZodUnknown`\>\>\>; `slug`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/postTypes.ts:65](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/postTypes.ts#L65)

Схема валидации данных для создания или обновления типа контента.

## Example

```ts
const payload: ZPostTypePayload = {
  slug: 'product',
  name: 'Products',
  options_json: { taxonomies: ['categories'], fields: { price: { type: 'number' } } }
};
```
