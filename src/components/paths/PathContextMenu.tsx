import { useEffect } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { PathStore } from '@/pages/BlueprintSchemaPage/PathStore';
import { findPathInTree } from '@/utils/pathUtils';

/**
 * Пропсы компонента контекстного меню для узла графа.
 */
export type PropsPathContextMenu = {
  /** Идентификатор узла. */
  pathId: number;
  /** Позиция меню на экране. */
  position: { x: number; y: number };
  /** Обработчик закрытия меню. */
  onClose: () => void;
  /** Обработчик редактирования узла. */
  onEdit: () => void;
  /** Обработчик добавления дочернего узла. */
  onAddChild: () => void;
  /** Обработчик встраивания Blueprint. */
  onEmbed: () => void;
  /** Обработчик удаления узла. */
  onDelete: () => void;
  /** Store для получения информации о пути. */
  pathStore: PathStore;
};

/**
 * Контекстное меню для узла графа путей.
 * Отображает доступные действия для выбранного узла в зависимости от его свойств.
 */
export const PathContextMenu: React.FC<PropsPathContextMenu> = ({
  pathId,
  position,
  onClose,
  onEdit,
  onAddChild,
  onEmbed,
  onDelete,
  pathStore,
}) => {
  const path = findPathInTree(pathStore.paths, pathId);
  const canAddChild = path?.data_type === 'json' && !path.is_readonly;
  const canEdit = !path?.is_readonly;
  const canDelete = !path?.is_readonly;

  useEffect(() => {
    const menuElement = document.getElementById(`context-menu-${pathId}`);
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
  }, [onClose, pathId]);

  const menuItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Редактировать',
      icon: <Edit className="w-4 h-4" />,
      onClick: onEdit,
      disabled: !canEdit,
    },
    {
      key: 'addChild',
      label: 'Добавить дочерний узел',
      icon: <Plus className="w-4 h-4" />,
      onClick: onAddChild,
      disabled: !canAddChild,
    },
    {
      key: 'embed',
      label: 'Встроить Blueprint',
      icon: <Plus className="w-4 h-4" />,
      onClick: onEmbed,
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
      onClick: onDelete,
      disabled: !canDelete,
    },
  ];

  return (
    <div
      id={`context-menu-${pathId}`}
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
