[**admin**](../../../README.md)

***

# Variable: zAuthUser

> `const` **zAuthUser**: `ZodObject`\<\{ `email`: `ZodEmail`; `id`: `ZodNumber`; `name`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/auth.ts:38](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/types/auth.ts#L38)

Схема валидации данных пользователя, возвращаемых API.

## Example

```ts
const user: ZAuthUser = {
  id: 1,
  email: 'admin@example.com',
  name: 'Администратор'
};
```
