[**admin**](../../../README.md)

***

# Function: bulkDeleteMedia()

> **bulkDeleteMedia**(`ids`): `Promise`\<`void`\>

Defined in: [src/api/apiMedia.ts:254](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiMedia.ts#L254)

Выполняет массовое мягкое удаление медиа-файлов.

## Parameters

### ids

`string`[]

Массив ULID идентификаторов медиа-файлов для удаления.

## Returns

`Promise`\<`void`\>

## Throws

Если нет авторизации (401), ошибка валидации (422) или превышен лимит запросов (429).

## Example

```ts
await bulkDeleteMedia([
  '01HXZYXQJ123456789ABCDEF',
  '01HXZYXQJ987654321FEDCBA'
]);
```
