[**admin**](../../../README.md)

***

# Function: getTermsTree()

> **getTermsTree**(`taxonomyId`): `Promise`\<[`ZTermTree`](../../../types/terms/type-aliases/ZTermTree.md)[]\>

Defined in: [src/api/apiTerms.ts:48](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/api/apiTerms.ts#L48)

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
