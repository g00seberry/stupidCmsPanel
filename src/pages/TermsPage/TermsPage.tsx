import { deleteTerm, updateTerm } from '@/api/apiTerms';
import { buildUrl, PageUrl } from '@/PageUrl';
import { notificationService } from '@/services/notificationService';
import type { ZTermTree } from '@/types/terms';
import { onError } from '@/utils/onError';
import { App, Button, Card, Empty, Spin, Tag, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import axios from 'axios';
import { ArrowLeftOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TermsListStore } from './TermsListStore';
import { PageLayout } from '@/components/PageLayout';
import type { ZId } from '@/types/ZId';

/**
 * Находит термин в дереве по ID.
 * @param tree Дерево терминов.
 * @param termId ID термина для поиска (строка или число).
 * @returns Найденный термин или null.
 */
const findTermInTree = (tree: ZTermTree[], termId: string | number): ZTermTree | null => {
  const termIdStr = String(termId);
  for (const node of tree) {
    if (String(node.id) === termIdStr) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findTermInTree(node.children, termIdStr);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

/**
 * Преобразует дерево терминов в формат для Tree компонента.
 * @param tree Дерево терминов.
 * @param taxonomyId ID таксономии для ссылок редактирования.
 * @param onDelete Обработчик удаления термина.
 * @returns Массив узлов для Tree компонента.
 */
const convertTermsTreeToTreeData = (
  tree: ZTermTree[],
  taxonomyId: ZId,
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
            <code className="text-xs text-muted-foreground truncate">ID: {node.id}</code>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              to={buildUrl(PageUrl.TermEdit, {
                taxonomyId,
                id: String(node.id),
              })}
            >
              <Button type="text" size="small" icon={<EditOutlined />} />
            </Link>
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
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
  const { taxonomyId } = useParams<{ taxonomyId: ZId }>();
  const store = useMemo(() => new TermsListStore(), []);
  const { modal } = App.useApp();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  // Инициализация загрузки данных
  useEffect(() => {
    if (taxonomyId) {
      void store.initialize(taxonomyId);
    }
  }, [taxonomyId, store]);

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
            if (taxonomyId) {
              void store.initialize(taxonomyId);
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
                    if (taxonomyId) {
                      void store.initialize(taxonomyId);
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
    [modal, taxonomyId, store]
  );

  /**
   * Преобразует дерево терминов в формат для Tree компонента.
   */
  const treeData = useMemo(() => {
    if (!taxonomyId || !store.termsTree.length) {
      return [];
    }
    return convertTermsTreeToTreeData(store.termsTree, taxonomyId, handleDelete);
  }, [store.termsTree, taxonomyId, handleDelete]);

  /**
   * Обрабатывает перетаскивание узла дерева и обновляет parent_id термина.
   * @param info Информация о событии drop.
   */
  const handleDrop = useCallback(
    async (info: {
      dragNode: { key: React.Key };
      node: { key: React.Key };
      dropToGap: boolean;
    }): Promise<void> => {
      const { dragNode, node, dropToGap } = info;
      const draggedTermId = String(dragNode.key);
      const targetNodeKey = String(node.key);

      // Находим перетаскиваемый термин в исходном дереве
      const draggedTerm = findTermInTree(store.termsTree, draggedTermId);
      if (!draggedTerm) {
        onError(new Error('Термин не найден'));
        return;
      }

      // Определяем новый parent_id
      let newParentId: string | null = null;

      if (dropToGap) {
        // Перетаскивание в промежуток между узлами - остаёмся на том же уровне, что и целевой узел
        const targetTerm = findTermInTree(store.termsTree, targetNodeKey);
        newParentId = targetTerm?.parent_id ?? null;
      } else {
        // Перетаскивание внутрь узла - родитель = этот узел
        newParentId = targetNodeKey;
      }

      // Проверяем, изменился ли parent_id
      if (draggedTerm.parent_id === newParentId) {
        return;
      }

      // Предотвращаем перемещение узла в самого себя или в свой дочерний узел
      if (newParentId !== null) {
        const checkIsDescendant = (parentId: string, childId: string): boolean => {
          const parent = findTermInTree(store.termsTree, parentId);
          if (!parent || !parent.children) {
            return false;
          }
          for (const child of parent.children) {
            if (String(child.id) === childId) {
              return true;
            }
            if (checkIsDescendant(String(child.id), childId)) {
              return true;
            }
          }
          return false;
        };

        if (draggedTermId === newParentId || checkIsDescendant(draggedTermId, newParentId)) {
          notificationService.showError({
            message: 'Невозможно переместить термин',
            description: 'Нельзя переместить термин в самого себя или в свой дочерний узел.',
          });
          return;
        }
      }

      try {
        // Обновляем термин с новым parent_id
        await updateTerm(draggedTermId, { ...draggedTerm, parent_id: newParentId });

        notificationService.showSuccess({
          message: 'Иерархия обновлена',
          description: `Термин "${draggedTerm.name}" перемещён.`,
        });

        // Перезагружаем дерево
        if (taxonomyId) {
          void store.initialize(taxonomyId);
        }
      } catch (error) {
        onError(error);
      }
    },
    [store, taxonomyId]
  );

  if (!taxonomyId) {
    return (
      <div className="bg-background w-full flex items-center justify-center">
        <Empty description="Таксономия не указана" />
      </div>
    );
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Таксономии', to: PageUrl.Taxonomies },
        store.loading ? 'Загрузка...' : store.taxonomy?.label || taxonomyId,
        'Термины',
      ]}
      extra={
        <>
          <Link to={PageUrl.Taxonomies}>
            <Button icon={<ArrowLeftOutlined />}>Назад</Button>
          </Link>
          <Link to={buildUrl(PageUrl.TermEdit, { taxonomyId, id: 'new' })}>
            <Button type="primary" icon={<PlusOutlined />}>
              Создать термин
            </Button>
          </Link>
        </>
      }
    >
      {/* Информация о таксономии */}
      {store.taxonomy && (
        <div className="mb-6">
          <Card>
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{store.taxonomy.label}</h2>
                <code className="text-sm text-muted-foreground">ID: {store.taxonomy.id}</code>
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
            selectedKeys={selectedKeys}
            onSelect={setSelectedKeys}
            onDrop={handleDrop}
            draggable={store.taxonomy?.hierarchical}
            blockNode
          />
        )}
      </Card>
    </PageLayout>
  );
});
