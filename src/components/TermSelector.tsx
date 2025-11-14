import { getTermsTree, listTerms } from '@/api/apiTerms';
import { getTaxonomy } from '@/api/apiTaxonomies';
import type { ZTerm, ZTermTree } from '@/types/terms';
import type { ZTaxonomy } from '@/types/taxonomies';
import { onError } from '@/utils/onError';
import { Checkbox, Empty, Input, Spin, Tree } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import type { DataNode } from 'antd/es/tree';
import { zId, type ZId } from '@/types/ZId';

/**
 * Пропсы компонента выбора термов.
 */
export type PropsTermSelector = {
  /** ID таксономии, из которой нужно выбрать термы. */
  taxonomyId: ZId;
  /** Массив ID уже выбранных термов. */
  selectedTermIds?: ZId[];
  /** Обработчик изменения выбранных термов. */
  onChange?: (selectedTermIds: ZId[]) => void;
  /** Массив ID разрешённых термов для валидации. Если указан, можно выбрать только эти термы. */
  allowedTermIds?: ZId[];
  /** Флаг отключения компонента. */
  disabled?: boolean;
  /** Флаг множественного выбора. Если `false`, можно выбрать только один терм. */
  multiple?: boolean;
};

/**
 * Преобразует дерево термов в формат данных для Tree компонента Ant Design.
 * @param tree Массив корневых термов с вложенными дочерними терминами.
 * @param disabledIds Массив ID отключённых термов.
 * @returns Массив узлов дерева для Tree компонента.
 */
const buildTreeData = (tree: ZTermTree[], disabledIds: ZId[]): DataNode[] => {
  return tree.map(term => ({
    title: term.name,
    key: String(term.id),
    disabled: disabledIds.includes(term.id),
    children: buildTreeData(term.children || [], disabledIds),
  }));
};

/**
 * Преобразует плоский список термов в формат данных для Tree компонента Ant Design.
 * @param terms Массив термов.
 * @param disabledIds Массив ID отключённых термов.
 * @returns Массив узлов дерева для Tree компонента.
 */
const buildFlatTreeData = (terms: ZTerm[], disabledIds: ZId[]): DataNode[] => {
  return terms.map(term => ({
    title: term.name,
    key: String(term.id),
    disabled: disabledIds.includes(term.id),
  }));
};

/**
 * Компонент выбора термов из таксономии.
 * Поддерживает поиск, множественный выбор и отображение в виде дерева для иерархических таксономий.
 */
export const TermSelector: React.FC<PropsTermSelector> = ({
  taxonomyId,
  selectedTermIds = [],
  onChange,
  allowedTermIds,
  disabled = false,
  multiple = true,
}) => {
  const [taxonomy, setTaxonomy] = useState<ZTaxonomy | null>(null);
  const [terms, setTerms] = useState<ZTerm[]>([]);
  const [tree, setTree] = useState<ZTermTree[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<ZId[]>(selectedTermIds);

  // Синхронизация внутреннего состояния с пропсом selectedTermIds
  useEffect(() => {
    setSelectedIds(selectedTermIds);
  }, [selectedTermIds]);

  // Загрузка информации о таксономии
  useEffect(() => {
    const loadTaxonomy = async () => {
      try {
        const data = await getTaxonomy(taxonomyId);
        setTaxonomy(data);
      } catch (error) {
        onError(error);
      }
    };

    void loadTaxonomy();
  }, [taxonomyId]);

  // Загрузка термов таксономии
  useEffect(() => {
    const loadTerms = async () => {
      if (!taxonomyId) {
        return;
      }

      setLoading(true);
      try {
        if (taxonomy?.hierarchical) {
          // Для иерархических таксономий загружаем дерево
          const treeData = await getTermsTree(taxonomyId);
          setTree(treeData);
          // Извлекаем все термы из дерева для фильтрации
          const allTerms: ZTerm[] = [];
          const traverse = (terms: ZTermTree[]) => {
            for (const term of terms) {
              allTerms.push({
                ...term,
                children: undefined,
              } as ZTerm);
              if (term.children && term.children.length > 0) {
                traverse(term.children);
              }
            }
          };
          traverse(treeData);
          setTerms(allTerms);
        } else {
          // Для неиерархических таксономий загружаем плоский список
          const result = await listTerms(taxonomyId, { per_page: 100 });
          setTerms(result.data);
          setTree([]);
        }
      } catch (error) {
        onError(error);
      } finally {
        setLoading(false);
      }
    };

    void loadTerms();
  }, [taxonomyId, taxonomy?.hierarchical]);

  // Фильтрация термов по поисковому запросу
  const filteredTerms = useMemo(() => {
    if (!searchQuery) {
      return terms;
    }

    const query = searchQuery.toLowerCase();
    return terms.filter(term => term.name.toLowerCase().includes(query));
  }, [terms, searchQuery]);

  // Фильтрация дерева по поисковому запросу
  const filteredTree = useMemo(() => {
    if (!searchQuery || !taxonomy?.hierarchical) {
      return tree;
    }

    const query = searchQuery.toLowerCase();
    const filterTree = (terms: ZTermTree[]): ZTermTree[] => {
      return terms
        .map(term => {
          const matches = term.name.toLowerCase().includes(query);
          const filteredChildren = term.children ? filterTree(term.children) : [];

          if (matches || filteredChildren.length > 0) {
            return {
              ...term,
              children: filteredChildren,
            };
          }
          return null;
        })
        .filter((term): term is ZTermTree => term !== null);
    };

    return filterTree(tree);
  }, [tree, searchQuery, taxonomy?.hierarchical]);

  // Определение отключённых термов
  const disabledIds = useMemo(() => {
    if (!allowedTermIds) {
      return [];
    }
    return terms.filter(term => !allowedTermIds.includes(term.id)).map(term => term.id);
  }, [terms, allowedTermIds]);

  /**
   * Обрабатывает переключение выбора терма.
   * @param termId ID терма для переключения.
   */
  const handleToggleTerm = (termId: ZId) => {
    if (disabled || disabledIds.includes(termId)) {
      return;
    }

    let newSelected: ZId[];

    if (multiple) {
      // Множественный выбор
      newSelected = selectedIds.includes(termId)
        ? selectedIds.filter(id => id !== termId)
        : [...selectedIds, termId];
    } else {
      // Одиночный выбор
      newSelected = selectedIds.includes(termId) ? [] : [termId];
    }

    setSelectedIds(newSelected);
    onChange?.(newSelected);
  };

  // Построение данных для Tree компонента
  const treeData = useMemo(() => {
    if (taxonomy?.hierarchical) {
      return buildTreeData(filteredTree, disabledIds);
    }
    return buildFlatTreeData(filteredTerms, disabledIds);
  }, [taxonomy?.hierarchical, filteredTree, filteredTerms, disabledIds]);

  // Преобразование selectedIds в формат для Tree (checkedKeys)
  const checkedKeys = useMemo(() => {
    return selectedIds.map(String);
  }, [selectedIds]);

  // Обработка изменения выбранных узлов дерева
  const handleTreeCheck = (
    checkedKeysValue:
      | React.Key[]
      | {
          checked: React.Key[];
          halfChecked: React.Key[];
        }
  ) => {
    if (disabled) {
      return;
    }

    // Ant Design Tree может возвращать объект с checked и halfChecked, или просто массив
    const checkedKeys = Array.isArray(checkedKeysValue)
      ? checkedKeysValue
      : checkedKeysValue.checked;

    const checkedIds = checkedKeys.map(key => zId.parse(key));
    setSelectedIds(checkedIds);
    onChange?.(checkedIds);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spin />
      </div>
    );
  }

  if (terms.length === 0 && tree.length === 0) {
    return <Empty description="Термы отсутствуют" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <div className="space-y-4">
      {/* Поиск */}
      <Input
        placeholder="Поиск по названию..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        disabled={disabled}
        allowClear
      />

      {/* Дерево или список термов */}
      {taxonomy?.hierarchical ? (
        <Tree
          treeData={treeData}
          checkedKeys={checkedKeys}
          onCheck={handleTreeCheck}
          checkable
          blockNode
          defaultExpandAll={!searchQuery}
          disabled={disabled}
          className="max-h-96 overflow-y-auto"
        />
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTerms.map(term => (
            <div key={term.id} className="flex items-center">
              <Checkbox
                checked={selectedIds.includes(term.id)}
                disabled={disabled || disabledIds.includes(term.id)}
                onChange={() => handleToggleTerm(term.id)}
              >
                {term.name}
              </Checkbox>
            </div>
          ))}
        </div>
      )}

      {/* Информация о выбранных термах */}
      {selectedIds.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Выбрано: {selectedIds.length} из {terms.length}
        </div>
      )}
    </div>
  );
};
