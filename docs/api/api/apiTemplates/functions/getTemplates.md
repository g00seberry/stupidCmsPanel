[**admin**](../../../README.md)

***

# Function: getTemplates()

> **getTemplates**(): `Promise`\<`object`[]\>

Defined in: src/api/apiTemplates.ts:12

Получает список доступных шаблонов через API.

## Returns

`Promise`\<`object`[]\>

Массив объектов шаблонов с полями name, path, exists.

## Example

```ts
const templates = await getTemplates();
console.log(templates[0].name); // 'pages.show'
console.log(templates[0].path); // 'pages/show.blade.php'
```
