import type { ZEntryTermsData } from '@/types/entries';
import type { ZId } from '@/types/ZId';
import { Empty, Tag } from 'antd';
import { Plus } from 'lucide-react';

/**
 * Пропсы компонента отображения списка термов.
 */
export type PropsTermList = {
  /** Данные о термах записи. */
  entryTerms: ZEntryTermsData;
  /** Обработчик удаления терма. Вызывается при клике на кнопку удаления. */
  onRemove?: (termId: ZId) => void;
  /** Обработчик добавления термов. Вызывается при клике на кнопку добавления для таксономии. */
  onAddClick?: (taxonomyId: ZId) => void;
  /** Флаг отключения компонента. */
  disabled?: boolean;
};

/**
 * Компонент отображения списка термов с возможностью группировки по таксономиям и удаления.
 * Отображает термы в виде тегов с возможностью группировки по таксономиям.
 * Для иерархических таксономий можно визуально отобразить иерархию.
 */
export const TermList: React.FC<PropsTermList> = ({
  entryTerms,
  onRemove,
  onAddClick,
  disabled = false,
}) => {
  /**
   * Обрабатывает клик на кнопку удаления терма.
   * @param termId ID терма для удаления.
   */
  const handleRemove = (termId: ZId) => {
    if (disabled) {
      return;
    }
    onRemove?.(termId);
  };

  const terms = entryTerms.terms_by_taxonomy.flatMap(group => group.terms);

  // Если нет термов, отображаем пустое состояние
  if (terms.length === 0) {
    return <Empty description="Термы отсутствуют" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  /**
   * Обрабатывает клик на кнопку добавления термов для таксономии.
   * @param taxonomyId ID таксономии.
   */
  const handleAddClick = (taxonomyId: ZId) => {
    if (disabled) {
      return;
    }
    onAddClick?.(taxonomyId);
  };

  // Отображаем термы, сгруппированные по таксономиям
  return (
    <div className="space-y-4">
      {entryTerms.terms_by_taxonomy.map(group => (
        <div key={group.taxonomy.id} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-muted-foreground">{group.taxonomy.label}</div>
            <button
              type="button"
              onClick={() => handleAddClick(group.taxonomy.id)}
              disabled={disabled}
              className="flex items-center justify-center w-5 h-5 rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Добавить термы в таксономию ${group.taxonomy.label}`}
            >
              <Plus className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.terms.map(term => (
              <Tag
                key={term.id}
                closable
                onClose={() => handleRemove(term.id)}
                className="text-sm py-1 px-2"
              >
                {term.name}
              </Tag>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
