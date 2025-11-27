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
 * Компонент контекстного меню для узлов графа и пустой области.
 * Автоматически определяет тип меню на основе контекста и формирует соответствующие пункты.
 */
export const ContextMenu: React.FC<PropsContextMenu> = ({ pageStore }) => {
  const ctx = pageStore.ctx;
  const isNodeMenu = ctx.nodeId !== null && ctx.position !== null;
  const { modal, message } = App.useApp();
  const position = isNodeMenu ? ctx.position! : ctx.emptyAreaPosition!;
  const menuId = isNodeMenu ? `context-menu-${ctx.nodeId}` : 'empty-area-context-menu';

  const path = useMemo(() => {
    if (!isNodeMenu || !ctx.nodeId) return null;
    return findPathInTree(pageStore.paths, ctx.nodeId);
  }, [isNodeMenu, ctx.nodeId, pageStore.paths]);

  const canAddChild = path?.data_type === 'json' && !path.is_readonly;
  const canEdit = !path?.is_readonly;
  const canDelete = !path?.is_readonly;

  const menuItems: MenuProps['items'] = useMemo(() => {
    if (isNodeMenu) {
      return [
        {
          key: 'edit',
          label: 'Редактировать',
          icon: <Edit className="w-4 h-4" />,
          onClick: () => {
            pageStore.openEditForm(ctx.nodeId!);
            pageStore.closeContextMenu();
          },
          disabled: !canEdit,
        },
        {
          key: 'addChild',
          label: 'Добавить дочерний узел',
          icon: <Plus className="w-4 h-4" />,
          onClick: () => {
            if (!pageStore.openAddChildForm(ctx.nodeId!)) {
              message.warning('Дочерние узлы можно добавлять только к полям типа JSON');
            }
          },
          disabled: !canAddChild,
        },
        {
          key: 'embed',
          label: 'Встроить Blueprint',
          icon: <Plus className="w-4 h-4" />,
          onClick: () => {
            if (!pageStore.openEmbedForm(ctx.nodeId!)) {
              message.warning('Встраивание возможно только в поля типа JSON');
            }
          },
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
          onClick: () => {
            const pathToDelete = pageStore.getPathById(ctx.nodeId!);
            if (!pathToDelete) return;

            if (!pageStore.canDeleteNode(ctx.nodeId!)) {
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
                  await pageStore.pathStore.deletePath(ctx.nodeId!);
                  message.success('Поле удалено');
                  pageStore.setSelectedPathId(null);
                } catch (error) {
                  handleBlueprintNodeError(error);
                }
              },
            });
            pageStore.closeContextMenu();
          },
          disabled: !canDelete,
        },
      ];
    }

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
  }, [isNodeMenu, ctx.nodeId, pageStore, canAddChild, canEdit, canDelete, modal, message]);

  const onClose = isNodeMenu ? pageStore.closeContextMenu : pageStore.closeEmptyAreaContextMenu;

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
