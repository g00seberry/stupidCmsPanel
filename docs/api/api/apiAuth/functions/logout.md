[**admin**](../../../README.md)

***

# Function: logout()

> **logout**(`options`): `Promise`\<`void`\>

Defined in: [src/api/apiAuth.ts:51](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/api/apiAuth.ts#L51)

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
