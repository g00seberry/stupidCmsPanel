[**admin**](../../../../README.md)

***

# Class: TaxonomiesEditorStore

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:38](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L38)

Store для управления состоянием редактора таксономии.

## Constructors

### Constructor

> **new TaxonomiesEditorStore**(): `TaxonomiesEditorStore`

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:46](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L46)

Создаёт экземпляр стора редактора таксономии.

#### Returns

`TaxonomiesEditorStore`

## Properties

### formValues

> **formValues**: [`FormValues`](../interfaces/FormValues.md) = `defaultFormValues`

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:39](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L39)

***

### initialLoading

> **initialLoading**: `boolean` = `false`

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:40](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L40)

***

### pending

> **pending**: `boolean` = `false`

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:41](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L41)

## Methods

### deleteTaxonomy()

> **deleteTaxonomy**(`slug`, `force`): `Promise`\<`boolean`\>

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:149](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L149)

Удаляет таксономию.

#### Parameters

##### slug

`string`

Slug таксономии для удаления.

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

> **loadTaxonomy**(`slug`): `Promise`\<`void`\>

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:94](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L94)

Загружает данные таксономии для редактирования.

#### Parameters

##### slug

`string`

Slug таксономии.

#### Returns

`Promise`\<`void`\>

***

### resetForm()

> **resetForm**(): `void`

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:86](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L86)

Сбрасывает форму к значениям по умолчанию.

#### Returns

`void`

***

### saveTaxonomy()

> **saveTaxonomy**(`values`, `isEditMode`, `currentSlug?`): `Promise`\<\{ `created_at?`: `string`; `hierarchical`: `boolean`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `updated_at?`: `string`; \} \| `null`\>

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:113](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L113)

Сохраняет таксономию (создаёт новую или обновляет существующую).

#### Parameters

##### values

[`FormValues`](../interfaces/FormValues.md)

Значения формы.

##### isEditMode

`boolean`

Режим редактирования.

##### currentSlug?

`string`

Текущий slug (для режима редактирования).

#### Returns

`Promise`\<\{ `created_at?`: `string`; `hierarchical`: `boolean`; `label`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `updated_at?`: `string`; \} \| `null`\>

Обновлённая таксономия.

***

### setFormField()

> **setFormField**\<`K`\>(`field`, `value`): `void`

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:63](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L63)

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

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:54](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L54)

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

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:71](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L71)

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

Defined in: [src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts:79](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/TaxonomiesEditorPage/TaxonomiesEditorStore.ts#L79)

Устанавливает флаг выполнения операции.

#### Parameters

##### value

`boolean`

Новое значение флага.

#### Returns

`void`
