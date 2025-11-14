import { attachEntryTerms, detachEntryTerms, getEntryTerms } from '@/api/apiEntries';
import { listTaxonomies } from '@/api/apiTaxonomies';
import type { ZEntryTermsData } from '@/types/entries';
import type { ZTaxonomy } from '@/types/taxonomies';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import { Button, Empty, Modal, Select, Spin } from 'antd';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { TermList } from './TermList';
import { TermSelector } from './TermSelector';

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
export const EntryTermsManager: React.FC<PropsEntryTermsManager> = ({
  entryId,
  allowedTaxonomies = [],
  disabled = false,
}) => {
  const [entryTerms, setEntryTerms] = useState<ZEntryTermsData | null>(null);
  const [taxonomies, setTaxonomies] = useState<ZTaxonomy[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTaxonomies, setLoadingTaxonomies] = useState(false);
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<ZId | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTermIds, setSelectedTermIds] = useState<ZId[]>([]);

  // Загрузка доступных таксономий
  useEffect(() => {
    const loadTaxonomies = async () => {
      setLoadingTaxonomies(true);
      try {
        const data = await listTaxonomies();
        setTaxonomies(data);
        // Если есть разрешённые таксономии, устанавливаем первую как выбранную
        if (allowedTaxonomies.length > 0) {
          const firstAllowed = data.find(t => allowedTaxonomies.includes(t.id));
          if (firstAllowed) {
            setSelectedTaxonomy(firstAllowed.id);
          }
        } else if (data.length > 0) {
          // Если разрешены все таксономии, выбираем первую
          setSelectedTaxonomy(data[0].id);
        }
      } catch (error) {
        onError(error);
      } finally {
        setLoadingTaxonomies(false);
      }
    };

    void loadTaxonomies();
  }, [allowedTaxonomies]);

  // Загрузка термов записи
  useEffect(() => {
    const loadEntryTerms = async () => {
      if (!entryId) {
        return;
      }

      setLoading(true);
      try {
        const data = await getEntryTerms(entryId);
        setEntryTerms(data);
      } catch (error) {
        onError(error);
      } finally {
        setLoading(false);
      }
    };

    void loadEntryTerms();
  }, [entryId]);

  // Фильтрация доступных таксономий
  const availableTaxonomies = useMemo(() => {
    if (!allowedTaxonomies || allowedTaxonomies.length === 0) {
      // Если ничего не выбрано, не будет доступно ни одной таксономии
      return [];
    }
    // Фильтруем по разрешённым таксономиям
    return taxonomies.filter(t => allowedTaxonomies.includes(t.id));
  }, [taxonomies, allowedTaxonomies]);

  // Получение текущих термов записи из новой структуры terms_by_taxonomy
  const currentTerms = useMemo(() => {
    if (!entryTerms?.terms_by_taxonomy) {
      return [];
    }
    // Собираем все термы из всех таксономий и добавляем информацию о taxonomy к каждому терму
    return entryTerms.terms_by_taxonomy.flatMap(group =>
      group.terms.map(term => ({
        ...term,
        taxonomy: group.taxonomy.id,
      }))
    );
  }, [entryTerms]);

  // Получение уже выбранных ID термов
  const currentTermIds = useMemo(() => {
    return currentTerms.map(term => term.id);
  }, [currentTerms]);

  // Получение ID термов, которые можно выбрать (из разрешённых таксономий)
  // Это используется для фильтрации доступных термов в TermSelector
  // Если allowedTaxonomies пуст или отсутствует, разрешены все термы (undefined)
  // В противном случае, TermSelector должен фильтровать термы по таксономиям через allowedTaxonomies
  // Но поскольку TermSelector работает с одной таксономией, эта валидация происходит на уровне доступных таксономий

  /**
   * Обрабатывает открытие модального окна добавления термов.
   */
  const handleOpenModal = () => {
    if (disabled) {
      return;
    }
    setSelectedTermIds([]);
    setModalVisible(true);
  };

  /**
   * Обрабатывает закрытие модального окна.
   */
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTermIds([]);
  };

  /**
   * Обрабатывает добавление термов к записи.
   */
  const handleAddTerms = async () => {
    if (disabled || selectedTermIds.length === 0) {
      return;
    }

    try {
      setLoading(true);
      // Фильтруем только новые термы (которые ещё не привязаны)
      const newTermIds = selectedTermIds.filter(id => !currentTermIds.includes(id));
      if (newTermIds.length > 0) {
        const data = await attachEntryTerms(entryId, newTermIds);
        setEntryTerms(data);
      }
      handleCloseModal();
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Обрабатывает удаление терма из записи.
   * @param termId ID терма для удаления.
   */
  const handleRemoveTerm = async (termId: ZId) => {
    if (disabled) {
      return;
    }

    try {
      setLoading(true);
      const data = await detachEntryTerms(entryId, [termId]);
      setEntryTerms(data);
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Обрабатывает изменение выбранных термов в селекторе.
   * @param termIds Массив ID выбранных термов.
   */
  const handleTermSelectionChange = (termIds: ZId[]) => {
    setSelectedTermIds(termIds);
  };

  /**
   * Обрабатывает изменение выбранной таксономии.
   * @param taxonomyId ID выбранной таксономии.
   */
  const handleTaxonomyChange = (taxonomyId: ZId) => {
    setSelectedTaxonomy(taxonomyId);
    setSelectedTermIds([]);
  };

  if (loading && !entryTerms) {
    return (
      <div className="flex justify-center py-8">
        <Spin />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Заголовок и кнопка добавления */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Термы</h3>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenModal}
          disabled={disabled || loading || availableTaxonomies.length === 0}
          loading={loadingTaxonomies}
        >
          Добавить термы
        </Button>
      </div>

      {/* Список текущих термов */}
      {currentTerms.length === 0 ? (
        <Empty description="Термы отсутствуют" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <TermList
          terms={currentTerms}
          groupedByTaxonomy
          removable
          onRemove={handleRemoveTerm}
          disabled={disabled || loading}
        />
      )}

      {/* Модальное окно добавления термов */}
      <Modal
        title="Добавить термы"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleAddTerms}
        okText="Добавить"
        cancelText="Отмена"
        okButtonProps={{ disabled: selectedTermIds.length === 0 || loading }}
        cancelButtonProps={{ disabled: loading }}
        width={800}
        destroyOnClose
      >
        <div className="space-y-4">
          {/* Выбор таксономии */}
          {availableTaxonomies.length > 1 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Таксономия</label>
              <Select
                value={selectedTaxonomy}
                onChange={handleTaxonomyChange}
                disabled={disabled || loading}
                style={{ width: '100%' }}
                options={availableTaxonomies.map(taxonomy => ({
                  value: taxonomy.id,
                  label: taxonomy.label,
                }))}
              />
            </div>
          )}

          {/* Селектор термов */}
          {selectedTaxonomy && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Выберите термы</label>
              <TermSelector
                taxonomyId={selectedTaxonomy}
                selectedTermIds={selectedTermIds}
                onChange={handleTermSelectionChange}
                disabled={disabled || loading}
                multiple
              />
            </div>
          )}

          {/* Информация о выбранных термах */}
          {selectedTermIds.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Выбрано термов: {selectedTermIds.length}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
