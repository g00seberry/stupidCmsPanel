[**admin**](../../../README.md)

***

# Type Alias: ZTermTree

> **ZTermTree** = [`ZTerm`](ZTerm.md) & `object`

Defined in: [src/types/terms.ts:82](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/terms.ts#L82)

Тип данных термина с вложенными дочерними терминами.
Используется для представления дерева терминов.

## Type Declaration

### children

> **children**: `ZTermTree`[]

Массив дочерних терминов. Присутствует только в ответах эндпоинта `/tree`.
