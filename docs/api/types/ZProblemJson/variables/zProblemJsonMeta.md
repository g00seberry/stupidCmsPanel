[**admin**](../../../README.md)

***

# Variable: zProblemJsonMeta

> `const` **zProblemJsonMeta**: `ZodObject`\<\{ `errors`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodArray`\<`ZodString`\>\>\>; `permission`: `ZodOptional`\<`ZodString`\>; `reason`: `ZodOptional`\<`ZodString`\>; `request_id`: `ZodOptional`\<`ZodString`\>; `retry_after`: `ZodOptional`\<`ZodNumber`\>; \}, `$catchall`\<`ZodUnknown`\>\>

Defined in: [src/types/ZProblemJson.ts:7](https://github.com/g00seberry/stupidCmsPanel/blob/b46ec655471b9baff665cdcaf149a74d55508713/src/types/ZProblemJson.ts#L7)

Схема валидации мета-данных ошибки API.
Содержит дополнительную информацию об ошибке, специфичную для конкретного API.
