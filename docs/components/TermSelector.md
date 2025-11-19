# TermSelector

Компонент выбора термов из таксономии.
Отображает плоский список всех термов с возможностью множественного выбора через чекбоксы.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | :--: | --- | --- |
| `disabled` | `boolean \| undefined` |  | `` | Флаг отключения компонента. |
| `onChange` | `((termId: string, checked: boolean) => void) \| undefined` |  | `` | Обработчик изменения выбранных термов. |
| `onTermsLoaded` | `((terms: { id: string; taxonomy: string; name: string; meta_json: unknown; parent_id?: string \| null \| undefined; created_at?: string \| undefined; updated_at?: string \| undefined; deleted_at?: string \| null \| undefined; }[]) => void) \| undefined` |  | `` | Обработчик загрузки термов. Вызывается после загрузки всех термов. |
| `selectedTermIds` | `string[] \| undefined` |  | `` | Массив ID уже выбранных термов. |
| `taxonomyId` | `string` | ✓ | `` | ID таксономии, из которой нужно выбрать термы. |

**Source:** `C:/Users/dattebayo/Desktop/proj/stupidCmsPanel/src/components/EntryTermsManager/TermSelector.tsx`
