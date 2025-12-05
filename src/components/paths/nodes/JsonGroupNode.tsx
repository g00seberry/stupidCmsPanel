import { Handle, Position, type NodeProps } from 'reactflow';
import { Package } from 'lucide-react';
import type { FlowNode } from '../utils/pathToGraph';
import { Tooltip } from 'antd';

/**
 * Компонент узла JSON группы для React Flow.
 * Отображает группу полей (json), которая может иметь дочерние узлы.
 */
export const JsonGroupNode: React.FC<NodeProps<FlowNode['data']>> = ({ data, selected }) => {
  const { path, label } = data;
  const childCount = path.children?.length ?? 0;

  return (
    <Tooltip title={`Полный путь: ${path.full_path}`}>
      <div
        className={`px-3 py-2 rounded border min-w-[150px] ${
          selected ? 'ring-2 ring-green-500' : ''
        } bg-green-100 border-green-300`}
      >
        <Handle type="target" position={Position.Top} />
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          <span className="font-semibold text-sm">{label}</span>
          <span className="text-xs text-gray-500">(json)</span>
        </div>
        {childCount > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            {childCount} {childCount === 1 ? 'поле' : 'полей'}
          </div>
        )}
        <Handle type="source" position={Position.Bottom} />
      </div>
    </Tooltip>
  );
};
