[**admin**](../../../README.md)

***

# Interface: LogoutOptions

Defined in: [src/types/auth.ts:72](https://github.com/g00seberry/stupidCmsPanel/blob/b46ec655471b9baff665cdcaf149a74d55508713/src/types/auth.ts#L72)

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

Defined in: [src/types/auth.ts:77](https://github.com/g00seberry/stupidCmsPanel/blob/b46ec655471b9baff665cdcaf149a74d55508713/src/types/auth.ts#L77)

Если `true`, завершает все активные сессии пользователя на всех устройствах.
По умолчанию `false` - завершается только текущая сессия.
