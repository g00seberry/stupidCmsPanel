import { FilterForm } from '@/components/FilterForm';
import { MediaGrid } from '@/components/MediaGrid';
import { MediaUpload } from '@/components/MediaUpload';
import { Alert, Button, Drawer, Input, Space, Spin, Tooltip } from 'antd';
import { Info, Search, Upload } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useEffect, useMemo } from 'react';
import {
  mediaFieldDrawerWidth,
  mediaFieldGridColumns,
  mediaFieldTexts,
  mediaFieldUploadDrawerWidth,
} from './MediaFieldWidget.constants';
import type { MediaSelectorProps } from './MediaFieldWidget.types';

/**
 * Компонент выбора медиа-файлов в Drawer.
 * Отображает сетку медиа-файлов с фильтрацией и возможностью выбора.
 */
export const MediaSelector: React.FC<MediaSelectorProps> = observer(
  ({ open, onClose, onSelect, store, preselectedIds = [] }) => {
    useEffect(() => {
      if (open) {
        void store.initialize(preselectedIds);
      }
    }, [open, store, preselectedIds]);

    useEffect(() => {
      if (open) {
        store.updateFilters();
      }
    }, [store.filterStore.values, open, store]);

    const handleSave = () => {
      const validIds = store.validateAndGetValidIds();
      onSelect(validIds);
      onClose();
    };

    const handleUploadSuccess = async () => {
      await store.handleUploadSuccess();
    };

    const handleAllUploadsComplete = () => {
      store.closeUpload();
    };

    const filteredMedia = store.getFilteredMedia();
    const selectedCount = store.selectedIds.size;

    const constraintsInfo = useMemo(() => {
      if (!store.constraints?.allowed_mimes || store.constraints.allowed_mimes.length === 0) {
        return null;
      }
      return store.constraints.allowed_mimes;
    }, [store.constraints]);

    return (
      <Drawer
        open={open}
        onClose={onClose}
        width={mediaFieldDrawerWidth}
        title={mediaFieldTexts.selectorDrawerTitle}
        extra={
          <Space>
            <Tooltip title="Загрузить новые файлы в библиотеку">
              <Button icon={<Upload className="w-4 h-4" />} onClick={store.openUpload}>
                {mediaFieldTexts.uploadButtonText}
              </Button>
            </Tooltip>
            <Button onClick={onClose}>{mediaFieldTexts.cancelButtonText}</Button>
            <Button
              type="primary"
              onClick={handleSave}
              disabled={selectedCount === 0}
              aria-label={`${mediaFieldTexts.selectInSelectorButtonText} (${selectedCount} выбрано)`}
            >
              {mediaFieldTexts.selectInSelectorButtonText}
              {selectedCount > 0 && <span className="ml-2 opacity-75">({selectedCount})</span>}
            </Button>
          </Space>
        }
      >
        <Spin spinning={store.configLoading || store.tableStore.loader.pending}>
          <div className="space-y-4">
            {/* Информация об ограничениях */}
            {constraintsInfo && (
              <Alert
                message="Ограничения по типам файлов"
                description={
                  <div className="mt-1">
                    <p className="text-sm mb-1">Разрешены только следующие типы файлов:</p>
                    <ul className="text-sm list-disc list-inside space-y-0.5">
                      {constraintsInfo.map((mime, idx) => (
                        <li key={idx} className="font-mono text-xs">
                          {mime}
                        </li>
                      ))}
                    </ul>
                  </div>
                }
                type="info"
                icon={<Info className="w-4 h-4" />}
                showIcon
                closable
                className="mb-2"
              />
            )}

            {/* Фильтры */}
            <div className="flex items-start gap-2">
              <FilterForm
                store={store.filterStore}
                fields={[
                  {
                    name: 'q',
                    element: (
                      <Input
                        placeholder="Поиск по названию или имени файла"
                        prefix={<Search className="w-4 h-4 text-muted-foreground" />}
                        allowClear
                        size="large"
                        autoFocus
                        aria-label="Поиск медиа-файлов"
                      />
                    ),
                    className: 'flex-1 min-w-[200px]',
                  },
                ]}
                applyText="Применить фильтры"
                resetText="Сбросить"
              />
            </div>

            {/* Сетка медиа-файлов */}
            <div className="space-y-2">
              {filteredMedia.length === 0 && !store.tableStore.loader.pending && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg font-medium mb-2">{mediaFieldTexts.emptySelectorText}</p>
                  <p className="text-sm">
                    Попробуйте изменить параметры поиска или{' '}
                    <Button
                      type="link"
                      size="small"
                      onClick={store.openUpload}
                      className="p-0 h-auto"
                    >
                      загрузить новые файлы
                    </Button>
                  </p>
                </div>
              )}
              <MediaGrid
                media={filteredMedia}
                loading={store.tableStore.loader.pending}
                initialLoading={store.tableStore.loader.initialLoading}
                selectable={true}
                selectedIds={store.selectedIds}
                onSelectChange={store.toggleSelection}
                emptyText={mediaFieldTexts.emptySelectorText}
                columns={mediaFieldGridColumns}
              />
            </div>

            {/* Пагинация */}
            {store.tableStore.loader.resp &&
              store.tableStore.loader.resp.meta.current_page <
                store.tableStore.loader.resp.meta.last_page && (
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={() =>
                      store.tableStore.loader.goToPage(
                        store.tableStore.loader.resp!.meta.current_page + 1
                      )
                    }
                    disabled={store.tableStore.loader.pending}
                    loading={store.tableStore.loader.pending}
                    aria-label={`${mediaFieldTexts.loadMoreButtonText}. Страница ${store.tableStore.loader.resp.meta.current_page + 1} из ${store.tableStore.loader.resp.meta.last_page}`}
                  >
                    {mediaFieldTexts.loadMoreButtonText}
                  </Button>
                </div>
              )}
          </div>
        </Spin>

        {/* Модальное окно загрузки файлов */}
        {store.uploadVisible && store.config && (
          <Drawer
            open={store.uploadVisible}
            onClose={store.closeUpload}
            width={mediaFieldUploadDrawerWidth}
            title={mediaFieldTexts.uploadDrawerTitle}
          >
            <MediaUpload
              config={store.config}
              onSuccess={handleUploadSuccess}
              onAllComplete={handleAllUploadsComplete}
              mode="dragger"
            />
          </Drawer>
        )}
      </Drawer>
    );
  }
);
