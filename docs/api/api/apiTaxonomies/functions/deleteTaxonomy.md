[**admin**](../../../README.md)

***

# Function: deleteTaxonomy()

> **deleteTaxonomy**(`id`, `force`): `Promise`\<`boolean`\>

Defined in: [src/api/apiTaxonomies.ts:87](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/api/apiTaxonomies.ts#L87)

Удаляет таксономию.

## Parameters

### id

`string`

ID таксономии для удаления.

### force

`boolean` = `false`

Если `true`, каскадно удаляет все термины этой таксономии. По умолчанию `false`.

## Returns

`Promise`\<`boolean`\>

`true`, если удаление выполнено успешно.

## Throws

Ошибка, если таксономия не найдена или содержит термины (без `force=true`).

## Example

```ts
// Обычное удаление (не удалит, если есть термины)
await deleteTaxonomy(1);

// Каскадное удаление (удалит таксономию и все её термины)
await deleteTaxonomy(1, true);
```
