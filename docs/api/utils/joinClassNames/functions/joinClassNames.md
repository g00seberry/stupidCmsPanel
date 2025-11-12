[**admin**](../../../README.md)

***

# Function: joinClassNames()

> **joinClassNames**(...`classes`): `string`

Defined in: [src/utils/joinClassNames.ts:7](https://github.com/g00seberry/stupidCmsPanel/blob/82f69c8df030913d9916fa044f219efab1e5b544/src/utils/joinClassNames.ts#L7)

Объединяет переданные CSS-классы в одну строку.
Отфильтровывает ложные значения, чтобы исключить неожиданные пробелы.

## Parameters

### classes

...(`string` \| `false` \| `undefined`)[]

Перечень классов и условных значений.

## Returns

`string`

Единую строку классов.
