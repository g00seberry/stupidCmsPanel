[**admin**](../../../../README.md)

***

# Class: PostTypeEditorStore

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:35](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L35)

Store для управления состоянием редактора типа контента.

## Constructors

### Constructor

> **new PostTypeEditorStore**(): `PostTypeEditorStore`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:44](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L44)

Создаёт экземпляр стора редактора типа контента.

#### Returns

`PostTypeEditorStore`

## Properties

### formValues

> **formValues**: [`FormValues`](../interfaces/FormValues.md) = `defaultFormValues`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:36](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L36)

***

### initialLoading

> **initialLoading**: `boolean` = `false`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:37](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L37)

***

### pending

> **pending**: `boolean` = `false`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:38](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L38)

***

### slugManuallyEdited

> **slugManuallyEdited**: `boolean` = `false`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:39](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L39)

## Methods

### deletePostType()

> **deletePostType**(`slug`, `force`): `Promise`\<`boolean`\>

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:148](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L148)

Удаляет тип контента.

#### Parameters

##### slug

`string`

Slug типа контента для удаления.

##### force

`boolean` = `false`

Если `true`, каскадно удаляет все записи этого типа.

#### Returns

`Promise`\<`boolean`\>

`true`, если удаление выполнено успешно.

#### Throws

Ошибка 409 (CONFLICT), если тип содержит записи и `force=false`.

***

### loadPostType()

> **loadPostType**(`slug`): `Promise`\<`void`\>

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:93](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L93)

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

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:84](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L84)

Сбрасывает форму к значениям по умолчанию.

#### Returns

`void`

***

### savePostType()

> **savePostType**(`values`, `isEditMode`, `currentSlug?`): `Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\>; `slug`: `string`; `updated_at?`: `string`; \} \| `null`\>

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:112](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L112)

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

`Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\>; `slug`: `string`; `updated_at?`: `string`; \} \| `null`\>

Обновлённый тип контента.

#### Throws

Ошибка валидации JSON или ошибка API.

***

### setFormField()

> **setFormField**\<`K`\>(`field`, `value`): `void`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:61](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L61)

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

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:52](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L52)

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

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:69](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L69)

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

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:77](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L77)

Устанавливает флаг выполнения операции.

#### Parameters

##### value

`boolean`

Новое значение флага.

#### Returns

`void`
