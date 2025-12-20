import { Checkbox } from 'antd';
import { observer } from 'mobx-react-lite';
import type { MediaListStore } from '@/pages/MediaListPage/MediaListStore';

/**
 * Пропсы компонента панели массового выбора.
 */
export interface PropsBulkSelectPanel {
  /** Store для управления состоянием списка медиа-файлов. */
  store: MediaListStore;
  /** Дополнительный класс для контейнера. */
  className?: string;
}

/**
 * Компонент панели массового выбора.
 * Отображает чекбокс для выбора всех элементов на странице и счетчик выбранных элементов.
 */
export const BulkSelectPanel = observer<PropsBulkSelectPanel>(({ store, className }) => {
  const data = store.loader.resp?.data || [];
  if (data.length === 0) {
    return null;
  }

  const allSelected = data.every(item => store.selectedIds.has(item.id));
  const someSelected = data.some(item => store.selectedIds.has(item.id));

  return (
    <div className={`mb-4 flex items-center justify-between ${className || ''}`}>
      <div className="flex items-center gap-2">
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onChange={e => {
            if (e.target.checked) {
              store.selectAll();
            } else {
              store.deselectAll();
            }
          }}
        >
          Выбрать все на странице
        </Checkbox>
        {store.hasSelection && (
          <span className="text-sm text-muted-foreground">Выбрано: {store.selectedCount}</span>
        )}
      </div>
    </div>
  );
});
