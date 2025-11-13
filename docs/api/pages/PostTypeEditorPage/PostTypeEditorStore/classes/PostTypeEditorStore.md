[**admin**](../../../../README.md)

***

# Class: PostTypeEditorStore

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:45](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L45)

Store для управления состоянием редактора типа контента.

## Constructors

### Constructor

> **new PostTypeEditorStore**(): `PostTypeEditorStore`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:56](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L56)

Создаёт экземпляр стора редактора типа контента.

#### Returns

`PostTypeEditorStore`

## Properties

### formValues

> **formValues**: [`FormValues`](../interfaces/FormValues.md) = `defaultFormValues`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:46](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L46)

***

### initialLoading

> **initialLoading**: `boolean` = `false`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:47](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L47)

***

### loadingTemplates

> **loadingTemplates**: `boolean` = `false`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:51](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L51)

***

### pending

> **pending**: `boolean` = `false`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:48](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L48)

***

### slugManuallyEdited

> **slugManuallyEdited**: `boolean` = `false`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:49](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L49)

***

### templates

> **templates**: `object`[] = `[]`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:50](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L50)

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

### deletePostType()

> **deletePostType**(`slug`, `force`): `Promise`\<`boolean`\>

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:177](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L177)

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

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:122](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L122)

Загружает данные типа контента для редактирования.

#### Parameters

##### slug

`string`

Slug типа контента.

#### Returns

`Promise`\<`void`\>

***

### loadTemplates()

> **loadTemplates**(): `Promise`\<`void`\>

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:104](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L104)

Загружает список доступных шаблонов.

#### Returns

`Promise`\<`void`\>

***

### resetForm()

> **resetForm**(): `void`

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:96](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L96)

Сбрасывает форму к значениям по умолчанию.

#### Returns

`void`

***

### savePostType()

> **savePostType**(`values`, `isEditMode`, `currentSlug?`): `Promise`\<\{ `created_at?`: `string`; `name`: `string`; `options_json`: `Record`\<`string`, `unknown`\> \| `null`; `slug`: `string`; `template?`: `string` \| `null`; `updated_at?`: `string`; \} \| `null`\>

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:141](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L141)

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

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:73](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L73)

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

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:64](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L64)

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

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:81](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L81)

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

Defined in: [src/pages/PostTypeEditorPage/PostTypeEditorStore.ts:89](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/pages/PostTypeEditorPage/PostTypeEditorStore.ts#L89)

Устанавливает флаг выполнения операции.

#### Parameters

##### value

`boolean`

Новое значение флага.

#### Returns

`void`
