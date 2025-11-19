[**admin**](../../../README.md)

***

# Function: setTaxonomiesInOptions()

> **setTaxonomiesInOptions**(`optionsJson`, `taxonomyIds`): `object`

Defined in: [src/utils/postTypeOptions.ts:36](https://github.com/g00seberry/stupidCmsPanel/blob/b3777cc02da2ea27b85692d61c5913d00466ceb6/src/utils/postTypeOptions.ts#L36)

Обновляет массив таксономий в options_json.
Создаёт новый объект options_json с обновлённым массивом таксономий, сохраняя остальные поля.
Удаляет поле taxonomies из существующего optionsJson перед добавлением нового, чтобы избежать проблем с типами.

## Parameters

### optionsJson

Текущий объект options_json или null/undefined.

\{\[`key`: `string`\]: `unknown`; `taxonomies`: `string`[]; \}

Текущий объект options_json или null/undefined.

#### taxonomies

`string`[] = `...`

Массив slug'ов разрешённых таксономий. Если пуст или отсутствует, разрешены все таксономии.

| `null` | `undefined`

### taxonomyIds

`string`[]

Массив ID таксономий для установки.

## Returns

Новый объект options_json с обновлённым массивом таксономий.

### taxonomies

> **taxonomies**: `string`[]

Массив slug'ов разрешённых таксономий. Если пуст или отсутствует, разрешены все таксономии.

## Example

```ts
const options = { otherField: 'value' };
const updated = setTaxonomiesInOptions(options, [1, 2]);
console.log(updated); // { otherField: 'value', taxonomies: [1, 2] }
```
