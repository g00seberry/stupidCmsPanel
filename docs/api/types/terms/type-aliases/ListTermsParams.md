[**admin**](../../../README.md)

***

# Type Alias: ListTermsParams

> **ListTermsParams** = `object`

Defined in: [src/types/terms.ts:114](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/terms.ts#L114)

Параметры запроса списка терминов.

## Properties

### page?

> `optional` **page**: `number`

Defined in: [src/types/terms.ts:122](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/terms.ts#L122)

Номер страницы (>=1). По умолчанию: 1.

***

### per\_page?

> `optional` **per\_page**: `number`

Defined in: [src/types/terms.ts:120](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/terms.ts#L120)

Размер страницы (10-100). Default: 15.

***

### q?

> `optional` **q**: `string`

Defined in: [src/types/terms.ts:116](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/terms.ts#L116)

Поиск по имени.

***

### sort?

> `optional` **sort**: `string`

Defined in: [src/types/terms.ts:118](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/types/terms.ts#L118)

Сортировка. Values: created_at.desc,created_at.asc,name.asc,name.desc. Default: created_at.desc.
