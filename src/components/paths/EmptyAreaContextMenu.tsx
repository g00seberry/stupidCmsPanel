import { useEffect } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { Plus } from 'lucide-react';

/**
 * Пропсы компонента контекстного меню для пустой области графа.
 */
export type PropsEmptyAreaContextMenu = {
  /** Позиция меню на экране. */
  position: { x: number; y: number };
  /** Обработчик закрытия меню. */
  onClose: () => void;
  /** Обработчик добавления корневого узла. */
  onAddRoot: () => void;
  /** Обработчик встраивания Blueprint в корень. */
  onEmbedRoot: () => void;
};

/**
 * Контекстное меню для пустой области графа.
 * Отображается при клике правой кнопкой мыши на пустом месте графа.
 */
export const EmptyAreaContextMenu: React.FC<PropsEmptyAreaContextMenu> = ({
  position,
  onClose,
  onAddRoot,
  onEmbedRoot,
}) => {
  useEffect(() => {
    const menuElement = document.getElementById('empty-area-context-menu');
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
  }, [onClose]);

  const menuItems: MenuProps['items'] = [
    {
      key: 'addRoot',
      label: 'Добавить корневой узел',
      icon: <Plus className="w-4 h-4" />,
      onClick: () => {
        onAddRoot();
        onClose();
      },
    },
    {
      key: 'embedRoot',
      label: 'Встроить Blueprint',
      icon: <Plus className="w-4 h-4" />,
      onClick: () => {
        onEmbedRoot();
        onClose();
      },
    },
  ];

  return (
    <div
      id="empty-area-context-menu"
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






