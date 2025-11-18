[**admin**](../../../README.md)

***

# Variable: zPostTypeOptions

> `const` **zPostTypeOptions**: `ZodObject`\<\{ `taxonomies`: `ZodDefault`\<`ZodOptional`\<`ZodArray`\<`ZodPipe`\<`ZodUnion`\<\[`ZodNumber`, `ZodString`\]\>, `ZodTransform`\<`string`, `string` \| `number`\>\>\>\>\>; \}, `$catchall`\<`ZodUnknown`\>\>

Defined in: [src/types/postTypes.ts:13](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/postTypes.ts#L13)

Схема валидации options_json типа контента.
Содержит настройки типа контента, включая список разрешённых таксономий.

## Example

```ts
const options: ZPostTypeOptions = {
  taxonomies: ['categories', 'tags'],
  fields: { price: { type: 'number' } }
};
```
