import type React from 'react';
import { DeleteOutlined } from '@ant-design/icons';

type RuleListItemProps = {
  title: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
};

export const RuleListItem: React.FC<RuleListItemProps> = ({
  title,
  description,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-2 p-3 border border-gray-300 rounded transition-all hover:bg-gray-50 hover:border-blue-400">
      <div onClick={onEdit} className="flex-1 cursor-pointer">
        <div className="font-medium mb-1">{title}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
      <button
        onClick={e => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
        title="Удалить правило"
      >
        <DeleteOutlined />
      </button>
    </div>
  );
};
