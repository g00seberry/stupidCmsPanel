[**admin**](../../../../README.md)

***

# Class: EntryEditorStore

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:58](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L58)

Store для управления состоянием редактора записи.

## Constructors

### Constructor

> **new EntryEditorStore**(`postTypeSlug`, `entryId`): `EntryEditorStore`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:78](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L78)

Создаёт экземпляр стора редактора записи.

#### Parameters

##### postTypeSlug

`string`

Slug типа контента (опционально).

##### entryId

`string`

ID записи для редактирования (опционально).

#### Returns

`EntryEditorStore`

## Properties

### currentPostTypeSlug

> **currentPostTypeSlug**: `string`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:65](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L65)

***

### entryId

> **entryId**: `string`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:66](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L66)

***

### formValues

> **formValues**: [`FormValues`](../interfaces/FormValues.md) = `defaultFormValues`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:59](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L59)

***

### initialLoading

> **initialLoading**: `boolean` = `false`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:60](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L60)

***

### loading

> **loading**: `boolean` = `false`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:63](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L63)

***

### pending

> **pending**: `boolean` = `false`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:61](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L61)

***

### postType

> **postType**: \{ `created_at?`: `string`; `name`: `string`; `options_json`: \{\[`key`: `string`\]: `unknown`; `taxonomies`: `string`[]; \}; `slug`: `string`; `updated_at?`: `string`; \} \| `null` = `null`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:64](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L64)

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

### templates

> **templates**: `object`[] = `[]`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:62](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L62)

#### exists

> **exists**: `boolean`

Флаг существования файла шаблона.

#### name

> **name**: `string`

Имя шаблона в dot notation.

#### path

> **path**: `string`

Путь к файлу шаблона.

***

### termsManagerStore

> **termsManagerStore**: [`EntryTermsManagerStore`](../../../../components/EntryTermsManager/EntryTermsManagerStore/classes/EntryTermsManagerStore.md) \| `null` = `null`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:68](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L68)

Store для управления термами записи. Создаётся только в режиме редактирования.

## Accessors

### isEditMode

#### Get Signature

> **get** **isEditMode**(): `boolean`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:70](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L70)

##### Returns

`boolean`

## Methods

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:130](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L130)

Инициализирует стор: загружает шаблоны, тип контента (если указан) и запись (если указан ID).

#### Returns

`Promise`\<`void`\>

***

### saveEntry()

> **saveEntry**(`values`, `isEditMode`, `entryId?`, `postType?`): `Promise`\<\{ `content_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `string`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \} \| `null`\>

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:164](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L164)

Сохраняет запись (создаёт новую или обновляет существующую).

#### Parameters

##### values

[`FormValues`](../interfaces/FormValues.md)

Значения формы.

##### isEditMode

`boolean`

Режим редактирования.

##### entryId?

`string`

ID записи (для режима редактирования).

##### postType?

`string`

Slug типа контента (обязателен при создании).

#### Returns

`Promise`\<\{ `content_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `string`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \} \| `null`\>

Обновлённая запись.

#### Throws

Ошибка валидации JSON или ошибка API.

***

### setFormValues()

> **setFormValues**(`values`): `void`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:105](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L105)

Устанавливает значения формы.

#### Parameters

##### values

[`FormValues`](../interfaces/FormValues.md)

Новые значения формы.

#### Returns

`void`

***

### setLoading()

> **setLoading**(`value`): `void`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:113](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L113)

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

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:121](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L121)

Устанавливает флаг выполнения операции.

#### Parameters

##### value

`boolean`

Новое значение флага.

#### Returns

`void`

***

### setPostType()

> **setPostType**(`postType`): `void`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:89](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L89)

Устанавливает тип контента.

#### Parameters

##### postType

Тип контента.

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

#### Returns

`void`

***

### setTemplates()

> **setTemplates**(`templates`): `void`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:97](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/EntryEditorPage/EntryEditorStore.ts#L97)

Устанавливает шаблоны.

#### Parameters

##### templates

`object`[]

Шаблоны.

#### Returns

`void`
