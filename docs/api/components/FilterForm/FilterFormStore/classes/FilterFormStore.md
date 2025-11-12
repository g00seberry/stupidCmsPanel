[**admin**](../../../../README.md)

***

# Class: FilterFormStore

Defined in: [src/components/FilterForm/FilterFormStore.ts:7](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/components/FilterForm/FilterFormStore.ts#L7)

Store для управления состоянием формы фильтрации.
Хранит значения фильтров и обеспечивает их изменение только внутри компонента.

## Constructors

### Constructor

> **new FilterFormStore**(`initialValues`): `FilterFormStore`

Defined in: [src/components/FilterForm/FilterFormStore.ts:11](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/components/FilterForm/FilterFormStore.ts#L11)

#### Parameters

##### initialValues

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

`FilterFormStore`

## Properties

### values

> **values**: `Record`\<`string`, `unknown`\> = `{}`

Defined in: [src/components/FilterForm/FilterFormStore.ts:9](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/components/FilterForm/FilterFormStore.ts#L9)

Значения фильтров.

## Methods

### getValue()

> **getValue**(`name`): `unknown`

Defined in: [src/components/FilterForm/FilterFormStore.ts:45](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/components/FilterForm/FilterFormStore.ts#L45)

Получает значение фильтра по имени.

#### Parameters

##### name

`string`

Имя поля фильтра.

#### Returns

`unknown`

Значение фильтра или undefined.

***

### reset()

> **reset**(`defaultValues`): `void`

Defined in: [src/components/FilterForm/FilterFormStore.ts:36](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/components/FilterForm/FilterFormStore.ts#L36)

Сбрасывает значения фильтров к начальным.

#### Parameters

##### defaultValues

`Record`\<`string`, `unknown`\> = `{}`

Значения по умолчанию.

#### Returns

`void`

***

### setValues()

> **setValues**(`values`): `void`

Defined in: [src/components/FilterForm/FilterFormStore.ts:20](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/components/FilterForm/FilterFormStore.ts#L20)

Устанавливает значения фильтров.

#### Parameters

##### values

`Record`\<`string`, `unknown`\>

Новые значения фильтров.

#### Returns

`void`

***

### updateValues()

> **updateValues**(`values`): `void`

Defined in: [src/components/FilterForm/FilterFormStore.ts:28](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/components/FilterForm/FilterFormStore.ts#L28)

Обновляет значения фильтров частично.

#### Parameters

##### values

`Partial`\<`Record`\<`string`, `unknown`\>\>

Частичные значения фильтров для обновления.

#### Returns

`void`
