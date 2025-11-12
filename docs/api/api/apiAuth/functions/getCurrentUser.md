[**admin**](../../../README.md)

***

# Function: getCurrentUser()

> **getCurrentUser**(): `Promise`\<\{ `email`: `string`; `id`: `number`; `name`: `string`; \}\>

Defined in: [src/api/apiAuth.ts:18](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/api/apiAuth.ts#L18)

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
