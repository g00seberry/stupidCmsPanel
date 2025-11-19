[**admin**](../../../README.md)

***

# Function: getTaxonomiesFromOptions()

> **getTaxonomiesFromOptions**(`optionsJson`): `string`[]

Defined in: [src/utils/postTypeOptions.ts:18](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/utils/postTypeOptions.ts#L18)

Получает массив разрешённых таксономий из options_json.

## Parameters

### optionsJson

Объект options_json типа контента.

\{\[`key`: `string`\]: `unknown`; `taxonomies`: `string`[]; \}

Объект options_json типа контента.

#### taxonomies

`string`[] = `...`

Массив slug'ов разрешённых таксономий. Если пуст или отсутствует, разрешены все таксономии.

| `null` | `undefined`

## Returns

`string`[]

Массив ID таксономий. Пустой массив, если таксономии не указаны или options_json некорректен.

## Example

```ts
const options = { taxonomies: [1, 2] };
const taxonomies = getTaxonomiesFromOptions(options);
console.log(taxonomies); // [1, 2]
```
