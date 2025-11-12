[**admin**](../../../README.md)

***

# Variable: zProblemJson

> `const` **zProblemJson**: `ZodObject`\<\{ `code`: `ZodOptional`\<`ZodString`\>; `detail`: `ZodOptional`\<`ZodString`\>; `instance`: `ZodOptional`\<`ZodString`\>; `meta`: `ZodOptional`\<`ZodObject`\<\{ `errors`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodArray`\<`ZodString`\>\>\>; `permission`: `ZodOptional`\<`ZodString`\>; `reason`: `ZodOptional`\<`ZodString`\>; `request_id`: `ZodOptional`\<`ZodString`\>; `retry_after`: `ZodOptional`\<`ZodNumber`\>; \}, `$catchall`\<`ZodUnknown`\>\>\>; `status`: `ZodOptional`\<`ZodNumber`\>; `title`: `ZodOptional`\<`ZodString`\>; `trace_id`: `ZodOptional`\<`ZodString`\>; `type`: `ZodOptional`\<`ZodString`\>; \}, `$catchall`\<`ZodUnknown`\>\>

Defined in: [src/types/ZProblemJson.ts:46](https://github.com/g00seberry/stupidCmsPanel/blob/f5e0a6f8d01c6850a00f37cc5f41071d99d211a6/src/types/ZProblemJson.ts#L46)

Схема валидации ответа об ошибке в формате RFC 7807 (Problem Details for HTTP APIs).
Стандартизированный формат для описания ошибок HTTP API.

## Example

```ts
const error: ZProblemJson = {
  type: 'https://example.com/errors/validation',
  title: 'Ошибка валидации',
  status: 400,
  code: 'VALIDATION_ERROR',
  detail: 'Поле email обязательно для заполнения',
  instance: '/api/v1/users',
  meta: {
    errors: {
      email: ['Поле обязательно для заполнения']
    }
  }
};
```
