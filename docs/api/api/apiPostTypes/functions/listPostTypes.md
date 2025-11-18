[**admin**](../../../README.md)

***

# Function: listPostTypes()

> **listPostTypes**(): `Promise`\<`object`[]\>

Defined in: [src/api/apiPostTypes.ts:16](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/api/apiPostTypes.ts#L16)

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
