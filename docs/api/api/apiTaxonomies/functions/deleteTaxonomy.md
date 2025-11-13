[**admin**](../../../README.md)

***

# Function: deleteTaxonomy()

> **deleteTaxonomy**(`slug`, `force`): `Promise`\<`boolean`\>

Defined in: [src/api/apiTaxonomies.ts:90](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/api/apiTaxonomies.ts#L90)

Удаляет таксономию.

## Parameters

### slug

`string`

Slug таксономии для удаления.

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
await deleteTaxonomy('category');

// Каскадное удаление (удалит таксономию и все её термины)
await deleteTaxonomy('category', true);
```
