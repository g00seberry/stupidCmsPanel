[**admin**](../../../README.md)

***

# Variable: zAuthUser

> `const` **zAuthUser**: `ZodObject`\<\{ `email`: `ZodEmail`; `id`: `ZodNumber`; `name`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/auth.ts:38](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/auth.ts#L38)

Схема валидации данных пользователя, возвращаемых API.

## Example

```ts
const user: ZAuthUser = {
  id: 1,
  email: 'admin@example.com',
  name: 'Администратор'
};
```
