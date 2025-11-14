import type { ZId } from '@/types/ZId';
import { Button, Empty, Modal, Select, Spin } from 'antd';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { TermList } from '../TermList';
import { EntryTermsManagerStore } from './EntryTermsManagerStore';
import { TermSelector } from './TermSelector';

/**
 * Пропсы компонента управления термами записи.
 */
export type PropsEntryTermsManager = {
  /** ID записи, для которой управляются термы. */
  entryId: ZId;
  /** Флаг отключения компонента. */
  disabled?: boolean;
};

/**
 * Компонент управления термами записи.
 * Отображает текущие термы записи, позволяет добавлять и удалять термы.
 * Показывает только термы из разрешённых таксономий для post_type.
 */
export const EntryTermsManager: React.FC<PropsEntryTermsManager> = observer(
  ({ entryId, disabled = false }) => {
    const store = useMemo(() => {
      const newStore = new EntryTermsManagerStore(entryId);
      void newStore.initialize();
      return newStore;
    }, [entryId]);

    const handleOpenModal = () => {
      if (disabled) return;
      store.openModal();
    };

    const handleCloseModal = () => {
      store.closeModal();
    };

    const handleRemoveTerm = (termId: ZId): void => {
      if (disabled) return;
      void store.removeTerm(termId);
    };

    if (store.loading && !store.entryTerms) {
      return (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Термы</h3>
          <Button
            type="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenModal}
            disabled={disabled || store.loading || store.availableTaxonomies.length === 0}
          >
            Добавить термы
          </Button>
        </div>

        {store.currentTerms.length === 0 ? (
          <Empty description="Термы отсутствуют" />
        ) : (
          <TermList
            terms={store.currentTerms}
            groupedByTaxonomy
            removable
            onRemove={handleRemoveTerm}
            disabled={disabled || store.loading}
          />
        )}

        <Modal
          title="Добавить термы"
          open={store.modalVisible}
          onCancel={handleCloseModal}
          onOk={handleCloseModal}
          okText="Ок"
          cancelText="Отмена"
          okButtonProps={{ disabled: store.loading }}
          width={800}
          destroyOnHidden
        >
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">Таксономия</label>
            <Select
              value={store.selectedTaxonomy}
              onChange={taxonomyId => {
                store.setSelectedTaxonomy(taxonomyId);
              }}
              disabled={disabled || store.loading}
              style={{ width: '100%' }}
              options={store.availableTaxonomies.map(t => ({ value: t.id, label: t.label }))}
            />

            {store.selectedTaxonomy ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Выберите термы</label>
                <TermSelector
                  taxonomyId={store.selectedTaxonomy}
                  selectedTermIds={store.currentTermIds}
                  onChange={(termId, checked) => {
                    if (checked) {
                      void store.addTerm(termId);
                    } else {
                      void store.removeTerm(termId);
                    }
                  }}
                  disabled={disabled || store.loading}
                />
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Загрузка таксономий...</div>
            )}
          </div>
        </Modal>
      </div>
    );
  }
);
