# MediaGrid

Компонент сетки медиа-файлов.
Отображает медиа-файлы в виде сетки карточек с поддержкой выбора и действий.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | :--: | --- | --- |
| `columns` | `number \| undefined` |  | `` | Количество колонок в сетке. По умолчанию: 4. |
| `emptyText` | `string \| undefined` |  | `` | Текст для пустого состояния. По умолчанию: 'Медиа-файлы отсутствуют'. |
| `initialLoading` | `boolean \| undefined` |  | `` | Флаг начальной загрузки данных. |
| `loading` | `boolean \| undefined` |  | `` | Флаг выполнения запроса загрузки. |
| `media` | `({ id: string; name: string; ext: string; mime: string; size_bytes: number; title: string \| null; alt: string \| null; url: string; created_at: string; updated_at: string; deleted_at: string \| null; kind: "image"; width: number; height: number; preview_urls: { ...; }; } \| { ...; } \| { ...; } \| { ...; })[]` | ✓ | `` | Массив медиа-файлов для отображения. |
| `onCardClick` | `((media: { id: string; name: string; ext: string; mime: string; size_bytes: number; title: string \| null; alt: string \| null; url: string; created_at: string; updated_at: string; deleted_at: string \| null; kind: "image"; width: number; height: number; preview_urls: { ...; }; } \| { ...; } \| { ...; } \| { ...; }) => vo...` |  | `` | Обработчик клика по карточке. |
| `onDelete` | `((id: string) => void) \| undefined` |  | `` | Обработчик удаления. |
| `onRestore` | `((id: string) => void) \| undefined` |  | `` | Обработчик восстановления (для удаленных файлов). |
| `onSelectChange` | `((id: string, selected: boolean) => void) \| undefined` |  | `` | Обработчик изменения выбранности. |
| `selectable` | `boolean \| undefined` |  | `` | Флаг возможности выбора карточек. |
| `selectedIds` | `Set<string> \| undefined` |  | `` | Множество выбранных идентификаторов. |

**Source:** `C:/Users/dattebayo/Desktop/proj/stupidCmsPanel/src/components/MediaGrid/MediaGrid.tsx`
