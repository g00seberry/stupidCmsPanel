[**admin**](../../../README.md)

***

# Interface: LogoutOptions

Defined in: [src/types/auth.ts:72](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/types/auth.ts#L72)

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

Defined in: [src/types/auth.ts:77](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/types/auth.ts#L77)

Если `true`, завершает все активные сессии пользователя на всех устройствах.
По умолчанию `false` - завершается только текущая сессия.
