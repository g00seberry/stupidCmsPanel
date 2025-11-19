[**admin**](../../../../README.md)

***

# Class: TermsListStore

Defined in: [src/pages/TermsPage/TermsListStore.ts:12](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TermsPage/TermsListStore.ts#L12)

Store для управления состоянием списка терминов таксономии.
Обеспечивает загрузку иерархии терминов.

## Constructors

### Constructor

> **new TermsListStore**(): `TermsListStore`

Defined in: [src/pages/TermsPage/TermsListStore.ts:34](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TermsPage/TermsListStore.ts#L34)

#### Returns

`TermsListStore`

## Properties

### loading

> **loading**: `boolean` = `false`

Defined in: [src/pages/TermsPage/TermsListStore.ts:20](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TermsPage/TermsListStore.ts#L20)

Флаг выполнения запроса загрузки таксономии.

***

### taxonomy

> **taxonomy**: \{ `created_at?`: `string`; `hierarchical`: `boolean`; `id`: `string`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `updated_at?`: `string`; \} \| `null` = `null`

Defined in: [src/pages/TermsPage/TermsListStore.ts:17](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TermsPage/TermsListStore.ts#L17)

Данные текущей таксономии.

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

### termsTree

> **termsTree**: [`ZTermTree`](../../../../types/terms/type-aliases/ZTermTree.md)[] = `[]`

Defined in: [src/pages/TermsPage/TermsListStore.ts:14](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TermsPage/TermsListStore.ts#L14)

Дерево терминов таксономии.

## Methods

### initialize()

> **initialize**(`taxonomyId`): `Promise`\<`void`\>

Defined in: [src/pages/TermsPage/TermsListStore.ts:42](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TermsPage/TermsListStore.ts#L42)

Инициализирует загрузку данных при первом открытии страницы.

#### Parameters

##### taxonomyId

ID таксономии для фильтрации.

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### setLoading()

> **setLoading**(`loading`): `void`

Defined in: [src/pages/TermsPage/TermsListStore.ts:26](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TermsPage/TermsListStore.ts#L26)

#### Parameters

##### loading

`boolean`

#### Returns

`void`

***

### setTaxonomy()

> **setTaxonomy**(`taxonomy`): `void`

Defined in: [src/pages/TermsPage/TermsListStore.ts:22](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TermsPage/TermsListStore.ts#L22)

#### Parameters

##### taxonomy

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

### setTermsTree()

> **setTermsTree**(`tree`): `void`

Defined in: [src/pages/TermsPage/TermsListStore.ts:30](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TermsPage/TermsListStore.ts#L30)

#### Parameters

##### tree

[`ZTermTree`](../../../../types/terms/type-aliases/ZTermTree.md)[]

#### Returns

`void`
