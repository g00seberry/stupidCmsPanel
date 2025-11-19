[**admin**](../../../README.md)

***

# Type Alias: LoadPaginatedDataFn()\<TData, TParams\>

> **LoadPaginatedDataFn**\<`TData`, `TParams`\> = (`params`) => `Promise`\<[`PaginatedResult`](PaginatedResult.md)\<`TData`\>\>

Defined in: [src/utils/paginatedDataLoader.ts:32](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/utils/paginatedDataLoader.ts#L32)

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
