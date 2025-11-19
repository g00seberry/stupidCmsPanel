[**admin**](../../../README.md)

***

# Function: logout()

> **logout**(`options`): `Promise`\<`void`\>

Defined in: [src/api/apiAuth.ts:51](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiAuth.ts#L51)

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
