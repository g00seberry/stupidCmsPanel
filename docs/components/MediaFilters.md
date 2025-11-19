# MediaFilters

Компонент фильтров для поиска и фильтрации медиа-файлов.
Предоставляет поля для поиска, фильтрации по типу, MIME, статусу удаления и сортировки.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | :--: | --- | --- |
| `cardClassName` | `string \| undefined` |  | `` | Дополнительный класс для карточки. |
| `onApply` | `((filters: Partial<ZMediaListParams>) => void) \| undefined` |  | `` | Обработчик применения фильтров. Вызывается при изменении значений фильтров. |
| `onReset` | `(() => void) \| undefined` |  | `` | Обработчик сброса фильтров. Вызывается при нажатии кнопки сброса. |
| `store` | `FilterFormStore` | ✓ | `` | Store для управления состоянием фильтров. |

**Source:** `C:/Users/dattebayo/Desktop/proj/stupidCmsPanel/src/components/MediaFilters/MediaFilters.tsx`
