[**admin**](../../../README.md)

***

# Function: bulkForceDeleteMedia()

> **bulkForceDeleteMedia**(`ids`): `Promise`\<`void`\>

Defined in: [src/api/apiMedia.ts:290](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiMedia.ts#L290)

Выполняет окончательное удаление медиа-файлов (удаляет физические файлы и записи из БД).
Требует специальных прав доступа.

## Parameters

### ids

`string`[]

Массив ULID идентификаторов медиа-файлов для окончательного удаления.

## Returns

`Promise`\<`void`\>

## Throws

Если нет авторизации (401), нет прав доступа (403), ошибка валидации (422) или превышен лимит запросов (429).

## Example

```ts
await bulkForceDeleteMedia([
  '01HXZYXQJ123456789ABCDEF',
  '01HXZYXQJ987654321FEDCBA'
]);
```
