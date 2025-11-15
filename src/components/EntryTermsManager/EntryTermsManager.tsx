import type { ZId } from '@/types/ZId';
import { Empty, Modal, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { TermList } from './TermList';
import { EntryTermsManagerStore } from './EntryTermsManagerStore';
import { TermSelector } from './TermSelector';

/**
 * Пропсы компонента управления термами записи.
 */
export type PropsEntryTermsManager = {
  /** Store для управления термами записи. */
  store: EntryTermsManagerStore;
  /** Флаг отключения компонента. */
  disabled?: boolean;
  /** Значение term_ids из формы. */
  value?: ZId[];
  /** Обработчик изменения значения term_ids. */
  onChange?: (termIds: ZId[]) => void;
};

/**
 * Компонент управления термами записи.
 * Отображает текущие термы записи, позволяет добавлять и удалять термы.
 * Показывает только термы из разрешённых таксономий для post_type.
 * Работает с формой через Form.Item, обновляя значение term_ids при изменении термов.
 */
export const EntryTermsManager: React.FC<PropsEntryTermsManager> = observer(
  ({ store, disabled = false, value = [], onChange }) => {
    // Синхронизируем значение формы с стором при изменении value
    // entryTerms используется только для получения структуры таксономий,
    // а для отображения термов используется value из формы
    useEffect(() => {
      // При изменении value обновляем pendingTermIds если модальное окно открыто
      if (store.modalVisible) {
        store.pendingTermIds = new Set(value);
      }
    }, [value, store]);

    const handleOpenModal = (taxonomyId: ZId) => {
      if (disabled) return;
      store.openModal(taxonomyId, value);
    };

    const handleCloseModal = () => {
      store.closeModal();
    };

    const handleRemoveTerm = (termId: ZId): void => {
      if (disabled) return;
      const newTermIds = value.filter(id => id !== termId);
      onChange?.(newTermIds);
    };

    if (store.loading && !store.entryTerms) {
      return (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      );
    }

    // Фильтруем entryTerms по value из формы для отображения только выбранных термов
    const filteredEntryTerms = store.entryTerms
      ? {
          ...store.entryTerms,
          terms_by_taxonomy: store.entryTerms.terms_by_taxonomy.map(group => ({
            ...group,
            terms: group.terms.filter(term => value.includes(term.id)),
          })),
        }
      : null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Термы</h3>
        </div>

        {filteredEntryTerms ? (
          <TermList
            entryTerms={filteredEntryTerms}
            onRemove={handleRemoveTerm}
            onAddClick={handleOpenModal}
            disabled={disabled || store.loading || !filteredEntryTerms}
          />
        ) : (
          <Empty description="Термы отсутствуют" />
        )}

        <Modal
          title="Добавить термы"
          open={store.modalVisible}
          onCancel={handleCloseModal}
          onOk={() => {
            const newTermIds = Array.from(store.pendingTermIds);
            onChange?.(newTermIds);
            store.closeModal();
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
