[**admin**](../../../README.md)

***

# Function: listPostTypes()

> **listPostTypes**(): `Promise`\<`object`[]\>

Defined in: [src/api/apiPostTypes.ts:16](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/api/apiPostTypes.ts#L16)

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
