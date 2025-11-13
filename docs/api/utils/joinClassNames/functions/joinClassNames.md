[**admin**](../../../README.md)

***

# Function: joinClassNames()

> **joinClassNames**(...`classes`): `string`

Defined in: [src/utils/joinClassNames.ts:7](https://github.com/g00seberry/stupidCmsPanel/blob/fe7f757c8d344112764acce75b3b19ea24059bb9/src/utils/joinClassNames.ts#L7)

Объединяет переданные CSS-классы в одну строку.
Отфильтровывает ложные значения, чтобы исключить неожиданные пробелы.

## Parameters

### classes

...(`string` \| `false` \| `undefined`)[]

Перечень классов и условных значений.

## Returns

`string`

Единую строку классов.
