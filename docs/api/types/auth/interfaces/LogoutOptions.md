[**admin**](../../../README.md)

***

# Interface: LogoutOptions

Defined in: [src/types/auth.ts:72](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/types/auth.ts#L72)

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

Defined in: [src/types/auth.ts:77](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/types/auth.ts#L77)

Если `true`, завершает все активные сессии пользователя на всех устройствах.
По умолчанию `false` - завершается только текущая сессия.
