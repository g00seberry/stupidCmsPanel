[**admin**](../../../README.md)

***

# Function: getEntriesStatuses()

> **getEntriesStatuses**(): `Promise`\<`string`[]\>

Defined in: [src/api/apiEntries.ts:119](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/api/apiEntries.ts#L119)

Загружает список возможных статусов для записей.

## Returns

`Promise`\<`string`[]\>

Массив строк со статусами записей.

## Example

```ts
const statuses = await getEntriesStatuses();
console.log(statuses); // ['draft', 'published']
```
