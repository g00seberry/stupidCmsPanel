[**admin**](../../../README.md)

***

# Function: getEntriesStatuses()

> **getEntriesStatuses**(): `Promise`\<`string`[]\>

Defined in: [src/api/apiEntries.ts:110](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/api/apiEntries.ts#L110)

Загружает список возможных статусов для записей.

## Returns

`Promise`\<`string`[]\>

Массив строк со статусами записей.

## Example

```ts
const statuses = await getEntriesStatuses();
console.log(statuses); // ['draft', 'published']
```
