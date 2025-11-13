[**admin**](../../../README.md)

***

# Function: logout()

> **logout**(`options`): `Promise`\<`void`\>

Defined in: [src/api/apiAuth.ts:51](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/api/apiAuth.ts#L51)

Завершает текущую пользовательскую сессию.

## Parameters

### options

[`LogoutOptions`](../../../types/auth/interfaces/LogoutOptions.md) = `{}`

Параметры завершения сессии.

## Returns

`Promise`\<`void`\>

## Example

```ts
// Выйти из текущей сессии
await logout();

// Выйти из всех сессий на всех устройствах
await logout({ all: true });
```
