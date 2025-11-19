[**admin**](../../../../README.md)

***

# Class: TaxonomiesEditorStore

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:36](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L36)

Store для управления состоянием редактора таксономии.

## Constructors

### Constructor

> **new TaxonomiesEditorStore**(): `TaxonomiesEditorStore`

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:44](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L44)

Создаёт экземпляр стора редактора таксономии.

#### Returns

`TaxonomiesEditorStore`

## Properties

### formValues

> **formValues**: [`FormValues`](../interfaces/FormValues.md) = `defaultFormValues`

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:37](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L37)

***

### initialLoading

> **initialLoading**: `boolean` = `false`

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:38](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L38)

***

### pending

> **pending**: `boolean` = `false`

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:39](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L39)

## Methods

### deleteTaxonomy()

> **deleteTaxonomy**(`id`, `force`): `Promise`\<`boolean`\>

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:139](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L139)

Удаляет таксономию.

#### Parameters

##### id

`string`

ID таксономии для удаления.

##### force

`boolean` = `false`

Если `true`, каскадно удаляет все термины этой таксономии.

#### Returns

`Promise`\<`boolean`\>

`true`, если удаление выполнено успешно.

#### Throws

Ошибка 409 (CONFLICT), если таксономия содержит термины и `force=false`.

***

### loadTaxonomy()

> **loadTaxonomy**(`id`): `Promise`\<`void`\>

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:85](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L85)

Загружает данные таксономии для редактирования.

#### Parameters

##### id

`string`

ID таксономии.

#### Returns

`Promise`\<`void`\>

***

### saveTaxonomy()

> **saveTaxonomy**(`values`, `isEditMode`, `currentId?`): `Promise`\<\{ `created_at?`: `string`; `hierarchical`: `boolean`; `id`: `string`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `updated_at?`: `string`; \} \| `null`\>

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:104](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L104)

Сохраняет таксономию (создаёт новую или обновляет существующую).

#### Parameters

##### values

[`FormValues`](../interfaces/FormValues.md)

Значения формы.

##### isEditMode

`boolean`

Режим редактирования.

##### currentId?

`string`

Текущий ID (для режима редактирования).

#### Returns

`Promise`\<\{ `created_at?`: `string`; `hierarchical`: `boolean`; `id`: `string`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `updated_at?`: `string`; \} \| `null`\>

Обновлённая таксономия.

***

### setFormField()

> **setFormField**\<`K`\>(`field`, `value`): `void`

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:61](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L61)

Устанавливает значение конкретного поля формы.

#### Type Parameters

##### K

`K` *extends* keyof [`FormValues`](../interfaces/FormValues.md)

#### Parameters

##### field

`K`

Имя поля.

##### value

[`FormValues`](../interfaces/FormValues.md)\[`K`\]

Новое значение поля.

#### Returns

`void`

***

### setFormValues()

> **setFormValues**(`values`): `void`

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:52](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L52)

Устанавливает значения формы.

#### Parameters

##### values

[`FormValues`](../interfaces/FormValues.md)

Новые значения формы.

#### Returns

`void`

***

### setInitialLoading()

> **setInitialLoading**(`value`): `void`

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:69](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L69)

Устанавливает флаг начальной загрузки.

#### Parameters

##### value

`boolean`

Новое значение флага.

#### Returns

`void`

***

### setPending()

> **setPending**(`value`): `void`

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:77](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L77)

Устанавливает флаг выполнения операции.

#### Parameters

##### value

`boolean`

Новое значение флага.

#### Returns

`void`
