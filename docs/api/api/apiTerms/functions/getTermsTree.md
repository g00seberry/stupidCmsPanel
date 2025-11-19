[**admin**](../../../README.md)

***

# Function: getTermsTree()

> **getTermsTree**(`taxonomyId`): `Promise`\<[`ZTermTree`](../../../types/terms/type-aliases/ZTermTree.md)[]\>

Defined in: [src/api/apiTerms.ts:48](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiTerms.ts#L48)

Загружает дерево терминов для указанной таксономии.
Возвращает иерархическую структуру с вложенными дочерними терминами.
Используется для отображения иерархических таксономий.

## Parameters

### taxonomyId

`string`

ID таксономии, для которой нужно получить дерево терминов.

## Returns

`Promise`\<[`ZTermTree`](../../../types/terms/type-aliases/ZTermTree.md)[]\>

Массив корневых терминов с вложенными дочерними терминами.

## Example

```ts
const tree = await getTermsTree(1);
// tree[0] - корневой термин
// tree[0].children - дочерние термины
// tree[0].children[0].children - внуки и т.д.
```
