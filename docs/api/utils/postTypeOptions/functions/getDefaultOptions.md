[**admin**](../../../README.md)

***

# Function: getDefaultOptions()

> **getDefaultOptions**(): `object`

Defined in: [src/utils/postTypeOptions.ts:54](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/utils/postTypeOptions.ts#L54)

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
