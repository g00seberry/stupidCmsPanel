[**admin**](../../../../README.md)

***

# Class: EntryTermsManagerStore

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:13](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L13)

Store для управления состоянием управления термами записи.
Обеспечивает загрузку, добавление и удаление термов записи.

## Constructors

### Constructor

> **new EntryTermsManagerStore**(`entryId`): `EntryTermsManagerStore`

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:32](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L32)

Создаёт экземпляр стора управления термами записи.

#### Parameters

##### entryId

`string`

#### Returns

`EntryTermsManagerStore`

## Properties

### entryId

> **entryId**: `string`

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:23](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L23)

ID записи, для которой управляются термы.

***

### entryTerms

> **entryTerms**: \{ `entry_id`: `string`; `terms_by_taxonomy`: `object`[]; \} \| `null` = `null`

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:15](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L15)

Данные о термах записи.

#### Type Declaration

\{ `entry_id`: `string`; `terms_by_taxonomy`: `object`[]; \}

#### entry\_id

> **entry\_id**: `string` = `zId`

ID записи, для которой получены термы.

#### terms\_by\_taxonomy

> **terms\_by\_taxonomy**: `object`[]

Массив группировок термов по таксономиям. Каждый элемент содержит полную информацию о таксономии и массив её термов.

`null`

***

### loading

> **loading**: `boolean` = `false`

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:17](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L17)

Флаг выполнения асинхронной операции.

***

### modalVisible

> **modalVisible**: `boolean` = `false`

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:21](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L21)

Флаг видимости модального окна добавления термов.

***

### pendingTermIds

> **pendingTermIds**: `Set`\<`string`\>

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:25](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L25)

Временное состояние выбранных термов в модальном окне.

***

### selectedTaxonomy

> **selectedTaxonomy**: `string` \| `null` = `null`

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:19](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L19)

ID выбранной таксономии для добавления термов.

***

### termsCache

> **termsCache**: `Map`\<`string`, \{ `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `string`; `meta_json`: `unknown`; `name`: `string`; `parent_id?`: `string` \| `null`; `taxonomy`: `string`; `updated_at?`: `string`; \}\>

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:27](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L27)

Кэш термов по ID для быстрого доступа.

## Accessors

### availableTaxonomies

#### Get Signature

> **get** **availableTaxonomies**(): `object`[]

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:57](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L57)

Список доступных таксономий с учётом ограничений.

##### Returns

***

### currentTermIds

#### Get Signature

> **get** **currentTermIds**(): `string`[]

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:80](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L80)

Массив ID текущих термов записи для выбранной таксономии.
Если модальное окно открыто, возвращает временное состояние (все выбранные термы из всех таксономий).
TermSelector сам отфильтрует нужные термы по taxonomyId.

##### Returns

`string`[]

***

### currentTerms

#### Get Signature

> **get** **currentTerms**(): `object`[]

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:64](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L64)

Текущие термы записи в плоском виде с информацией о таксономии.

##### Returns

## Methods

### buildDisplayTerms()

> **buildDisplayTerms**(`termIds`): \{ `entry_id`: `string`; `terms_by_taxonomy`: `object`[]; \} \| `null`

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:153](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L153)

Строит список термов для отображения на основе value из формы.
Использует кэш для термов, которых нет в entryTerms.

#### Parameters

##### termIds

`string`[]

Массив ID термов из формы.

#### Returns

\{ `entry_id`: `string`; `terms_by_taxonomy`: `object`[]; \}

##### entry\_id

> **entry\_id**: `string` = `zId`

ID записи, для которой получены термы.

##### terms\_by\_taxonomy

> **terms\_by\_taxonomy**: `object`[]

Массив группировок термов по таксономиям. Каждый элемент содержит полную информацию о таксономии и массив её термов.

`null`

Данные о термах для отображения.

***

### cacheTerms()

> **cacheTerms**(`terms`): `void`

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:141](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L141)

Добавляет термы в кэш.

#### Parameters

##### terms

`object`[]

Массив термов для кэширования.

#### Returns

`void`

***

### closeModal()

> **closeModal**(): `void`

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:119](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L119)

Закрывает модальное окно добавления термов.
Сбрасывает временное состояние.

#### Returns

`void`

***

### initialize()

> **initialize**(`termIds?`): `Promise`\<`void`\>

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:41](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L41)

Инициализирует стор с параметрами записи.

#### Parameters

##### termIds?

`string`[]

Массив ID термов из формы (опционально, используется только для инициализации pendingTermIds).

#### Returns

`Promise`\<`void`\>

***

### openModal()

> **openModal**(`taxonomyId`, `termIds`): `void`

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:109](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L109)

Открывает модальное окно добавления термов для указанной таксономии.
Инициализирует временное состояние текущими термами из формы.

#### Parameters

##### taxonomyId

`string`

ID таксономии, для которой открывается модальное окно.

##### termIds

`string`[] = `[]`

Массив ID термов из формы.

#### Returns

`void`

***

### setEntryTerms()

> **setEntryTerms**(`entryTerms`): `void`

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:91](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L91)

Устанавливает данные о термах записи.

#### Parameters

##### entryTerms

Данные о термах записи.

###### entry_id

`string` = `zId`

ID записи, для которой получены термы.

###### terms_by_taxonomy

`object`[] = `...`

Массив группировок термов по таксономиям. Каждый элемент содержит полную информацию о таксономии и массив её термов.

#### Returns

`void`

***

### setSelectedTaxonomy()

> **setSelectedTaxonomy**(`taxonomyId`): `void`

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:99](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L99)

Устанавливает ID выбранной таксономии.

#### Parameters

##### taxonomyId

ID таксономии.

`string` | `null`

#### Returns

`void`

***

### updatePendingTerm()

> **updatePendingTerm**(`termId`, `checked`): `void`

Defined in: [src/components/EntryTermsManager/EntryTermsManagerStore.ts:129](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/components/EntryTermsManager/EntryTermsManagerStore.ts#L129)

Обновляет временное состояние выбранных термов.

#### Parameters

##### termId

`string`

ID терма для добавления или удаления.

##### checked

`boolean`

Флаг выбора терма.

#### Returns

`void`
