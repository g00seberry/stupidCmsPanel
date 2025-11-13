[**admin**](../../../README.md)

***

# Function: getCurrentUser()

> **getCurrentUser**(): `Promise`\<\{ `email`: `string`; `id`: `number`; `name`: `string`; \}\>

Defined in: [src/api/apiAuth.ts:18](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/api/apiAuth.ts#L18)

Загружает данные текущего авторизованного пользователя.
Используется для проверки авторизации и получения информации о пользователе.

## Returns

`Promise`\<\{ `email`: `string`; `id`: `number`; `name`: `string`; \}\>

Информация о пользователе, прошедшая валидацию `zAuthUser`.

## Throws

Если пользователь не авторизован или токен истёк.

## Example

```ts
const user = await getCurrentUser();
console.log(user.name); // 'Администратор'
```
