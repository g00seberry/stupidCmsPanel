[**admin**](../../../../README.md)

***

# Class: MediaEditorStore

Defined in: [src/pages/MediaEditorPage/MediaEditorStore.ts:36](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaEditorPage/MediaEditorStore.ts#L36)

Store для управления состоянием редактора медиа-файла.
Обеспечивает загрузку, редактирование и сохранение метаданных медиа-файла.

## Constructors

### Constructor

> **new MediaEditorStore**(`mediaId`): `MediaEditorStore`

Defined in: [src/pages/MediaEditorPage/MediaEditorStore.ts:52](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaEditorPage/MediaEditorStore.ts#L52)

#### Parameters

##### mediaId

`string`

#### Returns

`MediaEditorStore`

## Properties

### formData

> **formData**: [`FormValues`](../interfaces/FormValues.md) = `defaultFormValues`

Defined in: [src/pages/MediaEditorPage/MediaEditorStore.ts:41](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaEditorPage/MediaEditorStore.ts#L41)

Значения формы редактирования.

***

### media

> **media**: \{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `height`: `number`; `id`: `string`; `kind`: `"image"`; `mime`: `string`; `name`: `string`; `preview_urls`: \{ `large`: `string`; `medium`: `string`; `thumbnail`: `string`; \}; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `width`: `number`; \} \| \{ `alt`: `string` \| `null`; `audio_codec`: `string`; `bitrate_kbps`: `number`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms`: `number`; `ext`: `string`; `frame_count`: `number`; `frame_rate`: `number`; `id`: `string`; `kind`: `"video"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `video_codec`: `string`; \} \| \{ `alt`: `string` \| `null`; `audio_codec?`: `string` \| `null`; `bitrate_kbps?`: `number` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms?`: `number` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"audio"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \} \| \{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"document"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \} \| `null` = `null`

Defined in: [src/pages/MediaEditorPage/MediaEditorStore.ts:38](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaEditorPage/MediaEditorStore.ts#L38)

Текущий медиа-файл.

#### Type Declaration

\{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `height`: `number`; `id`: `string`; `kind`: `"image"`; `mime`: `string`; `name`: `string`; `preview_urls`: \{ `large`: `string`; `medium`: `string`; `thumbnail`: `string`; \}; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `width`: `number`; \}

#### alt

> **alt**: `string` \| `null`

Альтернативный текст для изображений. Может быть `null`.

#### created\_at

> **created\_at**: `string`

Дата создания в формате ISO 8601.

#### deleted\_at

> **deleted\_at**: `string` \| `null`

Дата мягкого удаления в формате ISO 8601. Может быть `null`.

#### ext

> **ext**: `string`

Расширение файла без точки.

#### height

> **height**: `number`

Высота изображения в пикселях.

#### id

> **id**: `string` = `zMediaId`

ULID идентификатор медиа-файла.

#### kind

> **kind**: `"image"`

#### mime

> **mime**: `string`

MIME-тип файла.

#### name

> **name**: `string`

Исходное имя файла.

#### preview\_urls

> **preview\_urls**: `object` = `zMediaPreviewUrls`

URL вариантов превью изображения разных размеров.

##### preview\_urls.large

> **large**: `string`

URL большого размера изображения.

##### preview\_urls.medium

> **medium**: `string`

URL среднего размера изображения.

##### preview\_urls.thumbnail

> **thumbnail**: `string`

URL миниатюры изображения.

#### size\_bytes

> **size\_bytes**: `number`

Размер файла в байтах.

#### title

> **title**: `string` \| `null`

Название медиа-файла. Может быть `null`.

#### updated\_at

> **updated\_at**: `string`

Дата последнего обновления в формате ISO 8601.

#### url

> **url**: `string`

URL для доступа к медиа-файлу.

#### width

> **width**: `number`

Ширина изображения в пикселях.

\{ `alt`: `string` \| `null`; `audio_codec`: `string`; `bitrate_kbps`: `number`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms`: `number`; `ext`: `string`; `frame_count`: `number`; `frame_rate`: `number`; `id`: `string`; `kind`: `"video"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `video_codec`: `string`; \}

#### alt

> **alt**: `string` \| `null`

Альтернативный текст для изображений. Может быть `null`.

#### audio\_codec

> **audio\_codec**: `string`

Аудиокодек.

#### bitrate\_kbps

> **bitrate\_kbps**: `number`

Битрейт видео в килобитах в секунду.

#### created\_at

> **created\_at**: `string`

Дата создания в формате ISO 8601.

#### deleted\_at

> **deleted\_at**: `string` \| `null`

Дата мягкого удаления в формате ISO 8601. Может быть `null`.

#### duration\_ms

> **duration\_ms**: `number`

Длительность видео в миллисекундах.

#### ext

> **ext**: `string`

Расширение файла без точки.

#### frame\_count

> **frame\_count**: `number`

Общее количество кадров.

#### frame\_rate

> **frame\_rate**: `number`

Частота кадров в кадрах в секунду.

#### id

> **id**: `string` = `zMediaId`

ULID идентификатор медиа-файла.

#### kind

> **kind**: `"video"`

#### mime

> **mime**: `string`

MIME-тип файла.

#### name

> **name**: `string`

Исходное имя файла.

#### size\_bytes

> **size\_bytes**: `number`

Размер файла в байтах.

#### title

> **title**: `string` \| `null`

Название медиа-файла. Может быть `null`.

#### updated\_at

> **updated\_at**: `string`

Дата последнего обновления в формате ISO 8601.

#### url

> **url**: `string`

URL для доступа к медиа-файлу.

#### video\_codec

> **video\_codec**: `string`

Видеокодек.

\{ `alt`: `string` \| `null`; `audio_codec?`: `string` \| `null`; `bitrate_kbps?`: `number` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms?`: `number` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"audio"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \}

#### alt

> **alt**: `string` \| `null`

Альтернативный текст для изображений. Может быть `null`.

#### audio\_codec?

> `optional` **audio\_codec**: `string` \| `null`

Аудиокодек.

#### bitrate\_kbps?

> `optional` **bitrate\_kbps**: `number` \| `null`

Битрейт аудио в килобитах в секунду.

#### created\_at

> **created\_at**: `string`

Дата создания в формате ISO 8601.

#### deleted\_at

> **deleted\_at**: `string` \| `null`

Дата мягкого удаления в формате ISO 8601. Может быть `null`.

#### duration\_ms?

> `optional` **duration\_ms**: `number` \| `null`

Длительность аудио в миллисекундах.

#### ext

> **ext**: `string`

Расширение файла без точки.

#### id

> **id**: `string` = `zMediaId`

ULID идентификатор медиа-файла.

#### kind

> **kind**: `"audio"`

#### mime

> **mime**: `string`

MIME-тип файла.

#### name

> **name**: `string`

Исходное имя файла.

#### size\_bytes

> **size\_bytes**: `number`

Размер файла в байтах.

#### title

> **title**: `string` \| `null`

Название медиа-файла. Может быть `null`.

#### updated\_at

> **updated\_at**: `string`

Дата последнего обновления в формате ISO 8601.

#### url

> **url**: `string`

URL для доступа к медиа-файлу.

\{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"document"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \}

#### alt

> **alt**: `string` \| `null`

Альтернативный текст для изображений. Может быть `null`.

#### created\_at

> **created\_at**: `string`

Дата создания в формате ISO 8601.

#### deleted\_at

> **deleted\_at**: `string` \| `null`

Дата мягкого удаления в формате ISO 8601. Может быть `null`.

#### ext

> **ext**: `string`

Расширение файла без точки.

#### id

> **id**: `string` = `zMediaId`

ULID идентификатор медиа-файла.

#### kind

> **kind**: `"document"`

#### mime

> **mime**: `string`

MIME-тип файла.

#### name

> **name**: `string`

Исходное имя файла.

#### size\_bytes

> **size\_bytes**: `number`

Размер файла в байтах.

#### title

> **title**: `string` \| `null`

Название медиа-файла. Может быть `null`.

#### updated\_at

> **updated\_at**: `string`

Дата последнего обновления в формате ISO 8601.

#### url

> **url**: `string`

URL для доступа к медиа-файлу.

`null`

***

### mediaId

> **mediaId**: `string`

Defined in: [src/pages/MediaEditorPage/MediaEditorStore.ts:50](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaEditorPage/MediaEditorStore.ts#L50)

ULID идентификатор медиа-файла.

***

### pending

> **pending**: `boolean` = `false`

Defined in: [src/pages/MediaEditorPage/MediaEditorStore.ts:44](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaEditorPage/MediaEditorStore.ts#L44)

Флаг выполнения запроса загрузки.

***

### saving

> **saving**: `boolean` = `false`

Defined in: [src/pages/MediaEditorPage/MediaEditorStore.ts:47](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaEditorPage/MediaEditorStore.ts#L47)

Флаг выполнения запроса сохранения.

## Accessors

### isDeleted

#### Get Signature

> **get** **isDeleted**(): `boolean`

Defined in: [src/pages/MediaEditorPage/MediaEditorStore.ts:162](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaEditorPage/MediaEditorStore.ts#L162)

Проверяет, удален ли медиа-файл.

##### Returns

`boolean`

`true`, если медиа-файл удален (deleted_at !== null).

## Methods

### delete()

> **delete**(): `Promise`\<`boolean`\>

Defined in: [src/pages/MediaEditorPage/MediaEditorStore.ts:118](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaEditorPage/MediaEditorStore.ts#L118)

Выполняет мягкое удаление медиа-файла.

#### Returns

`Promise`\<`boolean`\>

`true`, если удаление выполнено успешно.

***

### loadMedia()

> **loadMedia**(): `Promise`\<`void`\>

Defined in: [src/pages/MediaEditorPage/MediaEditorStore.ts:61](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaEditorPage/MediaEditorStore.ts#L61)

Загружает медиа-файл по ID.

#### Returns

`Promise`\<`void`\>

***

### restore()

> **restore**(): `Promise`\<\{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `height`: `number`; `id`: `string`; `kind`: `"image"`; `mime`: `string`; `name`: `string`; `preview_urls`: \{ `large`: `string`; `medium`: `string`; `thumbnail`: `string`; \}; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `width`: `number`; \} \| \{ `alt`: `string` \| `null`; `audio_codec`: `string`; `bitrate_kbps`: `number`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms`: `number`; `ext`: `string`; `frame_count`: `number`; `frame_rate`: `number`; `id`: `string`; `kind`: `"video"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `video_codec`: `string`; \} \| \{ `alt`: `string` \| `null`; `audio_codec?`: `string` \| `null`; `bitrate_kbps?`: `number` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms?`: `number` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"audio"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \} \| \{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"document"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \} \| `null`\>

Defined in: [src/pages/MediaEditorPage/MediaEditorStore.ts:142](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaEditorPage/MediaEditorStore.ts#L142)

Восстанавливает мягко удаленный медиа-файл.

#### Returns

`Promise`\<\{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `height`: `number`; `id`: `string`; `kind`: `"image"`; `mime`: `string`; `name`: `string`; `preview_urls`: \{ `large`: `string`; `medium`: `string`; `thumbnail`: `string`; \}; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `width`: `number`; \} \| \{ `alt`: `string` \| `null`; `audio_codec`: `string`; `bitrate_kbps`: `number`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms`: `number`; `ext`: `string`; `frame_count`: `number`; `frame_rate`: `number`; `id`: `string`; `kind`: `"video"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `video_codec`: `string`; \} \| \{ `alt`: `string` \| `null`; `audio_codec?`: `string` \| `null`; `bitrate_kbps?`: `number` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms?`: `number` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"audio"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \} \| \{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"document"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \} \| `null`\>

Восстановленный медиа-файл или `null` в случае ошибки.

***

### save()

> **save**(): `Promise`\<\{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `height`: `number`; `id`: `string`; `kind`: `"image"`; `mime`: `string`; `name`: `string`; `preview_urls`: \{ `large`: `string`; `medium`: `string`; `thumbnail`: `string`; \}; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `width`: `number`; \} \| \{ `alt`: `string` \| `null`; `audio_codec`: `string`; `bitrate_kbps`: `number`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms`: `number`; `ext`: `string`; `frame_count`: `number`; `frame_rate`: `number`; `id`: `string`; `kind`: `"video"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `video_codec`: `string`; \} \| \{ `alt`: `string` \| `null`; `audio_codec?`: `string` \| `null`; `bitrate_kbps?`: `number` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms?`: `number` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"audio"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \} \| \{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"document"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \} \| `null`\>

Defined in: [src/pages/MediaEditorPage/MediaEditorStore.ts:86](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaEditorPage/MediaEditorStore.ts#L86)

Сохраняет изменения метаданных медиа-файла.

#### Returns

`Promise`\<\{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `height`: `number`; `id`: `string`; `kind`: `"image"`; `mime`: `string`; `name`: `string`; `preview_urls`: \{ `large`: `string`; `medium`: `string`; `thumbnail`: `string`; \}; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `width`: `number`; \} \| \{ `alt`: `string` \| `null`; `audio_codec`: `string`; `bitrate_kbps`: `number`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms`: `number`; `ext`: `string`; `frame_count`: `number`; `frame_rate`: `number`; `id`: `string`; `kind`: `"video"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; `video_codec`: `string`; \} \| \{ `alt`: `string` \| `null`; `audio_codec?`: `string` \| `null`; `bitrate_kbps?`: `number` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `duration_ms?`: `number` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"audio"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \} \| \{ `alt`: `string` \| `null`; `created_at`: `string`; `deleted_at`: `string` \| `null`; `ext`: `string`; `id`: `string`; `kind`: `"document"`; `mime`: `string`; `name`: `string`; `size_bytes`: `number`; `title`: `string` \| `null`; `updated_at`: `string`; `url`: `string`; \} \| `null`\>

Обновлённый медиа-файл или `null` в случае ошибки.

***

### updateFormField()

> **updateFormField**\<`K`\>(`field`, `value`): `void`

Defined in: [src/pages/MediaEditorPage/MediaEditorStore.ts:78](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/pages/MediaEditorPage/MediaEditorStore.ts#L78)

Обновляет значение поля формы.

#### Type Parameters

##### K

`K` *extends* keyof [`FormValues`](../interfaces/FormValues.md)

#### Parameters

##### field

`K`

Название поля формы.

##### value

[`FormValues`](../interfaces/FormValues.md)\[`K`\]

Новое значение поля.

#### Returns

`void`
