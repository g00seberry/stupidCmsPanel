[**admin**](../../../README.md)

***

# Type Alias: ZTermTree

> **ZTermTree** = [`ZTerm`](ZTerm.md) & `object`

Defined in: [src/types/terms.ts:82](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/terms.ts#L82)

Тип данных термина с вложенными дочерними терминами.
Используется для представления дерева терминов.

## Type Declaration

### children

> **children**: `ZTermTree`[]

Массив дочерних терминов. Присутствует только в ответах эндпоинта `/tree`.
