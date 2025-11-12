[**admin**](../../../README.md)

***

# Function: slugify()

> **slugify**(`title`, `postType?`): `Promise`\<\{ `base`: `string`; `unique`: `string`; \}\>

Defined in: [src/api/apiUtils.ts:28](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/api/apiUtils.ts#L28)

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
