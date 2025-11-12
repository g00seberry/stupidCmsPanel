[**admin**](../../../README.md)

***

# Function: listPostTypes()

> **listPostTypes**(): `Promise`\<`object`[]\>

Defined in: [src/api/apiPostTypes.ts:16](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/api/apiPostTypes.ts#L16)

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
