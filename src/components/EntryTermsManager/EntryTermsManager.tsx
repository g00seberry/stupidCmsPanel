import type { ZId } from '@/types/ZId';
import { Empty, Modal, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { TermList } from './TermList';
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

    const handleOpenModal = (taxonomyId: ZId) => {
      if (disabled) return;
      store.openModal(taxonomyId);
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
        </div>

        {store.entryTerms ? (
          <TermList
            entryTerms={store.entryTerms}
            onRemove={handleRemoveTerm}
            onAddClick={handleOpenModal}
            disabled={disabled || store.loading || !store.entryTerms}
          />
        ) : (
          <Empty description="Термы отсутствуют" />
        )}

        <Modal
          title="Добавить термы"
          open={store.modalVisible}
          onCancel={handleCloseModal}
          onOk={() => {
            void store.applyPendingChanges();
          }}
          okText="Ок"
          cancelText="Отмена"
          okButtonProps={{ disabled: store.loading }}
          width={800}
          destroyOnHidden
        >
          {store.selectedTaxonomy ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Выберите термы</label>
              <TermSelector
                taxonomyId={store.selectedTaxonomy}
                selectedTermIds={store.currentTermIds}
                onChange={(termId, checked) => {
                  store.updatePendingTerm(termId, checked);
                }}
                disabled={disabled || store.loading}
              />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Загрузка таксономий...</div>
          )}
        </Modal>
      </div>
    );
  }
);
