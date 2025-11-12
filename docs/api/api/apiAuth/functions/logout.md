[**admin**](../../../README.md)

***

# Function: logout()

> **logout**(`options`): `Promise`\<`void`\>

Defined in: [src/api/apiAuth.ts:51](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/api/apiAuth.ts#L51)

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
