[**admin**](../../../../README.md)

***

# Class: PostTypeEditorStore

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:43](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L43)

Store для управления состоянием редактора типа контента.

## Constructors

### Constructor

> **new PostTypeEditorStore**(): `PostTypeEditorStore`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:52](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L52)

Создаёт экземпляр стора редактора типа контента.

#### Returns

`PostTypeEditorStore`

## Properties

### formValues

> **formValues**: [`FormValues`](../interfaces/FormValues.md) = `defaultFormValues`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:44](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L44)

***

### initialLoading

> **initialLoading**: `boolean` = `false`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:45](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L45)

***

### pending

> **pending**: `boolean` = `false`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:46](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L46)

***

### slugManuallyEdited

> **slugManuallyEdited**: `boolean` = `false`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:47](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L47)

## Methods

### loadPostType()

> **loadPostType**(`slug`): `Promise`\<`void`\>

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:101](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L101)

Загружает данные типа контента для редактирования.

#### Parameters

##### slug

`string`

Slug типа контента.

#### Returns

`Promise`\<`void`\>

***

### resetForm()

> **resetForm**(): `void`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:92](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L92)

Сбрасывает форму к значениям по умолчанию.

#### Returns

`void`

***

### savePostType()

> **savePostType**(`values`, `isEditMode`, `currentSlug?`): `Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `template?`: `string` \| `null`; `updated_at?`: `string`; \} \| `null`\>

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:120](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L120)

Сохраняет тип контента (создаёт новый или обновляет существующий).

#### Parameters

##### values

[`FormValues`](../interfaces/FormValues.md)

##### isEditMode

`boolean`

Режим редактирования.

##### currentSlug?

`string`

Текущий slug (для режима редактирования).

#### Returns

`Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `template?`: `string` \| `null`; `updated_at?`: `string`; \} \| `null`\>

Обновлённый тип контента.

#### Throws

Ошибка валидации JSON или ошибка API.

***

### setFormField()

> **setFormField**\<`K`\>(`field`, `value`): `void`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:69](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L69)

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

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:60](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L60)

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

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:77](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L77)

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

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:85](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L85)

Устанавливает флаг выполнения операции.

#### Parameters

##### value

`boolean`

Новое значение флага.

#### Returns

`void`
