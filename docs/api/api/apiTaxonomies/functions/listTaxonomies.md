[**admin**](../../../README.md)

***

# Function: listTaxonomies()

> **listTaxonomies**(`params?`): `Promise`\<`object`[]\>

Defined in: [src/api/apiTaxonomies.ts:30](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/api/apiTaxonomies.ts#L30)

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
  console.log(`${taxonomy.label} (ID: ${taxonomy.id})`);
});
```
