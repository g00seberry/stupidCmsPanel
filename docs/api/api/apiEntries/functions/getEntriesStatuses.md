[**admin**](../../../README.md)

***

# Function: getEntriesStatuses()

> **getEntriesStatuses**(): `Promise`\<`string`[]\>

Defined in: [src/api/apiEntries.ts:110](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/api/apiEntries.ts#L110)

Загружает список возможных статусов для записей.

## Returns

`Promise`\<`string`[]\>

Массив строк со статусами записей.

## Example

```ts
const statuses = await getEntriesStatuses();
console.log(statuses); // ['draft', 'published']
```
