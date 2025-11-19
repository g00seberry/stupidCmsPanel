[**admin**](../../../README.md)

***

# Function: viewDate()

> **viewDate**(`date`): `Dayjs` \| `null`

Defined in: [src/utils/dateUtils.ts:39](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/utils/dateUtils.ts#L39)

Преобразует дату из формата сервера (ISO 8601 строка) в формат представления (Dayjs объект).

## Parameters

### date

Дата в формате ISO 8601 с сервера или null/undefined.

`string` | `null` | `undefined`

## Returns

`Dayjs` \| `null`

Dayjs объект для использования в DatePicker или null, если дата не указана.

## Example

```ts
const viewDate = viewDate('2025-02-10T08:00:00+00:00');
console.log(viewDate?.format('YYYY-MM-DD HH:mm')); // '2025-02-10 08:00'
```
