import type { ZMedia } from '@/types/media';
import { zPathMediaConstraints } from '@/types/path/pathConstraints';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useMemo } from 'react';
import { FormField } from '../common/FormField';
import { MediaFieldGallery } from './MediaFieldGallery';
import { MediaFieldSingle } from './MediaFieldSingle';
import { MediaFieldWidgetStore } from './MediaFieldWidget.store';
import type { MediaFieldWidgetProps } from './MediaFieldWidget.types';
import { MediaSelector } from './MediaSelector';
import { MediaSelectorStore } from './MediaSelector.store';

/**
 * Виджет для поля медиа-файла.
 * Поддерживает два режима:
 * - 'single' (mediaField): выбор одного медиа-файла
 * - 'multiple' (mediaFieldList): выбор нескольких медиа-файлов
 *
 * Отображает выбранные медиа-файлы и позволяет выбрать/заменить их через Drawer.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент для работы с медиа-файлами.
 */
export const MediaFieldWidget: React.FC<MediaFieldWidgetProps> = observer(
  ({ model, namePath, schema: _schema, componentConfig }) => {
    const pathKey = JSON.stringify(namePath);
    const selectionMode = _schema.cardinality === 'many' ? 'multiple' : 'single';

    const [constraints, store, selectorStore] = useMemo(() => {
      const constraintsData = model.getConstraints(namePath);
      const parseResult = zPathMediaConstraints.nullish().safeParse(constraintsData);
      if (!parseResult.success) return [null, null, null];

      const widgetStore = new MediaFieldWidgetStore({ model, namePath });
      const selectorStoreInstance = new MediaSelectorStore({
        constraints: parseResult.data,
        selectionMode,
      });

      return [parseResult.data, widgetStore, selectorStoreInstance];
    }, [model, pathKey, selectionMode]);

    if (!constraints || !store || !selectorStore) return null;

    const handleSelect = (ids: string[]) => {
      const allSelected = ids
        .map(selectedId => selectorStore.getMediaById(selectedId))
        .filter(Boolean) as ZMedia[];

      if (selectionMode === 'multiple') {
        store.handleSelect(allSelected);
      } else {
        store.handleSelect(allSelected[0]);
      }
    };

    return (
      <>
        <FormField model={model} namePath={namePath} componentConfig={componentConfig}>
          {selectionMode === 'single' ? (
            <MediaFieldSingle
              media={store.mediaInfo[0]}
              onRemoveMedia={id => store.removeMedia(id)}
              onOpenSelector={() => store.openSelector()}
            />
          ) : (
            <MediaFieldGallery
              mediaList={store.mediaInfo}
              onRemoveMedia={id => store.removeMedia(id)}
              onOpenSelector={() => store.openSelector()}
            />
          )}
        </FormField>

        <MediaSelector
          open={store.selectorOpen}
          onClose={() => store.closeSelector()}
          onSelect={handleSelect}
          store={selectorStore}
          preselectedIds={store.mediaInfo.map(media => media.id)}
        />
      </>
    );
  }
);
