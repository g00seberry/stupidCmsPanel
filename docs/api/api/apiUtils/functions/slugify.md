[**admin**](../../../README.md)

***

# Function: slugify()

> **slugify**(`title`, `postType?`): `Promise`\<\{ `base`: `string`; `unique`: `string`; \}\>

Defined in: [src/api/apiUtils.ts:19](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/api/apiUtils.ts#L19)

Генерирует slug из заголовка через API.
Создаёт URL-friendly строку из текста и проверяет уникальность.

## Parameters

### title

`string`

Заголовок для преобразования в slug.

### postType?

`string`

Опциональный slug типа записи для проверки уникальности в рамках этого типа.

## Returns

`Promise`\<\{ `base`: `string`; `unique`: `string`; \}\>

Объект с базовым и уникальным slug (если базовый уже занят).

## Example

```ts
const result = await slugify('Моя первая статья');
console.log(result.base); // 'moya-pervaya-statya'
console.log(result.unique); // 'moya-pervaya-statya-1' (если базовый занят)
```
