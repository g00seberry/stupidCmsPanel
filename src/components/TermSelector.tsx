import { getTermsTree, listTerms } from '@/api/apiTerms';
import { getTaxonomy } from '@/api/apiTaxonomies';
import type { ZTerm, ZTermTree } from '@/types/terms';
import { onError } from '@/utils/onError';
import { Checkbox, Empty, Input, Spin, Tree } from 'antd';
import { useEffect, useState } from 'react';
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
 * Преобразует термы в формат данных для Tree компонента Ant Design.
 */
const buildTreeData = (items: (ZTermTree | ZTerm)[], disabledIds: ZId[]): DataNode[] =>
  items.map(item => ({
    title: item.name,
    key: String(item.id),
    disabled: disabledIds.includes(item.id),
    children:
      'children' in item && item.children ? buildTreeData(item.children, disabledIds) : undefined,
  }));

/**
 * Извлекает все термы из дерева в плоский список.
 */
const extractAllTerms = (tree: ZTermTree[]): ZTerm[] => {
  const result: ZTerm[] = [];
  const traverse = (items: ZTermTree[]) => {
    for (const item of items) {
      result.push({ ...item, children: undefined } as ZTerm);
      if (item.children) traverse(item.children);
    }
  };
  traverse(tree);
  return result;
};

/**
 * Фильтрует дерево термов по поисковому запросу.
 */
const filterTree = (tree: ZTermTree[], query: string): ZTermTree[] =>
  tree
    .map(term => {
      const matches = term.name.toLowerCase().includes(query);
      const children = term.children ? filterTree(term.children, query) : [];
      return matches || children.length > 0 ? { ...term, children } : null;
    })
    .filter((term): term is ZTermTree => term !== null);

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
  const [data, setData] = useState<{ hierarchical: boolean; terms: ZTerm[]; tree: ZTermTree[] }>({
    hierarchical: false,
    terms: [],
    tree: [],
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const taxonomyData = await getTaxonomy(taxonomyId);
        if (taxonomyData.hierarchical) {
          const treeData = await getTermsTree(taxonomyId);
          setData({ hierarchical: true, terms: extractAllTerms(treeData), tree: treeData });
        } else {
          const result = await listTerms(taxonomyId, { per_page: 100 });
          setData({ hierarchical: false, terms: result.data, tree: [] });
        }
      } catch (error) {
        onError(error);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [taxonomyId]);

  const { terms, tree, hierarchical } = data;
  const disabledIds = allowedTermIds
    ? terms.filter(t => !allowedTermIds.includes(t.id)).map(t => t.id)
    : [];
  const query = searchQuery.toLowerCase();
  const filteredTerms = query ? terms.filter(t => t.name.toLowerCase().includes(query)) : terms;
  const filteredTree = query && hierarchical ? filterTree(tree, query) : tree;
  const treeData = buildTreeData(hierarchical ? filteredTree : filteredTerms, disabledIds);

  const handleTreeCheck = (
    checkedKeysValue: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }
  ) => {
    if (disabled) return;
    const keys = Array.isArray(checkedKeysValue) ? checkedKeysValue : checkedKeysValue.checked;
    onChange?.(keys.map(key => zId.parse(key)));
  };

  const handleToggleTerm = (termId: ZId) => {
    if (disabled || disabledIds.includes(termId)) return;
    const isSelected = selectedTermIds.includes(termId);
    if (isSelected) {
      onChange?.(multiple ? selectedTermIds.filter(id => id !== termId) : []);
    } else {
      onChange?.(multiple ? [...selectedTermIds, termId] : [termId]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spin />
      </div>
    );
  }

  if (terms.length === 0) {
    return <Empty description="Термы отсутствуют" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Поиск по названию..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        disabled={disabled}
        allowClear
      />

      {hierarchical ? (
        <Tree
          treeData={treeData}
          checkedKeys={selectedTermIds}
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
            <Checkbox
              key={term.id}
              checked={selectedTermIds.includes(term.id)}
              disabled={disabled || disabledIds.includes(term.id)}
              onChange={() => handleToggleTerm(term.id)}
            >
              {term.name}
            </Checkbox>
          ))}
        </div>
      )}

      {selectedTermIds.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Выбрано: {selectedTermIds.length} из {terms.length}
        </div>
      )}
    </div>
  );
};
