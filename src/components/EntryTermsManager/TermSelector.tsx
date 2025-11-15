import type { ZTerm } from '@/types/terms';
import type { ZId } from '@/types/ZId';
import { Checkbox, Empty } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { TermSelectorStore } from './TermSelectorStore';

/**
 * Пропсы компонента выбора термов.
 */
export type PropsTermSelector = {
  /** ID таксономии, из которой нужно выбрать термы. */
  taxonomyId: ZId;
  /** Массив ID уже выбранных термов. */
  selectedTermIds?: ZId[];
  /** Обработчик изменения выбранных термов. */
  onChange?: (termId: ZId, checked: boolean) => void;
  /** Обработчик загрузки термов. Вызывается после загрузки всех термов. */
  onTermsLoaded?: (terms: ZTerm[]) => void;
  /** Флаг отключения компонента. */
  disabled?: boolean;
};

/**
 * Компонент выбора термов из таксономии.
 * Отображает плоский список всех термов с возможностью множественного выбора через чекбоксы.
 */
export const TermSelector: React.FC<PropsTermSelector> = observer(
  ({ taxonomyId, selectedTermIds = [], onChange, onTermsLoaded, disabled = false }) => {
    const store = useMemo(() => {
      const selectStore = new TermSelectorStore(taxonomyId);
      void selectStore.loadData();
      return selectStore;
    }, [taxonomyId]);

    const flatTerms = store.flatTerms;

    // Уведомляем о загрузке термов
    useEffect(() => {
      if (!store.loading && flatTerms.length > 0) {
        onTermsLoaded?.(flatTerms);
      }
    }, [store.loading, flatTerms, onTermsLoaded]);

    const handleCheckboxChange = (termId: ZId, checked: boolean) => {
      if (disabled) return;
      onChange?.(termId, checked);
    };

    if (flatTerms.length === 0) {
      return <Empty description="Термы отсутствуют" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
      <div className="max-h-96 overflow-y-auto">
        <Checkbox.Group
          value={selectedTermIds.map(id => String(id))}
          disabled={disabled}
          className="flex flex-col gap-2"
        >
          {flatTerms.map(term => (
            <Checkbox
              key={term.id}
              value={term.id}
              onChange={e => handleCheckboxChange(term.id, e.target.checked)}
            >
              {term.name}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>
    );
  }
);
