[**admin**](../../../README.md)

***

# Variable: zProblemJsonMeta

> `const` **zProblemJsonMeta**: `ZodObject`\<\{ `errors`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodArray`\<`ZodString`\>\>\>; `permission`: `ZodOptional`\<`ZodString`\>; `reason`: `ZodOptional`\<`ZodString`\>; `request_id`: `ZodOptional`\<`ZodString`\>; `retry_after`: `ZodOptional`\<`ZodNumber`\>; \}, `$catchall`\<`ZodUnknown`\>\>

Defined in: [src/types/ZProblemJson.ts:7](https://github.com/g00seberry/stupidCmsPanel/blob/86606cbb986e1e8c23e9b705175f96ad44d12bd4/src/types/ZProblemJson.ts#L7)

Схема валидации мета-данных ошибки API.
Содержит дополнительную информацию об ошибке, специфичную для конкретного API.
