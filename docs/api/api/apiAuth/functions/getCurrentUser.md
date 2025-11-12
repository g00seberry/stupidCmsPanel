[**admin**](../../../README.md)

***

# Function: getCurrentUser()

> **getCurrentUser**(): `Promise`\<\{ `email`: `string`; `id`: `number`; `name`: `string`; \}\>

Defined in: [src/api/apiAuth.ts:18](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/api/apiAuth.ts#L18)

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
