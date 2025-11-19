[**admin**](../../../README.md)

***

# Function: getEntryTerms()

> **getEntryTerms**(`entryId`): `Promise`\<\{ `entry_id`: `string`; `terms_by_taxonomy`: `object`[]; \}\>

Defined in: [src/api/apiEntries.ts:189](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiEntries.ts#L189)

Загружает список термов, привязанных к записи.

## Parameters

### entryId

`string`

ID записи, для которой нужно получить термы.

## Returns

`Promise`\<\{ `entry_id`: `string`; `terms_by_taxonomy`: `object`[]; \}\>

Данные о термах записи, включая группировку по таксономиям с полной информацией о таксономиях.

## Example

```ts
const entryTerms = await getEntryTerms(42);
console.log(entryTerms.terms_by_taxonomy); // Массив группировок по таксономиям
// Каждая группа содержит полный объект таксономии и массив её термов
const firstGroup = entryTerms.terms_by_taxonomy[0];
console.log(firstGroup.taxonomy.label); // 'Categories'
console.log(firstGroup.terms); // Массив термов этой таксономии
```
