[**admin**](../../../../README.md)

***

# Class: EntryEditorStore

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:56](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/pages/EntryEditorPage/EntryEditorStore.ts#L56)

Store для управления состоянием редактора записи.

## Constructors

### Constructor

> **new EntryEditorStore**(): `EntryEditorStore`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:66](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/pages/EntryEditorPage/EntryEditorStore.ts#L66)

Создаёт экземпляр стора редактора записи.

#### Returns

`EntryEditorStore`

## Properties

### formValues

> **formValues**: [`FormValues`](../interfaces/FormValues.md) = `defaultFormValues`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:57](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/pages/EntryEditorPage/EntryEditorStore.ts#L57)

***

### initialLoading

> **initialLoading**: `boolean` = `false`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:58](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/pages/EntryEditorPage/EntryEditorStore.ts#L58)

***

### loadingTemplates

> **loadingTemplates**: `boolean` = `false`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:61](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/pages/EntryEditorPage/EntryEditorStore.ts#L61)

***

### pending

> **pending**: `boolean` = `false`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:59](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/pages/EntryEditorPage/EntryEditorStore.ts#L59)

***

### templates

> **templates**: `object`[] = `[]`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:60](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/pages/EntryEditorPage/EntryEditorStore.ts#L60)

#### exists

> **exists**: `boolean`

Флаг существования файла шаблона.

#### name

> **name**: `string`

Имя шаблона в dot notation.

#### path

> **path**: `string`

Путь к файлу шаблона.

## Methods

### loadEntry()

> **loadEntry**(`id`): `Promise`\<`void`\>

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:131](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/pages/EntryEditorPage/EntryEditorStore.ts#L131)

Загружает данные записи для редактирования.

#### Parameters

##### id

`number`

ID записи.

#### Returns

`Promise`\<`void`\>

***

### loadTemplates()

> **loadTemplates**(): `Promise`\<`void`\>

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:113](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/pages/EntryEditorPage/EntryEditorStore.ts#L113)

Загружает список доступных шаблонов.

#### Returns

`Promise`\<`void`\>

***

### resetForm()

> **resetForm**(): `void`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:106](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/pages/EntryEditorPage/EntryEditorStore.ts#L106)

Сбрасывает форму к значениям по умолчанию.

#### Returns

`void`

***

### saveEntry()

> **saveEntry**(`values`, `isEditMode`, `entryId?`, `postType?`): `Promise`\<\{ `content_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `number`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \} \| `null`\>

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:152](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/pages/EntryEditorPage/EntryEditorStore.ts#L152)

Сохраняет запись (создаёт новую или обновляет существующую).

#### Parameters

##### values

[`FormValues`](../interfaces/FormValues.md)

Значения формы.

##### isEditMode

`boolean`

Режим редактирования.

##### entryId?

`number`

ID записи (для режима редактирования).

##### postType?

`string`

Slug типа контента (обязателен при создании).

#### Returns

`Promise`\<\{ `content_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `number`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \} \| `null`\>

Обновлённая запись.

#### Throws

Ошибка валидации JSON или ошибка API.

***

### setFormField()

> **setFormField**\<`K`\>(`field`, `value`): `void`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:83](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/pages/EntryEditorPage/EntryEditorStore.ts#L83)

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

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:74](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/pages/EntryEditorPage/EntryEditorStore.ts#L74)

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

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:91](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/pages/EntryEditorPage/EntryEditorStore.ts#L91)

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

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:99](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/pages/EntryEditorPage/EntryEditorStore.ts#L99)

Устанавливает флаг выполнения операции.

#### Parameters

##### value

`boolean`

Новое значение флага.

#### Returns

`void`
