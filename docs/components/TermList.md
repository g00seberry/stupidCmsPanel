# TermList

Компонент отображения списка термов с возможностью группировки по таксономиям и удаления.
Отображает термы в виде тегов с возможностью группировки по таксономиям.
Для иерархических таксономий можно визуально отобразить иерархию.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | :--: | --- | --- |
| `disabled` | `boolean \| undefined` |  | `false` | Флаг отключения компонента. |
| `entryTerms` | `{ entry_id: string; terms_by_taxonomy: { taxonomy: { id: string; label: string; hierarchical: boolean; options_json: Record<string, unknown> \| null; created_at?: string \| undefined; updated_at?: string \| undefined; }; terms: { ...; }[]; }[]; }` | ✓ | `` | Данные о термах записи. |
| `onAddClick` | `((taxonomyId: string) => void) \| undefined` |  | `` | Обработчик добавления термов. Вызывается при клике на кнопку добавления для таксономии. |
| `onRemove` | `((termId: string) => void) \| undefined` |  | `` | Обработчик удаления терма. Вызывается при клике на кнопку удаления. |

**Source:** `C:/Users/dattebayo/Desktop/proj/stupidCmsPanel/src/components/EntryTermsManager/TermList.tsx`
