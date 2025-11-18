[**admin**](../../../../README.md)

***

# Class: TermEditorStore

Defined in: [src/pages/TermEditorPage/TermEditorStore.ts:36](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/pages/TermEditorPage/TermEditorStore.ts#L36)

Store для управления состоянием редактора термина.

## Constructors

### Constructor

> **new TermEditorStore**(): `TermEditorStore`

Defined in: [src/pages/TermEditorPage/TermEditorStore.ts:44](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/pages/TermEditorPage/TermEditorStore.ts#L44)

Создаёт экземпляр стора редактора термина.

#### Returns

`TermEditorStore`

## Properties

### formValues

> **formValues**: [`FormValues`](../interfaces/FormValues.md) = `defaultFormValues`

Defined in: [src/pages/TermEditorPage/TermEditorStore.ts:37](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/pages/TermEditorPage/TermEditorStore.ts#L37)

***

### initialLoading

> **initialLoading**: `boolean` = `false`

Defined in: [src/pages/TermEditorPage/TermEditorStore.ts:38](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/pages/TermEditorPage/TermEditorStore.ts#L38)

***

### pending

> **pending**: `boolean` = `false`

Defined in: [src/pages/TermEditorPage/TermEditorStore.ts:39](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/pages/TermEditorPage/TermEditorStore.ts#L39)

## Methods

### deleteTerm()

> **deleteTerm**(`termId`, `forceDetach`): `Promise`\<`boolean`\>

Defined in: [src/pages/TermEditorPage/TermEditorStore.ts:141](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/pages/TermEditorPage/TermEditorStore.ts#L141)

Удаляет термин.

#### Parameters

##### termId

`string`

ID термина для удаления.

##### forceDetach

`boolean` = `false`

Если `true`, автоматически отвязывает термин от всех записей.

#### Returns

`Promise`\<`boolean`\>

`true`, если удаление выполнено успешно.

#### Throws

Ошибка 409 (CONFLICT), если термин привязан к записям и `forceDetach=false`.

***

### loadTerm()

> **loadTerm**(`termId`): `Promise`\<`void`\>

Defined in: [src/pages/TermEditorPage/TermEditorStore.ts:85](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/pages/TermEditorPage/TermEditorStore.ts#L85)

Загружает данные термина для редактирования.

#### Parameters

##### termId

`string`

ID термина.

#### Returns

`Promise`\<`void`\>

***

### saveTerm()

> **saveTerm**(`values`, `taxonomyId`, `isEditMode`, `termId?`): `Promise`\<\{ `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `string`; `meta_json`: `unknown`; `name`: `string`; `parent_id?`: `string` \| `null`; `taxonomy`: `string`; `updated_at?`: `string`; \} \| `null`\>

Defined in: [src/pages/TermEditorPage/TermEditorStore.ts:105](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/pages/TermEditorPage/TermEditorStore.ts#L105)

Сохраняет термин (создаёт новый или обновляет существующий).

#### Parameters

##### values

[`FormValues`](../interfaces/FormValues.md)

Значения формы.

##### taxonomyId

`string`

ID таксономии.

##### isEditMode

`boolean`

Режим редактирования.

##### termId?

`string`

ID термина (для режима редактирования).

#### Returns

`Promise`\<\{ `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `string`; `meta_json`: `unknown`; `name`: `string`; `parent_id?`: `string` \| `null`; `taxonomy`: `string`; `updated_at?`: `string`; \} \| `null`\>

Обновлённый термин.

***

### setFormField()

> **setFormField**\<`K`\>(`field`, `value`): `void`

Defined in: [src/pages/TermEditorPage/TermEditorStore.ts:61](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/pages/TermEditorPage/TermEditorStore.ts#L61)

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

Defined in: [src/pages/TermEditorPage/TermEditorStore.ts:52](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/pages/TermEditorPage/TermEditorStore.ts#L52)

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

Defined in: [src/pages/TermEditorPage/TermEditorStore.ts:69](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/pages/TermEditorPage/TermEditorStore.ts#L69)

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

Defined in: [src/pages/TermEditorPage/TermEditorStore.ts:77](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/pages/TermEditorPage/TermEditorStore.ts#L77)

Устанавливает флаг выполнения операции.

#### Parameters

##### value

`boolean`

Новое значение флага.

#### Returns

`void`
