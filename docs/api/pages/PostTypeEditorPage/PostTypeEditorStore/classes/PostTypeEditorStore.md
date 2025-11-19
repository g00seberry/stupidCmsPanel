[**admin**](../../../../README.md)

***

# Class: PostTypeEditorStore

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:44](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L44)

Store для управления состоянием редактора типа контента.

## Constructors

### Constructor

> **new PostTypeEditorStore**(): `PostTypeEditorStore`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:55](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L55)

Создаёт экземпляр стора редактора типа контента.

#### Returns

`PostTypeEditorStore`

## Properties

### currentPostType

> **currentPostType**: \{ `created_at?`: `string`; `name`: `string`; `options_json`: \{\[`key`: `string`\]: `unknown`; `taxonomies`: `string`[]; \}; `slug`: `string`; `updated_at?`: `string`; \} \| `null` = `null`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:50](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L50)

Текущий тип контента, загруженный из API.

#### Type Declaration

\{ `created_at?`: `string`; `name`: `string`; `options_json`: \{\[`key`: `string`\]: `unknown`; `taxonomies`: `string`[]; \}; `slug`: `string`; `updated_at?`: `string`; \}

#### created\_at?

> `optional` **created\_at**: `string`

Дата создания в формате ISO 8601.

#### name

> **name**: `string`

Отображаемое название типа контента.

#### options\_json

> **options\_json**: `object`

Дополнительные настройки типа контента в формате JSON.

##### Index Signature

\[`key`: `string`\]: `unknown`

##### options\_json.taxonomies

> **taxonomies**: `string`[]

Массив slug'ов разрешённых таксономий. Если пуст или отсутствует, разрешены все таксономии.

#### slug

> **slug**: `string`

Уникальный идентификатор типа контента (URL-friendly строка).

#### updated\_at?

> `optional` **updated\_at**: `string`

Дата последнего обновления в формате ISO 8601.

`null`

***

### formValues

> **formValues**: [`FormValues`](../interfaces/FormValues.md) = `defaultFormValues`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:45](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L45)

***

### initialLoading

> **initialLoading**: `boolean` = `false`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:46](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L46)

***

### pending

> **pending**: `boolean` = `false`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:47](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L47)

***

### slugManuallyEdited

> **slugManuallyEdited**: `boolean` = `false`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:48](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L48)

## Methods

### deletePostType()

> **deletePostType**(`slug`, `force`): `Promise`\<`boolean`\>

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:177](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L177)

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

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:104](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L104)

Загружает данные типа контента для редактирования.

#### Parameters

##### slug

`string`

Slug типа контента.

#### Returns

`Promise`\<`void`\>

***

### savePostType()

> **savePostType**(`values`, `isEditMode`, `currentSlug?`): `Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: \{\[`key`: `string`\]: `unknown`; `taxonomies`: `string`[]; \}; `slug`: `string`; `updated_at?`: `string`; \} \| `null`\>

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:143](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L143)

Сохраняет тип контента (создаёт новый или обновляет существующий).

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

`Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: \{\[`key`: `string`\]: `unknown`; `taxonomies`: `string`[]; \}; `slug`: `string`; `updated_at?`: `string`; \} \| `null`\>

Обновлённый тип контента.

#### Throws

Ошибка валидации JSON или ошибка API.

***

### setCurrentPostType()

> **setCurrentPostType**(`postType`): `void`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:96](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L96)

Устанавливает текущий тип контента.

#### Parameters

##### postType

Тип контента для установки.

\{ `created_at?`: `string`; `name`: `string`; `options_json`: \{\[`key`: `string`\]: `unknown`; `taxonomies`: `string`[]; \}; `slug`: `string`; `updated_at?`: `string`; \}

Тип контента для установки.

###### created_at?

`string` = `...`

Дата создания в формате ISO 8601.

###### name

`string` = `...`

Отображаемое название типа контента.

###### options_json

\{\[`key`: `string`\]: `unknown`; `taxonomies`: `string`[]; \} = `...`

Дополнительные настройки типа контента в формате JSON.

###### options_json.taxonomies

`string`[] = `...`

Массив slug'ов разрешённых таксономий. Если пуст или отсутствует, разрешены все таксономии.

###### slug

`string` = `...`

Уникальный идентификатор типа контента (URL-friendly строка).

###### updated_at?

`string` = `...`

Дата последнего обновления в формате ISO 8601.

| `null`

#### Returns

`void`

***

### setFormField()

> **setFormField**\<`K`\>(`field`, `value`): `void`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:72](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L72)

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

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:63](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L63)

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

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:80](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L80)

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

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:88](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L88)

Устанавливает флаг выполнения операции.

#### Parameters

##### value

`boolean`

Новое значение флага.

#### Returns

`void`
