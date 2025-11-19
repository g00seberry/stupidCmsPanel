[**admin**](../../../README.md)

***

# Function: formatFileSize()

> **formatFileSize**(`bytes`): `string`

Defined in: [src/utils/fileUtils.ts:9](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/utils/fileUtils.ts#L9)

Форматирует размер файла в читаемый формат.

## Parameters

### bytes

`number`

Размер в байтах.

## Returns

`string`

Отформатированная строка размера (например, "1.5 MB").

## Example

```ts
formatFileSize(1024); // '1 KB'
formatFileSize(1048576); // '1 MB'
```
