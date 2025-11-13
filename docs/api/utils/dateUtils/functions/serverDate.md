[**admin**](../../../README.md)

***

# Function: serverDate()

> **serverDate**(`date`): `string` \| `null`

Defined in: [src/utils/dateUtils.ts:18](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/utils/dateUtils.ts#L18)

Преобразует дату из формата представления (Dayjs объект или строка) в формат сервера (ISO 8601 строка).

## Parameters

### date

Дата в формате представления (Dayjs объект, строка или null/undefined).

`string` | `Dayjs` | `null` | `undefined`

## Returns

`string` \| `null`

Дата в формате ISO 8601 для отправки на сервер или null, если дата не указана.

## Example

```ts
const serverDate = serverDate(dayjs('2025-02-10 08:00'));
console.log(serverDate); // '2025-02-10T08:00:00+00:00'
```
