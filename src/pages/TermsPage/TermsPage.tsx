import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { App, Button, Card, Empty, Spin, Tag, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { deleteTerm } from '@/api/apiTerms';
import { onError } from '@/utils/onError';
import { buildUrl, PageUrl } from '@/PageUrl';
import axios from 'axios';
import { notificationService } from '@/services/notificationService';
import { TermsListStore } from './TermsListStore';
import type { ZTermTree } from '@/types/terms';

/**
 * Преобразует дерево терминов в формат для Tree компонента.
 * @param tree Дерево терминов.
 * @param taxonomySlug Slug таксономии для ссылок редактирования.
 * @param onDelete Обработчик удаления термина.
 * @returns Массив узлов для Tree компонента.
 */
const convertTermsTreeToTreeData = (
  tree: ZTermTree[],
  taxonomySlug: string,
  onDelete: (term: ZTermTree) => void
): DataNode[] => {
  const convertNode = (node: ZTermTree): DataNode => {
    const children = node.children?.map(convertNode) ?? [];

    return {
      key: node.id,
      title: (
        <div className="flex items-center justify-between gap-4 group">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="font-medium text-foreground">{node.name}</span>
            <code className="text-xs text-muted-foreground truncate">{node.slug}</code>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link to={buildUrl(PageUrl.TermEdit, { taxonomy: taxonomySlug, id: String(node.id) })}>
              <Button type="text" size="small" icon={<Edit className="w-3 h-3" />} />
            </Link>
            <Button
              type="text"
              danger
              size="small"
              icon={<Trash2 className="w-3 h-3" />}
              onClick={e => {
                e.stopPropagation();
                onDelete(node);
              }}
            />
          </div>
        </div>
      ),
      ...(children.length > 0 ? { children } : {}),
    };
  };

  return tree.map(convertNode);
};

/**
 * Страница со списком терминов таксономии CMS.
 * Отображает термины в виде иерархического дерева.
 */
export const TermsPage = observer(() => {
  const { taxonomy: taxonomySlug } = useParams<{ taxonomy: string }>();
  const store = useMemo(() => new TermsListStore(), []);
  const { modal } = App.useApp();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  // Инициализация загрузки данных
  useEffect(() => {
    if (taxonomySlug) {
      void store.initialize(taxonomySlug);
    }
  }, [taxonomySlug, store]);

  /**
   * Обрабатывает удаление термина с подтверждением и обработкой ошибок.
   * @param term Термин для удаления.
   */
  const handleDelete = useCallback(
    async (term: ZTermTree): Promise<void> => {
      modal.confirm({
        title: 'Удалить термин?',
        content: `Вы уверены, что хотите удалить термин "${term.name}"? Это действие нельзя отменить.`,
        okText: 'Удалить',
        okType: 'danger',
        cancelText: 'Отмена',
        onOk: async () => {
          try {
            await deleteTerm(term.id, false);
            notificationService.showSuccess({ message: 'Термин удалён' });
            if (taxonomySlug) {
              void store.initialize(taxonomySlug);
            }
          } catch (error) {
            // Обработка ошибки 409 (CONFLICT) - термин привязан к записям
            if (axios.isAxiosError(error) && error.response?.status === 409) {
              modal.confirm({
                title: 'Невозможно удалить термин',
                content:
                  'Термин привязан к записям. Вы можете удалить термин с автоматической отвязкой от всех записей.',
                okText: 'Удалить и отвязать',
                okType: 'danger',
                cancelText: 'Отмена',
                onOk: async () => {
                  try {
                    await deleteTerm(term.id, true);
                    notificationService.showSuccess({
                      message: 'Термин удалён и отвязан от записей',
                    });
                    if (taxonomySlug) {
                      void store.initialize(taxonomySlug);
                    }
                  } catch (forceError) {
                    onError(forceError);
                  }
                },
              });
            } else {
              onError(error);
            }
          }
        },
      });
    },
    [modal, taxonomySlug, store]
  );

  /**
   * Преобразует дерево терминов в формат для Tree компонента.
   */
  const treeData = useMemo(() => {
    if (!taxonomySlug || !store.termsTree.length) {
      return [];
    }
    return convertTermsTreeToTreeData(store.termsTree, taxonomySlug, handleDelete);
  }, [store.termsTree, taxonomySlug, handleDelete]);

  /**
   * Обрабатывает раскрытие/сворачивание узлов дерева.
   */
  const handleExpand = useCallback((keys: React.Key[]) => {
    setExpandedKeys(keys);
  }, []);

  if (!taxonomySlug) {
    return (
      <div className="min-h-screen bg-background w-full flex items-center justify-center">
        <Empty description="Таксономия не указана" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Breadcrumbs and action buttons */}
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                to={PageUrl.Taxonomies}
                className="hover:text-foreground cursor-pointer transition-colors"
              >
                Таксономии
              </Link>
              <span>/</span>
              {store.loading ? (
                <Spin size="small" />
              ) : (
                <span className="text-foreground">{store.taxonomy?.label || taxonomySlug}</span>
              )}
              <span>/</span>
              <span className="text-foreground">Термины</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to={PageUrl.Taxonomies}>
                <Button icon={<ArrowLeft className="w-4 h-4" />}>Назад</Button>
              </Link>
              {taxonomySlug && (
                <Link to={buildUrl(PageUrl.TermEdit, { taxonomy: taxonomySlug, id: 'new' })}>
                  <Button type="primary" icon={<Plus className="w-4 h-4" />}>
                    Создать термин
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 w-full">
        {/* Информация о таксономии */}
        {store.taxonomy && (
          <div className="mb-6">
            <Card>
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{store.taxonomy.label}</h2>
                  <code className="text-sm text-muted-foreground">{store.taxonomy.slug}</code>
                </div>
                {store.taxonomy.hierarchical && <Tag color="blue">Иерархическая</Tag>}
              </div>
            </Card>
          </div>
        )}

        {/* Иерархия терминов */}
        <Card>
          {store.loading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : treeData.length === 0 ? (
            <Empty description="Термины отсутствуют" />
          ) : (
            <Tree
              treeData={treeData}
              defaultExpandAll
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              onExpand={handleExpand}
              onSelect={setSelectedKeys}
              blockNode
            />
          )}
        </Card>
      </div>
    </div>
  );
});
