[**admin**](../../../README.md)

***

# Function: deletePostType()

> **deletePostType**(`slug`, `force`): `Promise`\<`boolean`\>

Defined in: [src/api/apiPostTypes.ts:77](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/api/apiPostTypes.ts#L77)

Удаляет тип контента.

## Parameters

### slug

`string`

Slug типа контента для удаления.

### force

`boolean` = `false`

Если `true`, каскадно удаляет все записи этого типа. По умолчанию `false`.

## Returns

`Promise`\<`boolean`\>

`true`, если удаление выполнено успешно.

## Throws

Ошибка, если тип контента не найден или содержит записи (без `force=true`).

## Example

```ts
// Обычное удаление (не удалит, если есть записи)
await deletePostType('article');

// Каскадное удаление (удалит тип и все его записи)
await deletePostType('article', true);
```
