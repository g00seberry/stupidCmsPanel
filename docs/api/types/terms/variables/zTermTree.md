[**admin**](../../../README.md)

***

# Variable: zTermTree

> `const` **zTermTree**: `z.ZodType`\<`any`\>

Defined in: [src/types/terms.ts:67](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/types/terms.ts#L67)

Схема валидации термина с вложенными дочерними терминами (для tree response).
Используется только в ответах эндпоинта `/tree`.

## Example

```ts
const termTree: ZTermTree = {
  id: 1,
  taxonomy: 1,
  name: 'Технологии',
  parent_id: null,
  children: [
    {
      id: 2,
      taxonomy: 1,
      name: 'Laravel',
      parent_id: 1,
      children: []
    }
  ],
  meta_json: {},
  created_at: '2025-01-10T12:00:00+00:00',
  updated_at: '2025-01-10T12:00:00+00:00'
};
```
