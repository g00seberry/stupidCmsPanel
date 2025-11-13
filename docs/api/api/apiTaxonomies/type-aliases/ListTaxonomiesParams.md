[**admin**](../../../README.md)

***

# Type Alias: ListTaxonomiesParams

> **ListTaxonomiesParams** = `object`

Defined in: [src/api/apiTaxonomies.ts:10](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/api/apiTaxonomies.ts#L10)

Параметры запроса списка таксономий.

## Properties

### per\_page?

> `optional` **per\_page**: `number`

Defined in: [src/api/apiTaxonomies.ts:16](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/api/apiTaxonomies.ts#L16)

Размер страницы (10-100). Default: 15.

***

### q?

> `optional` **q**: `string`

Defined in: [src/api/apiTaxonomies.ts:12](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/api/apiTaxonomies.ts#L12)

Поиск по slug/label.

***

### sort?

> `optional` **sort**: `string`

Defined in: [src/api/apiTaxonomies.ts:14](https://github.com/g00seberry/stupidCmsPanel/blob/f5e94c5c2179e78f3e2b3125f3a7bc35ee85dadd/src/api/apiTaxonomies.ts#L14)

Сортировка. Values: created_at.desc,created_at.asc,slug.asc,slug.desc,label.asc,label.desc. Default: created_at.desc.
