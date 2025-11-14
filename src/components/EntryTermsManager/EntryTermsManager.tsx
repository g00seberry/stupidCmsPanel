import type { ZId } from '@/types/ZId';
import { Button, Empty, Modal, Select, Spin } from 'antd';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { TermList } from '../TermList';
import { TermSelector } from '../TermSelector';
import { EntryTermsManagerStore } from './EntryTermsManagerStore';

/**
 * Пропсы компонента управления термами записи.
 */
export type PropsEntryTermsManager = {
  /** ID записи, для которой управляются термы. */
  entryId: ZId;
  /** Массив ID разрешённых таксономий из post_type.options_json.taxonomies. Если пуст или отсутствует, разрешены все таксономии. */
  allowedTaxonomies?: ZId[];
  /** Флаг отключения компонента. */
  disabled?: boolean;
};

/**
 * Компонент управления термами записи.
 * Отображает текущие термы записи, позволяет добавлять и удалять термы.
 * Показывает только термы из разрешённых таксономий для post_type.
 */
export const EntryTermsManager: React.FC<PropsEntryTermsManager> = observer(
  ({ entryId, allowedTaxonomies = [], disabled = false }) => {
    const store = useMemo(() => new EntryTermsManagerStore(), []);
    useEffect(() => {
      store.initialize(entryId, allowedTaxonomies);
    }, [store, entryId, allowedTaxonomies]);

    const handleOpenModal = () => {
      if (disabled) return;
      store.openModal();
    };

    const handleCloseModal = () => {
      store.closeModal();
    };

    const handleAddTerms = async () => {
      await store.addTerms(disabled);
    };

    const handleRemoveTerm = async (termId: ZId) => {
      await store.removeTerm(termId, disabled);
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
          <Empty description="Термы отсутствуют" image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
          onOk={handleAddTerms}
          okText="Добавить"
          cancelText="Отмена"
          okButtonProps={{ disabled: store.selectedTermIds.length === 0 || store.loading }}
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
                  selectedTermIds={store.selectedTermIds}
                  onChange={ids => store.setSelectedTermIds(ids)}
                  disabled={disabled || store.loading}
                  multiple
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
