[**admin**](../../../README.md)

***

# Function: deleteMedia()

> **deleteMedia**(`id`): `Promise`\<`void`\>

Defined in: [src/api/apiMedia.ts:223](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiMedia.ts#L223)

Выполняет мягкое удаление медиа-файла.
Использует bulk API для удаления одного файла.

## Parameters

### id

`string`

ULID идентификатор медиа-файла для удаления.

## Returns

`Promise`\<`void`\>

## Throws

Если медиа-файл не найден (404), нет авторизации (401) или превышен лимит запросов (429).

## Example

```ts
await deleteMedia('01HXZYXQJ123456789ABCDEF');
```
