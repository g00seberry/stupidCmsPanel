import type { ZTerm } from '@/types/terms';
import { Button, Empty, Tag, Tooltip } from 'antd';
import { X } from 'lucide-react';

/**
 * Пропсы компонента отображения списка термов.
 */
export type PropsTermList = {
  /** Массив термов для отображения. */
  terms: ZTerm[];
  /** Флаг группировки по таксономиям. Если `true`, термы группируются по полю `taxonomy`. */
  groupedByTaxonomy?: boolean;
  /** Флаг отображения кнопок удаления. Если `true`, каждый терм имеет кнопку удаления. */
  removable?: boolean;
  /** Обработчик удаления терма. Вызывается при клике на кнопку удаления. */
  onRemove?: (termId: number) => void;
  /** Флаг отключения компонента. */
  disabled?: boolean;
};

/**
 * Компонент отображения списка термов с возможностью группировки по таксономиям и удаления.
 * Отображает термы в виде тегов с возможностью группировки по таксономиям.
 * Для иерархических таксономий можно визуально отобразить иерархию.
 */
export const TermList: React.FC<PropsTermList> = ({
  terms,
  groupedByTaxonomy = false,
  removable = false,
  onRemove,
  disabled = false,
}) => {
  /**
   * Обрабатывает клик на кнопку удаления терма.
   * @param termId ID терма для удаления.
   */
  const handleRemove = (termId: number) => {
    if (disabled) {
      return;
    }
    onRemove?.(termId);
  };

  // Если нет термов, отображаем пустое состояние
  if (terms.length === 0) {
    return <Empty description="Термы отсутствуют" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  // Если группировка по таксономиям отключена, отображаем простой список
  if (!groupedByTaxonomy) {
    return (
      <div className="flex flex-wrap gap-2">
        {terms.map(term => (
          <Tag
            key={term.id}
            closable={removable && !disabled}
            onClose={() => handleRemove(term.id)}
            className="text-sm py-1 px-2"
          >
            {term.name}
          </Tag>
        ))}
      </div>
    );
  }

  // Группируем термы по таксономиям
  const termsByTaxonomy = terms.reduce(
    (acc, term) => {
      if (!acc[term.taxonomy]) {
        acc[term.taxonomy] = [];
      }
      acc[term.taxonomy].push(term);
      return acc;
    },
    {} as Record<string, ZTerm[]>
  );

  // Отображаем термы, сгруппированные по таксономиям
  return (
    <div className="space-y-4">
      {Object.entries(termsByTaxonomy).map(([taxonomy, taxonomyTerms]) => (
        <div key={taxonomy} className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">{taxonomy}</div>
          <div className="flex flex-wrap gap-2">
            {taxonomyTerms.map(term => (
              <Tag
                key={term.id}
                closable={removable && !disabled}
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

