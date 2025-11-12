[**admin**](../../../README.md)

***

# Type Alias: LoadPaginatedDataFn()\<TData, TParams\>

> **LoadPaginatedDataFn**\<`TData`, `TParams`\> = (`params`) => `Promise`\<[`PaginatedResult`](PaginatedResult.md)\<`TData`\>\>

Defined in: [src/utils/paginatedDataLoader.ts:32](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/utils/paginatedDataLoader.ts#L32)

Функция загрузки пагинированных данных.

## Type Parameters

### TData

`TData`

### TParams

`TParams` *extends* [`BasePaginationParams`](BasePaginationParams.md)

## Parameters

### params

`TParams`

Параметры запроса, включая пагинацию.

## Returns

`Promise`\<[`PaginatedResult`](PaginatedResult.md)\<`TData`\>\>

Результат с данными, метаданными и ссылками пагинации.
