import { listTaxonomies } from '@/api/apiTaxonomies';
import type { ZTaxonomy } from '@/types/taxonomies';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import { Checkbox, Empty, Spin, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';

/**
 * Пропсы компонента выбора таксономий.
 */
export type PropsTaxonomySelector = {
  /** Массив slug'ов выбранных таксономий. */
  value?: ZId[];
  /** Обработчик изменения выбранных таксономий. */
  onChange?: (selectedSlugs: ZId[]) => void;
  /** Флаг отключения компонента. */
  disabled?: boolean;
};

/**
 * Компонент выбора таксономий для типа контента.
 * Отображает список всех доступных таксономий с чекбоксами.
 * Если ничего не выбрано, не будет доступно ни одной таксономии.
 */
export const TaxonomySelector: React.FC<PropsTaxonomySelector> = ({
  value = [],
  onChange,
  disabled = false,
}) => {
  const [taxonomies, setTaxonomies] = useState<ZTaxonomy[]>([]);
  const [loading, setLoading] = useState(false);

  // Загрузка списка таксономий
  useEffect(() => {
    const loadTaxonomies = async () => {
      setLoading(true);
      try {
        const data = await listTaxonomies();
        setTaxonomies(data);
      } catch (error) {
        onError(error);
      } finally {
        setLoading(false);
      }
    };

    void loadTaxonomies();
  }, []);

  /**
   * Обрабатывает переключение выбора таксономии.
   * @param taxonomySlug Slug таксономии для переключения.
   */
  const handleToggle = (taxonomyId: ZId) => {
    if (disabled) {
      return;
    }

    const newSelected = value.includes(taxonomyId)
      ? value.filter(id => id !== taxonomyId)
      : [...value, taxonomyId];

    onChange?.(newSelected);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spin />
      </div>
    );
  }

  if (taxonomies.length === 0) {
    return <Empty description="Таксономии отсутствуют" />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Разрешённые таксономии</label>
          <Tooltip title="Если ничего не выбрано, не будет доступно ни одной таксономии">
            <span className="text-xs text-muted-foreground cursor-help">?</span>
          </Tooltip>
        </div>
        <p className="text-xs text-muted-foreground">
          Выберите таксономии, которые можно использовать с этим типом поста.
        </p>
      </div>

      {/* Список таксономий */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {taxonomies.map(taxonomy => (
          <div key={taxonomy.id} className="flex items-center justify-between">
            <Checkbox
              checked={value.includes(taxonomy.id)}
              onChange={() => handleToggle(taxonomy.id)}
              disabled={disabled}
            >
              <div className="flex items-center gap-2">
                <span>{taxonomy.label}</span>
                <code className="text-xs text-muted-foreground">{taxonomy.id}</code>
                {taxonomy.hierarchical && (
                  <Tag color="blue" className="text-xs">
                    Иерархическая
                  </Tag>
                )}
              </div>
            </Checkbox>
          </div>
        ))}
      </div>
    </div>
  );
};
