[**admin**](../../../README.md)

***

# Function: syncEntryTerms()

> **syncEntryTerms**(`entryId`, `termIds`): `Promise`\<\{ `entry_id`: `string`; `terms_by_taxonomy`: `object`[]; \}\>

Defined in: [src/api/apiEntries.ts:207](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiEntries.ts#L207)

Полная синхронизация термов записи.
Устанавливает указанный список термов как финальный (выполняет detach всех + attach указанных).
Полностью заменяет привязки термов записи.

## Parameters

### entryId

`string`

ID записи, для которой нужно синхронизировать термы.

### termIds

`string`[]

Массив ID терминов для установки (может быть пустым для очистки всех термов).

## Returns

`Promise`\<\{ `entry_id`: `string`; `terms_by_taxonomy`: `object`[]; \}\>

Обновлённые данные о термах записи.

## Throws

Если запись не найдена (404), нет авторизации (401), ошибка валидации (422) или превышен лимит запросов (429).

## Example

```ts
const updatedTerms = await syncEntryTerms(42, [3, 8]);
console.log(updatedTerms.terms_by_taxonomy); // Группировка по таксономиям с синхронизированными термами
```
