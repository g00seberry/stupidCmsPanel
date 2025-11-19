# TaxonomySelector

Компонент выбора таксономий для типа контента.
Отображает список всех доступных таксономий с чекбоксами.
Если ничего не выбрано, не будет доступно ни одной таксономии.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | :--: | --- | --- |
| `disabled` | `boolean \| undefined` |  | `false` | Флаг отключения компонента. |
| `onChange` | `((selectedIds: string[]) => void) \| undefined` |  | `` | Обработчик изменения выбранных таксономий. |
| `value` | `string[] \| undefined` |  | `[]` | Массив ID выбранных таксономий. |

**Source:** `src/components/TaxonomySelector.tsx`
