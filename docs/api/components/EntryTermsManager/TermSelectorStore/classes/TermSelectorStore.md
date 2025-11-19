[**admin**](../../../../README.md)

***

# Class: TermSelectorStore

Defined in: [src/components/EntryTermsManager/TermSelectorStore.ts:33](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/components/EntryTermsManager/TermSelectorStore.ts#L33)

Store для управления состоянием компонента выбора термов.
Обеспечивает загрузку термов, поиск и фильтрацию для иерархических и плоских таксономий.

## Constructors

### Constructor

> **new TermSelectorStore**(`taxonomyId`): `TermSelectorStore`

Defined in: [src/components/EntryTermsManager/TermSelectorStore.ts:49](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/components/EntryTermsManager/TermSelectorStore.ts#L49)

Создаёт экземпляр стора выбора термов.

#### Parameters

##### taxonomyId

`string`

#### Returns

`TermSelectorStore`

## Properties

### loading

> **loading**: `boolean` = `false`

Defined in: [src/components/EntryTermsManager/TermSelectorStore.ts:35](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/components/EntryTermsManager/TermSelectorStore.ts#L35)

Флаг выполнения асинхронной операции загрузки данных.

***

### taxonomyData

> **taxonomyData**: \{ `created_at?`: `string`; `hierarchical`: `boolean`; `id`: `string`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `updated_at?`: `string`; \} \| `null` = `null`

Defined in: [src/components/EntryTermsManager/TermSelectorStore.ts:44](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/components/EntryTermsManager/TermSelectorStore.ts#L44)

Данные таксономии.

#### Type Declaration

\{ `created_at?`: `string`; `hierarchical`: `boolean`; `id`: `string`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `updated_at?`: `string`; \}

#### created\_at?

> `optional` **created\_at**: `string`

Дата создания в формате ISO 8601.

#### hierarchical

> **hierarchical**: `boolean`

Является ли таксономия иерархической (поддерживает вложенность).

#### id

> **id**: `string` = `zId`

Уникальный идентификатор таксономии.

#### label

> **label**: `string`

Отображаемое название таксономии.

#### options\_json

> **options\_json**: `Record`\<`string`, `unknown`\> \| `null`

Дополнительные настройки таксономии в формате JSON.

#### updated\_at?

> `optional` **updated\_at**: `string`

Дата последнего обновления в формате ISO 8601.

`null`

***

### taxonomyId

> **taxonomyId**: `string`

Defined in: [src/components/EntryTermsManager/TermSelectorStore.ts:38](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/components/EntryTermsManager/TermSelectorStore.ts#L38)

ID текущей таксономии.

***

### taxonomyTree

> **taxonomyTree**: [`ZTermTree`](../../../../types/terms/type-aliases/ZTermTree.md)[] = `[]`

Defined in: [src/components/EntryTermsManager/TermSelectorStore.ts:41](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/components/EntryTermsManager/TermSelectorStore.ts#L41)

Дерево термов для таксономии.

## Accessors

### flatTerms

#### Get Signature

> **get** **flatTerms**(): `object`[]

Defined in: [src/components/EntryTermsManager/TermSelectorStore.ts:91](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/components/EntryTermsManager/TermSelectorStore.ts#L91)

Плоский список всех термов из дерева.
Преобразует иерархическую структуру в простой массив.

##### Returns

## Methods

### loadData()

> **loadData**(): `Promise`\<`void`\>

Defined in: [src/components/EntryTermsManager/TermSelectorStore.ts:74](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/components/EntryTermsManager/TermSelectorStore.ts#L74)

Загружает данные таксономии и термов.
Определяет тип таксономии (иерархическая или нет) и загружает соответствующие данные.

#### Returns

`Promise`\<`void`\>

***

### setTaxonomyData()

> **setTaxonomyData**(`taxonomyData`): `void`

Defined in: [src/components/EntryTermsManager/TermSelectorStore.ts:66](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/components/EntryTermsManager/TermSelectorStore.ts#L66)

Устанавливает данные таксономии.

#### Parameters

##### taxonomyData

Данные таксономии.

###### created_at?

`string` = `...`

Дата создания в формате ISO 8601.

###### hierarchical

`boolean` = `...`

Является ли таксономия иерархической (поддерживает вложенность).

###### id

`string` = `zId`

Уникальный идентификатор таксономии.

###### label

`string` = `...`

Отображаемое название таксономии.

###### options_json

`Record`\<`string`, `unknown`\> \| `null` = `...`

Дополнительные настройки таксономии в формате JSON.

###### updated_at?

`string` = `...`

Дата последнего обновления в формате ISO 8601.

#### Returns

`void`

***

### setTaxonomyTree()

> **setTaxonomyTree**(`taxonomyTree`): `void`

Defined in: [src/components/EntryTermsManager/TermSelectorStore.ts:58](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/components/EntryTermsManager/TermSelectorStore.ts#L58)

Устанавливает данные таксономии.

#### Parameters

##### taxonomyTree

[`ZTermTree`](../../../../types/terms/type-aliases/ZTermTree.md)[]

#### Returns

`void`
