# MediaCard

Компонент карточки медиа-файла.
Отображает превью, метаданные и действия для медиа-файла.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | :--: | --- | --- |
| `media` | `{ id: string; name: string; ext: string; mime: string; size_bytes: number; title: string \| null; alt: string \| null; url: string; created_at: string; updated_at: string; deleted_at: string \| null; kind: "image"; width: number; height: number; preview_urls: { ...; }; } \| { ...; } \| { ...; } \| { ...; }` | ✓ | `` | Медиа-файл для отображения. |
| `onClick` | `((media: { id: string; name: string; ext: string; mime: string; size_bytes: number; title: string \| null; alt: string \| null; url: string; created_at: string; updated_at: string; deleted_at: string \| null; kind: "image"; width: number; height: number; preview_urls: { ...; }; } \| { ...; } \| { ...; } \| { ...; }) => vo...` |  | `` | Обработчик клика по карточке. |
| `onDelete` | `((id: string) => void) \| undefined` |  | `` | Обработчик удаления. |
| `onRestore` | `((id: string) => void) \| undefined` |  | `` | Обработчик восстановления (для удаленных файлов). |
| `onSelectChange` | `((id: string, selected: boolean) => void) \| undefined` |  | `` | Обработчик изменения выбранности. |
| `selectable` | `boolean \| undefined` |  | `false` | Флаг возможности выбора карточки. |
| `selected` | `boolean \| undefined` |  | `false` | Флаг выбранности карточки. |

**Source:** `C:/Users/dattebayo/Desktop/proj/stupidCmsPanel/src/components/MediaCard/MediaCard.tsx`
