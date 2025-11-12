[**admin**](../../../README.md)

***

# Variable: zLoginDto

> `const` **zLoginDto**: `ZodObject`\<\{ `email`: `ZodEmail`; `password`: `ZodString`; \}, `$strip`\>

Defined in: [src/types/auth.ts:11](https://github.com/g00seberry/stupidCmsPanel/blob/b46ec655471b9baff665cdcaf149a74d55508713/src/types/auth.ts#L11)

Схема валидации данных для входа пользователя.

## Example

```ts
const loginData: ZLoginDto = {
  email: 'admin@example.com',
  password: 'securePassword123'
};
```
