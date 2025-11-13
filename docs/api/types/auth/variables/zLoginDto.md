[**admin**](../../../README.md)

***

# Variable: zLoginDto

> `const` **zLoginDto**: `ZodObject`\<\{ `email`: `ZodEmail`; `password`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/auth.ts:11](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/types/auth.ts#L11)

Схема валидации данных для входа пользователя.

## Example

```ts
const loginData: ZLoginDto = {
  email: 'admin@example.com',
  password: 'securePassword123'
};
```
