[**admin**](../../../README.md)

***

# Function: deleteTerm()

> **deleteTerm**(`termId`, `forceDetach`): `Promise`\<`boolean`\>

Defined in: [src/api/apiTerms.ts:105](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/api/apiTerms.ts#L105)

Удаляет термин.

## Parameters

### termId

`string`

ID термина для удаления.

### forceDetach

`boolean` = `false`

Если `true`, автоматически отвязывает термин от всех записей. По умолчанию `false`.

## Returns

`Promise`\<`boolean`\>

`true`, если удаление выполнено успешно.

## Throws

Ошибка, если термин не найден или привязан к записям (без `forceDetach=true`).

## Example

```ts
// Обычное удаление (не удалит, если термин привязан к записям)
await deleteTerm(3);

// Удаление с автоматической отвязкой от записей
await deleteTerm(3, true);
```
