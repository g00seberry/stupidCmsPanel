# FilterForm

Универсальный компонент формы фильтрации.
Объединяет поля фильтрации, кнопки применения и сброса в единый интерфейс.
Управляет значениями фильтров через FilterFormStore.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | :--: | --- | --- |
| `applyText` | `string \| undefined` |  | `` | Текст кнопки применения. По умолчанию: 'Применить'. |
| `cardClassName` | `string \| undefined` |  | `` | Дополнительный класс для карточки. |
| `defaultValues` | `Record<string, unknown> \| undefined` |  | `` | Значения фильтров по умолчанию. |
| `fields` | `FilterFieldConfig[]` | ✓ | `` | Конфигурация полей фильтрации. |
| `resetText` | `string \| undefined` |  | `` | Текст кнопки сброса. По умолчанию: 'Сбросить'. |
| `showFilterIcon` | `boolean \| undefined` |  | `` | Показывать иконку фильтра на кнопке применения. По умолчанию: true. |
| `store` | `FilterFormStore` | ✓ | `` | Store для управления состоянием фильтров. |

**Source:** `src/components/FilterForm/index.ts`
