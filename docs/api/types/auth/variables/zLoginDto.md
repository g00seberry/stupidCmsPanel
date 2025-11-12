[**admin**](../../../README.md)

***

# Variable: zLoginDto

> `const` **zLoginDto**: `ZodObject`\<\{ `email`: `ZodEmail`; `password`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/auth.ts:11](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/types/auth.ts#L11)

Схема валидации данных для входа пользователя.

## Example

```ts
const loginData: ZLoginDto = {
  email: 'admin@example.com',
  password: 'securePassword123'
};
```
