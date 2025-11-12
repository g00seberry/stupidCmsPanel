[**admin**](../../../README.md)

***

# Function: listPostTypes()

> **listPostTypes**(): `Promise`\<`object`[]\>

Defined in: [src/api/apiPostTypes.ts:16](https://github.com/g00seberry/stupidCmsPanel/blob/b46ec655471b9baff665cdcaf149a74d55508713/src/api/apiPostTypes.ts#L16)

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
