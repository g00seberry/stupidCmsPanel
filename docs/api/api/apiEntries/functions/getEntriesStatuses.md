[**admin**](../../../README.md)

***

# Function: getEntriesStatuses()

> **getEntriesStatuses**(): `Promise`\<`string`[]\>

Defined in: [src/api/apiEntries.ts:119](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiEntries.ts#L119)

Загружает список возможных статусов для записей.

## Returns

`Promise`\<`string`[]\>

Массив строк со статусами записей.

## Example

```ts
const statuses = await getEntriesStatuses();
console.log(statuses); // ['draft', 'published']
```
