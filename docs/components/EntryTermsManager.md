# EntryTermsManager

Компонент управления термами записи.
Отображает текущие термы записи, позволяет добавлять и удалять термы.
Показывает только термы из разрешённых таксономий для post_type.
Работает с формой через Form.Item, обновляя значение term_ids при изменении термов.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | :--: | --- | --- |
| `disabled` | `boolean \| undefined` |  | `` | Флаг отключения компонента. |
| `onChange` | `((termIds: string[]) => void) \| undefined` |  | `` | Обработчик изменения значения term_ids. |
| `store` | `EntryTermsManagerStore` | ✓ | `` | Store для управления термами записи. |
| `value` | `string[] \| undefined` |  | `` | Значение term_ids из формы. |

**Source:** `src/components/EntryTermsManager/index.ts`
