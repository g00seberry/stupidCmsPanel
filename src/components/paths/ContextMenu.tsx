import type { BlueprintSchemaViewModel } from '@/pages/BlueprintSchemaPage/BlueprintSchemaViewModel';
import { handleBlueprintNodeError } from '@/utils/blueprintErrorHandler';
import { findPathInTree } from '@/utils/pathUtils';
import type { MenuProps } from 'antd';
import { App, Menu } from 'antd';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';

/**
 * Пропсы компонента контекстного меню.
 */
export type PropsContextMenu = {
  /** Store страницы для выполнения действий. */
  pageStore: BlueprintSchemaViewModel;
};

/**
 * Создаёт пункты меню для узла графа.
 * @param nodeId ID узла.
 * @param pageStore Store страницы.
 * @param canEdit Флаг возможности редактирования.
 * @param canAddChild Флаг возможности добавления дочернего узла.
 * @param canDelete Флаг возможности удаления.
 * @param message API для отображения сообщений.
 * @param modal API для отображения модальных окон.
 * @returns Массив пунктов меню.
 */
const createNodeMenuItems = (
  nodeId: number,
  pageStore: BlueprintSchemaViewModel,
  canEdit: boolean,
  canAddChild: boolean,
  canDelete: boolean,
  message: ReturnType<typeof App.useApp>['message'],
  modal: ReturnType<typeof App.useApp>['modal']
): MenuProps['items'] => {
  const handleEdit = () => {
    pageStore.openEditForm(nodeId);
    pageStore.closeContextMenu();
  };

  const handleAddChild = () => {
    if (!pageStore.openAddChildForm(nodeId)) {
      message.warning('Дочерние узлы можно добавлять только к полям типа JSON');
    }
  };

  const handleEmbed = () => {
    if (!pageStore.openEmbedForm(nodeId)) {
      message.warning('Встраивание возможно только в поля типа JSON');
    }
  };

  const handleDelete = () => {
    const pathToDelete = pageStore.getPathById(nodeId);
    if (!pathToDelete) return;

    if (!pageStore.canDeleteNode(nodeId)) {
      message.warning('Нельзя удалить readonly поле. Измените исходный Blueprint.');
      pageStore.closeContextMenu();
      return;
    }

    modal.confirm({
      title: 'Удалить поле?',
      content: `Вы уверены, что хотите удалить поле "${pathToDelete.name}"? Это действие нельзя отменить.`,
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await pageStore.pathStore.deletePath(nodeId);
          message.success('Поле удалено');
          pageStore.setSelectedPathId(null);
        } catch (error) {
          handleBlueprintNodeError(error);
        }
      },
    });
    pageStore.closeContextMenu();
  };

  return [
    {
      key: 'edit',
      label: 'Редактировать',
      icon: <Edit className="w-4 h-4" />,
      onClick: handleEdit,
      disabled: !canEdit,
    },
    {
      key: 'addChild',
      label: 'Добавить дочерний узел',
      icon: <Plus className="w-4 h-4" />,
      onClick: handleAddChild,
      disabled: !canAddChild,
    },
    {
      key: 'embed',
      label: 'Встроить Blueprint',
      icon: <Plus className="w-4 h-4" />,
      onClick: handleEmbed,
      disabled: !canAddChild,
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'Удалить',
      icon: <Trash2 className="w-4 h-4" />,
      danger: true,
      onClick: handleDelete,
      disabled: !canDelete,
    },
  ];
};

/**
 * Создаёт пункты меню для пустой области графа.
 * @param pageStore Store страницы.
 * @returns Массив пунктов меню.
 */
const createEmptyAreaMenuItems = (pageStore: BlueprintSchemaViewModel): MenuProps['items'] => {
  return [
    {
      key: 'addRoot',
      label: 'Добавить корневой узел',
      icon: <Plus className="w-4 h-4" />,
      onClick: () => {
        pageStore.openAddRootForm();
      },
    },
    {
      key: 'embedRoot',
      label: 'Встроить Blueprint',
      icon: <Plus className="w-4 h-4" />,
      onClick: () => {
        pageStore.openEmbedForm(null);
      },
    },
  ];
};

/**
 * Компонент контекстного меню для узлов графа и пустой области.
 * Автоматически определяет тип меню на основе контекста и формирует соответствующие пункты.
 */
export const ContextMenu: React.FC<PropsContextMenu> = ({ pageStore }) => {
  const ctx = pageStore.ctx;
  const isNodeMenu = ctx.nodeId !== null && ctx.position !== null;
  const { modal, message } = App.useApp();
  const position = ctx.position!;
  const menuId = isNodeMenu ? `context-menu-${ctx.nodeId}` : 'empty-area-context-menu';

  const path = useMemo(() => {
    if (!isNodeMenu || !ctx.nodeId) return null;
    return findPathInTree(pageStore.paths, ctx.nodeId);
  }, [isNodeMenu, ctx.nodeId, pageStore.paths]);

  const canAddChild = path?.data_type === 'json' && !path.is_readonly;
  const canEdit = !path?.is_readonly;
  const canDelete = !path?.is_readonly;

  const menuItems: MenuProps['items'] = useMemo(() => {
    if (isNodeMenu && ctx.nodeId) {
      return createNodeMenuItems(
        ctx.nodeId,
        pageStore,
        canEdit,
        canAddChild,
        canDelete,
        message,
        modal
      );
    }
    return createEmptyAreaMenuItems(pageStore);
  }, [isNodeMenu, ctx.nodeId, pageStore, canAddChild, canEdit, canDelete, modal, message]);

  const onClose = () => pageStore.closeContextMenu();

  useEffect(() => {
    const menuElement = document.getElementById(menuId);
    if (!menuElement) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuElement && !menuElement.contains(target)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const timeout = setTimeout(() => {
      window.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 200);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, menuId]);

  return (
    <div
      id={menuId}
      className="fixed z-50 bg-white border rounded shadow-lg"
      style={{ left: position.x, top: position.y, minWidth: '200px' }}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      onContextMenu={e => {
        e.preventDefault();
        onClose();
      }}
    >
      <Menu items={menuItems} selectable={false} />
    </div>
  );
};
