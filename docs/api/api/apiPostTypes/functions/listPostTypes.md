[**admin**](../../../README.md)

***

# Function: listPostTypes()

> **listPostTypes**(): `Promise`\<`object`[]\>

Defined in: [src/api/apiPostTypes.ts:16](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/api/apiPostTypes.ts#L16)

Загружает список доступных типов контента.

## Returns

`Promise`\<`object`[]\>

Массив типов контента, прошедших валидацию схемой `zPostType`.

## Example

```ts
const postTypes = await listPostTypes();
postTypes.forEach(type => {
  console.log(`${type.name} (${type.slug})`);
});
```
