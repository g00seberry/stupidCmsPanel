[**admin**](../../../README.md)

***

# Variable: zLoginDto

> `const` **zLoginDto**: `ZodObject`\<\{ `email`: `ZodEmail`; `password`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/auth.ts:11](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/types/auth.ts#L11)

Схема валидации данных для входа пользователя.

## Example

```ts
const loginData: ZLoginDto = {
  email: 'admin@example.com',
  password: 'securePassword123'
};
```
