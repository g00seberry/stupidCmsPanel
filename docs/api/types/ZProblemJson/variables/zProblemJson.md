[**admin**](../../../README.md)

***

# Variable: zProblemJson

> `const` **zProblemJson**: `ZodObject`\<\{ `code`: `ZodOptional`\<`ZodString`\>; `detail`: `ZodOptional`\<`ZodString`\>; `instance`: `ZodOptional`\<`ZodString`\>; `meta`: `ZodOptional`\<`ZodObject`\<\{ `errors`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodArray`\<`ZodString`\>\>\>; `permission`: `ZodOptional`\<`ZodString`\>; `reason`: `ZodOptional`\<`ZodString`\>; `request_id`: `ZodOptional`\<`ZodString`\>; `retry_after`: `ZodOptional`\<`ZodNumber`\>; \}, `$catchall`\<`ZodUnknown`\>\>\>; `status`: `ZodOptional`\<`ZodNumber`\>; `title`: `ZodOptional`\<`ZodString`\>; `trace_id`: `ZodOptional`\<`ZodString`\>; `type`: `ZodOptional`\<`ZodString`\>; \}, `$catchall`\<`ZodUnknown`\>\>

Defined in: [src/types/ZProblemJson.ts:46](https://github.com/g00seberry/stupidCmsPanel/blob/27012560dfe0763ffb49762123a25e0268e43694/src/types/ZProblemJson.ts#L46)

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
