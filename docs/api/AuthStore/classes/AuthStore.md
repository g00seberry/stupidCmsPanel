[**admin**](../../README.md)

***

# Class: AuthStore

Defined in: [src/AuthStore.ts:9](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/AuthStore.ts#L9)

Состояние авторизации администратора и операции входа/выхода.

## Constructors

### Constructor

> **new AuthStore**(): `AuthStore`

Defined in: [src/AuthStore.ts:17](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/AuthStore.ts#L17)

Создаёт экземпляр MobX-стора авторизации.

#### Returns

`AuthStore`

## Properties

### pending

> **pending**: `boolean` = `false`

Defined in: [src/AuthStore.ts:11](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/AuthStore.ts#L11)

***

### relogin

> **relogin**: `boolean` = `false`

Defined in: [src/AuthStore.ts:10](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/AuthStore.ts#L10)

***

### user

> **user**: \{ `email`: `string`; `id`: `number`; `name`: `string`; \} \| `null` = `null`

Defined in: [src/AuthStore.ts:12](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/AuthStore.ts#L12)

#### Type Declaration

\{ `email`: `string`; `id`: `number`; `name`: `string`; \}

#### email

> **email**: `string`

Email адрес пользователя.

#### id

> **id**: `number`

Уникальный идентификатор пользователя.

#### name

> **name**: `string`

Отображаемое имя пользователя.

`null`

## Accessors

### isAuthenticated

#### Get Signature

> **get** **isAuthenticated**(): `boolean`

Defined in: [src/AuthStore.ts:48](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/AuthStore.ts#L48)

Признак активной авторизации пользователя.

##### Returns

`boolean`

## Methods

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [src/AuthStore.ts:55](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/AuthStore.ts#L55)

Инициализирует состояние авторизации.

#### Returns

`Promise`\<`void`\>

***

### login()

> **login**(`dto`): `Promise`\<`boolean`\>

Defined in: [src/AuthStore.ts:76](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/AuthStore.ts#L76)

Выполняет попытку входа и обновляет состояние в зависимости от результата.

#### Parameters

##### dto

Данные формы входа.

###### email

`string` = `...`

Email пользователя. Должен быть валидным email адресом.

###### password

`string` = `...`

Пароль пользователя. Минимум 8 символов.

#### Returns

`Promise`\<`boolean`\>

`true`, если вход выполнен успешно.

***

### logout()

> **logout**(`options`): `Promise`\<`void`\>

Defined in: [src/AuthStore.ts:94](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/AuthStore.ts#L94)

Выполняет выход текущего пользователя.

#### Parameters

##### options

[`LogoutOptions`](../../types/auth/interfaces/LogoutOptions.md) = `{}`

Дополнительные параметры завершения сессий.

#### Returns

`Promise`\<`void`\>

***

### setPending()

> **setPending**(`value`): `void`

Defined in: [src/AuthStore.ts:25](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/AuthStore.ts#L25)

Устанавливает флаг выполнения запроса авторизации.

#### Parameters

##### value

`boolean`

Новое значение флага ожидания.

#### Returns

`void`

***

### setRelogin()

> **setRelogin**(`value`): `void`

Defined in: [src/AuthStore.ts:33](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/AuthStore.ts#L33)

Устанавливает флаг выполнения запроса релогина.

#### Parameters

##### value

`boolean`

Новое значение флага.

#### Returns

`void`

***

### setUser()

> **setUser**(`user`): `void`

Defined in: [src/AuthStore.ts:41](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/AuthStore.ts#L41)

Сохраняет информацию о текущем пользователе.

#### Parameters

##### user

Данные пользователя или `null` для сброса.

\{ `email`: `string`; `id`: `number`; `name`: `string`; \}

Данные пользователя или `null` для сброса.

###### email

`string` = `...`

Email адрес пользователя.

###### id

`number` = `...`

Уникальный идентификатор пользователя.

###### name

`string` = `...`

Отображаемое имя пользователя.

| `null`

#### Returns

`void`
