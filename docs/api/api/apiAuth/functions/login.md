[**admin**](../../../README.md)

***

# Function: login()

> **login**(`params`): `Promise`\<\{ `user`: \{ `email`: `string`; `id`: `number`; `name`: `string`; \}; \}\>

Defined in: [src/api/apiAuth.ts:35](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/api/apiAuth.ts#L35)

Выполняет запрос на вход пользователя.

## Parameters

### params

Данные формы входа, предварительно валидированные.

#### email

`string` = `...`

Email пользователя. Должен быть валидным email адресом.

#### password

`string` = `...`

Пароль пользователя. Минимум 8 символов.

## Returns

`Promise`\<\{ `user`: \{ `email`: `string`; `id`: `number`; `name`: `string`; \}; \}\>

Ответ API с данными пользователя и токенами авторизации.

## Throws

Если неверные учётные данные или произошла ошибка сети.

## Example

```ts
const response = await login({
  email: 'admin@example.com',
  password: 'securePassword123'
});
console.log(response.user.name); // 'Администратор'
```
