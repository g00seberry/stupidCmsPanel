[**admin**](../../../README.md)

***

# Variable: zAuthUser

> `const` **zAuthUser**: `ZodObject`\<\{ `email`: `ZodEmail`; `id`: `ZodNumber`; `name`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/auth.ts:38](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/auth.ts#L38)

Схема валидации данных пользователя, возвращаемых API.

## Example

```ts
const user: ZAuthUser = {
  id: 1,
  email: 'admin@example.com',
  name: 'Администратор'
};
```
