[**admin**](../../../../README.md)

***

# Class: EntryEditorStore

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:48](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntryEditorPage/EntryEditorStore.ts#L48)

Store для управления состоянием редактора записи.

## Constructors

### Constructor

> **new EntryEditorStore**(): `EntryEditorStore`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:58](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntryEditorPage/EntryEditorStore.ts#L58)

Создаёт экземпляр стора редактора записи.

#### Returns

`EntryEditorStore`

## Properties

### formValues

> **formValues**: [`FormValues`](../interfaces/FormValues.md) = `defaultFormValues`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:49](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntryEditorPage/EntryEditorStore.ts#L49)

***

### initialLoading

> **initialLoading**: `boolean` = `false`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:50](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntryEditorPage/EntryEditorStore.ts#L50)

***

### loadingTemplates

> **loadingTemplates**: `boolean` = `false`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:53](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntryEditorPage/EntryEditorStore.ts#L53)

***

### pending

> **pending**: `boolean` = `false`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:51](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntryEditorPage/EntryEditorStore.ts#L51)

***

### templates

> **templates**: `object`[] = `[]`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:52](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntryEditorPage/EntryEditorStore.ts#L52)

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

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:123](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntryEditorPage/EntryEditorStore.ts#L123)

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

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:105](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntryEditorPage/EntryEditorStore.ts#L105)

Загружает список доступных шаблонов.

#### Returns

`Promise`\<`void`\>

***

### resetForm()

> **resetForm**(): `void`

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:98](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntryEditorPage/EntryEditorStore.ts#L98)

Сбрасывает форму к значениям по умолчанию.

#### Returns

`void`

***

### saveEntry()

> **saveEntry**(`values`, `isEditMode`, `entryId?`, `postType?`): `Promise`\<\{ `content_json`: `Record`\<`string`, `unknown`\> \| `null`; `created_at?`: `string`; `deleted_at?`: `string` \| `null`; `id`: `number`; `is_published`: `boolean`; `meta_json`: `Record`\<`string`, `unknown`\> \| `null`; `post_type`: `string`; `published_at`: `string` \| `null`; `slug`: `string`; `status`: `"draft"` \| `"published"` \| `"scheduled"` \| `"trashed"`; `template_override?`: `string` \| `null`; `title`: `string`; `updated_at?`: `string`; \} \| `null`\>

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:144](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntryEditorPage/EntryEditorStore.ts#L144)

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

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:75](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntryEditorPage/EntryEditorStore.ts#L75)

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

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:66](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntryEditorPage/EntryEditorStore.ts#L66)

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

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:83](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntryEditorPage/EntryEditorStore.ts#L83)

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

Defined in: [src/pages/EntryEditorPage/EntryEditorStore.ts:91](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/pages/EntryEditorPage/EntryEditorStore.ts#L91)

Устанавливает флаг выполнения операции.

#### Parameters

##### value

`boolean`

Новое значение флага.

#### Returns

`void`
