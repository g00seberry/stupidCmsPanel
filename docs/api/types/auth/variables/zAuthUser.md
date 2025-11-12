[**admin**](../../../README.md)

***

# Variable: zAuthUser

> `const` **zAuthUser**: `ZodObject`\<\{ `email`: `ZodEmail`; `id`: `ZodNumber`; `name`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/auth.ts:38](https://github.com/g00seberry/stupidCmsPanel/blob/b46ec655471b9baff665cdcaf149a74d55508713/src/types/auth.ts#L38)

Схема валидации данных пользователя, возвращаемых API.

## Example

```ts
const user: ZAuthUser = {
  id: 1,
  email: 'admin@example.com',
  name: 'Администратор'
};
```
