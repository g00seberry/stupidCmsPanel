[**admin**](../../../README.md)

***

# Function: getEntriesStatuses()

> **getEntriesStatuses**(): `Promise`\<`string`[]\>

Defined in: [src/api/apiEntries.ts:110](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/api/apiEntries.ts#L110)

Загружает список возможных статусов для записей.

## Returns

`Promise`\<`string`[]\>

Массив строк со статусами записей.

## Example

```ts
const statuses = await getEntriesStatuses();
console.log(statuses); // ['draft', 'published']
```
