[**admin**](../../../README.md)

***

# Type Alias: ListTaxonomiesParams

> **ListTaxonomiesParams** = `object`

Defined in: [src/api/apiTaxonomies.ts:11](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiTaxonomies.ts#L11)

Параметры запроса списка таксономий.

## Properties

### per\_page?

> `optional` **per\_page**: `number`

Defined in: [src/api/apiTaxonomies.ts:17](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiTaxonomies.ts#L17)

Размер страницы (10-100). Default: 15.

***

### q?

> `optional` **q**: `string`

Defined in: [src/api/apiTaxonomies.ts:13](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiTaxonomies.ts#L13)

Поиск по label.

***

### sort?

> `optional` **sort**: `string`

Defined in: [src/api/apiTaxonomies.ts:15](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/api/apiTaxonomies.ts#L15)

Сортировка. Values: created_at.desc,created_at.asc,label.asc,label.desc. Default: created_at.desc.
