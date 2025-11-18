[**admin**](../../../README.md)

***

# Class: PaginatedDataLoader\<TData, TParams\>

Defined in: [src/utils/paginatedDataLoader.ts:49](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/utils/paginatedDataLoader.ts#L49)

Универсальный загрузчик пагинированных данных.
Управляет состоянием загрузки, данными и пагинацией для любого типа сущностей.

## Example

```ts
const loader = new PaginatedDataLoader(
  async (params) => await listEntries(params),
  { page: 1, per_page: 15, status: 'all' }
);
await loader.initialize();
console.log(loader.data); // Массив записей
```

## Type Parameters

### TData

`TData`

Тип элемента данных.

### TParams

`TParams` *extends* [`BasePaginationParams`](../type-aliases/BasePaginationParams.md)

Тип параметров запроса (должен расширять BasePaginationParams).

## Constructors

### Constructor

> **new PaginatedDataLoader**\<`TData`, `TParams`\>(`loadFn`, `defaultFilters`): `PaginatedDataLoader`\<`TData`, `TParams`\>

Defined in: [src/utils/paginatedDataLoader.ts:70](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/utils/paginatedDataLoader.ts#L70)

Создаёт экземпляр загрузчика пагинированных данных.

#### Parameters

##### loadFn

[`LoadPaginatedDataFn`](../type-aliases/LoadPaginatedDataFn.md)\<`TData`, `TParams`\>

Функция для загрузки данных с сервера.

##### defaultFilters

`TParams`

Параметры фильтрации по умолчанию.

#### Returns

`PaginatedDataLoader`\<`TData`, `TParams`\>

## Properties

### data

> **data**: `TData`[] = `[]`

Defined in: [src/utils/paginatedDataLoader.ts:51](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/utils/paginatedDataLoader.ts#L51)

Массив загруженных данных.

***

### filters

> **filters**: `TParams`

Defined in: [src/utils/paginatedDataLoader.ts:61](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/utils/paginatedDataLoader.ts#L61)

Текущие параметры фильтрации.

***

### initialLoading

> **initialLoading**: `boolean` = `false`

Defined in: [src/utils/paginatedDataLoader.ts:59](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/utils/paginatedDataLoader.ts#L59)

Флаг начальной загрузки данных.

***

### paginationLinks

> **paginationLinks**: \{ `first`: `string` \| `null`; `last`: `string` \| `null`; `next`: `string` \| `null`; `prev`: `string` \| `null`; \} \| `null` = `null`

Defined in: [src/utils/paginatedDataLoader.ts:55](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/utils/paginatedDataLoader.ts#L55)

Ссылки пагинации.

#### Type Declaration

\{ `first`: `string` \| `null`; `last`: `string` \| `null`; `next`: `string` \| `null`; `prev`: `string` \| `null`; \}

#### first

> **first**: `string` \| `null`

Ссылка на первую страницу.

#### last

> **last**: `string` \| `null`

Ссылка на последнюю страницу.

#### next

> **next**: `string` \| `null`

Ссылка на следующую страницу.

#### prev

> **prev**: `string` \| `null`

Ссылка на предыдущую страницу.

`null`

***

### paginationMeta

> **paginationMeta**: \{ `current_page`: `number`; `last_page`: `number`; `per_page`: `number`; `total`: `number`; \} \| `null` = `null`

Defined in: [src/utils/paginatedDataLoader.ts:53](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/utils/paginatedDataLoader.ts#L53)

Метаданные пагинации.

#### Type Declaration

\{ `current_page`: `number`; `last_page`: `number`; `per_page`: `number`; `total`: `number`; \}

#### current\_page

> **current\_page**: `number`

Текущая страница.

#### last\_page

> **last\_page**: `number`

Последняя страница.

#### per\_page

> **per\_page**: `number`

Количество элементов на странице.

#### total

> **total**: `number`

Общее количество элементов.

`null`

***

### pending

> **pending**: `boolean` = `false`

Defined in: [src/utils/paginatedDataLoader.ts:57](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/utils/paginatedDataLoader.ts#L57)

Флаг выполнения запроса загрузки.

## Methods

### goToPage()

> **goToPage**(`page`): `Promise`\<`void`\>

Defined in: [src/utils/paginatedDataLoader.ts:114](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/utils/paginatedDataLoader.ts#L114)

Переходит на указанную страницу.

#### Parameters

##### page

`number`

Номер страницы.

#### Returns

`Promise`\<`void`\>

***

### initialize()

> **initialize**(`initialFilters?`): `Promise`\<`void`\>

Defined in: [src/utils/paginatedDataLoader.ts:131](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/utils/paginatedDataLoader.ts#L131)

Инициализирует загрузку данных при первом открытии страницы.

#### Parameters

##### initialFilters?

`Partial`\<`TParams`\>

Опциональные начальные фильтры.

#### Returns

`Promise`\<`void`\>

***

### load()

> **load**(): `Promise`\<`void`\>

Defined in: [src/utils/paginatedDataLoader.ts:79](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/utils/paginatedDataLoader.ts#L79)

Загружает данные с текущими фильтрами.

#### Returns

`Promise`\<`void`\>

***

### resetFilters()

> **resetFilters**(`defaultFilters`): `Promise`\<`void`\>

Defined in: [src/utils/paginatedDataLoader.ts:122](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/utils/paginatedDataLoader.ts#L122)

Сбрасывает фильтры к значениям по умолчанию.

#### Parameters

##### defaultFilters

`TParams`

Параметры фильтрации по умолчанию.

#### Returns

`Promise`\<`void`\>

***

### setFilters()

> **setFilters**(`filters`): `Promise`\<`void`\>

Defined in: [src/utils/paginatedDataLoader.ts:105](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/utils/paginatedDataLoader.ts#L105)

Устанавливает фильтры и перезагружает данные.

#### Parameters

##### filters

`Partial`\<`TParams`\>

Новые параметры фильтрации.

#### Returns

`Promise`\<`void`\>
