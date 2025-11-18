[**admin**](../../../README.md)

***

# Function: getDefaultOptions()

> **getDefaultOptions**(): `object`

Defined in: [src/utils/postTypeOptions.ts:54](https://github.com/g00seberry/stupidCmsPanel/blob/8e4dbe9c0803dbe94ba97b07e23f85f5f8b83512/src/utils/postTypeOptions.ts#L54)

Получает значения по умолчанию для options_json.

## Returns

Объект options_json с значениями по умолчанию.

### taxonomies

> **taxonomies**: `string`[]

Массив slug'ов разрешённых таксономий. Если пуст или отсутствует, разрешены все таксономии.

## Example

```ts
const options = getDefaultOptions();
console.log(options); // { taxonomies: [] }
```
