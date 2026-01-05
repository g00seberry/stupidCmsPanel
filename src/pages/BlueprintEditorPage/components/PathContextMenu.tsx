import { Menu, type MenuProps } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

export type PathContextMenuPosition = {
  x: number;
  y: number;
};

export type PathContextMenuContext =
  | { type: 'node'; pathId: string; position: PathContextMenuPosition }
  | { type: 'pane'; position: PathContextMenuPosition }
  | null;

export type PathContextMenuActions = {
  onEdit?: (pathId: string) => void;
  onAddChild?: (pathId: string) => void;
  onEmbed?: (pathId: string | null) => void;
  onDelete?: (pathId: string) => void;
  onAddRoot?: () => void;
};

export type PathContextMenuPermissions = {
  canEdit?: boolean;
  canAddChild?: boolean;
  canEmbed?: boolean;
  canDelete?: boolean;
};

export type PropsPathContextMenu = {
  context: PathContextMenuContext;
  actions: PathContextMenuActions;
  permissions?: PathContextMenuPermissions;
  onClose: () => void;
};

/**
 * Создать пункты меню для узла графа (path-ноды).
 */
const createNodeMenuItems = (
  pathId: string,
  actions: PathContextMenuActions,
  permissions: PathContextMenuPermissions
): MenuProps['items'] => {
  const { canEdit = true, canAddChild = true, canEmbed = true, canDelete = true } = permissions;

  return [
    {
      key: 'edit',
      label: 'Редактировать',
      icon: <EditOutlined />,
      onClick: () => actions.onEdit?.(pathId),
      disabled: !canEdit,
    },
    {
      key: 'addChild',
      label: 'Добавить дочернее поле',
      icon: <PlusOutlined />,
      onClick: () => actions.onAddChild?.(pathId),
      disabled: !canAddChild,
    },
    {
      key: 'embed',
      label: 'Встроить Blueprint',
      icon: <PlusCircleOutlined />,
      onClick: () => actions.onEmbed?.(pathId),
      disabled: !canEmbed,
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'Удалить',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => actions.onDelete?.(pathId),
      disabled: !canDelete,
    },
  ];
};

/**
 * Создать пункты меню для пустой области графа.
 */
const createPaneMenuItems = (actions: PathContextMenuActions): MenuProps['items'] => {
  return [
    {
      key: 'addRoot',
      label: 'Добавить корневое поле',
      icon: <PlusOutlined />,
      onClick: () => actions.onAddRoot?.(),
    },
    {
      key: 'embedRoot',
      label: 'Встроить Blueprint',
      icon: <PlusCircleOutlined />,
      onClick: () => actions.onEmbed?.(null),
    },
  ];
};

/**
 * Контекстное меню для графа paths.
 * Чистый UI-компонент без привязки к store.
 */
export const PathContextMenu: React.FC<PropsPathContextMenu> = ({
  context,
  actions,
  permissions = {},
  onClose,
}) => {
  if (!context) return null;

  const { position } = context;
  const menuId = context.type === 'node' ? `path-menu-${context.pathId}` : 'path-menu-pane';

  const menuItems: MenuProps['items'] =
    context.type === 'node'
      ? createNodeMenuItems(context.pathId, actions, permissions)
      : createPaneMenuItems(actions);

  // Автоматическое закрытие при клике вне меню или Escape
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

    // Небольшая задержка, чтобы текущий клик не закрыл меню сразу
    const timeout = setTimeout(() => {
      window.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 100);

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
      style={{ left: position.x, top: position.y, minWidth: '220px' }}
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

