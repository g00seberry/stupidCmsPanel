[**admin**](../../../README.md)

***

# Interface: LogoutOptions

Defined in: [src/types/auth.ts:72](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/auth.ts#L72)

Параметры завершения пользовательской сессии.

## Example

```ts
// Выйти из текущей сессии
await logout();

// Выйти из всех сессий
await logout({ all: true });
```

## Properties

### all?

> `optional` **all**: `boolean`

Defined in: [src/types/auth.ts:77](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/auth.ts#L77)

Если `true`, завершает все активные сессии пользователя на всех устройствах.
По умолчанию `false` - завершается только текущая сессия.
