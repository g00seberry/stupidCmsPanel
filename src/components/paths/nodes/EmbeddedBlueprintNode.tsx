import { Handle, Position, type NodeProps } from 'reactflow';
import { Lock, Package } from 'lucide-react';
import type { FlowNode } from '../utils/pathToGraph';
import { Tooltip } from 'antd';

/**
 * Компонент узла встроенного Blueprint для React Flow.
 * Отображает встроенный Blueprint (readonly) с серым фоном и индикатором блокировки.
 */
export const EmbeddedBlueprintNode: React.FC<NodeProps<FlowNode['data']>> = ({
  data,
  selected,
}) => {
  const { path, label, sourceBlueprintName } = data;
  const childCount = path.children?.length ?? 0;

  return (
    <Tooltip
      title={
        <div>
          <div>Полный путь: {path.full_path}</div>
          {sourceBlueprintName && <div>Источник: {sourceBlueprintName}</div>}
        </div>
      }
    >
      <div
        className={`px-3 py-2 rounded border min-w-[150px] ${
          selected ? 'ring-2 ring-gray-500' : ''
        } bg-gray-100 border-gray-300 opacity-75`}
      >
        <Handle type="target" position={Position.Top} />
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-gray-600" />
          <Package className="w-4 h-4" />
          <span className="font-semibold text-sm">{label}</span>
          <span className="text-xs text-gray-500">(readonly)</span>
        </div>
        {sourceBlueprintName && (
          <div className="text-xs text-gray-500 mt-1">из {sourceBlueprintName}</div>
        )}
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
