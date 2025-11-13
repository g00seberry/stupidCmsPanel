[**admin**](../../../README.md)

***

# Function: listTaxonomies()

> **listTaxonomies**(`params?`): `Promise`\<`object`[]\>

Defined in: [src/api/apiTaxonomies.ts:29](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/api/apiTaxonomies.ts#L29)

Загружает список доступных таксономий.

## Parameters

### params?

[`ListTaxonomiesParams`](../type-aliases/ListTaxonomiesParams.md)

Параметры фильтрации и сортировки.

## Returns

`Promise`\<`object`[]\>

Массив таксономий, прошедших валидацию схемой `zTaxonomy`.

## Example

```ts
const taxonomies = await listTaxonomies();
taxonomies.forEach(taxonomy => {
  console.log(`${taxonomy.label} (${taxonomy.slug})`);
});
```
