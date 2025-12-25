import { Tooltip } from 'antd';
import { Braces, Lock } from 'lucide-react';
import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { FlowNode } from '../pathToGraph';

/**
 * Компонент узла JSON группы для React Flow.
 * Отображает группу полей (json), которая может иметь дочерние узлы.
 */
export const JsonGroupNode = memo(({ data, selected }: NodeProps<FlowNode['data']>) => {
  const { path, label, isReadonly } = data;
  const childCount = path.children?.length ?? 0;
  const isMany = path.cardinality === 'many';

  return (
    <Tooltip
      mouseEnterDelay={0.2}
      title={
        <div className="text-xs">
          <div>
            full_path: <code>{path.full_path}</code>
          </div>
          <div>
            type: <code>json</code> • cardinality: <code>{path.cardinality}</code>
          </div>
          <div>
            children: <code>{childCount}</code>
          </div>
          {isReadonly && (
            <div>
              readonly: <code>true</code>
            </div>
          )}
        </div>
      }
    >
      <div
        className={[
          'px-3 py-2 rounded-lg border min-w-[200px] select-none shadow-sm bg-green-100 border-green-300',
          selected ? 'ring-2 ring-green-500' : '',
        ].join(' ')}
      >
        <Handle type="target" position={Position.Top} />
        <div className="flex items-center gap-2">
          <Braces className="w-4 h-4 text-gray-700" />
          <span className="font-semibold text-sm text-gray-900">{label}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/70 border border-black/10 text-gray-700">
            json
          </span>
          {isMany && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/70 border border-black/10 text-gray-700">
              many
            </span>
          )}
          {isReadonly && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/70 border border-black/10 text-gray-700">
              <Lock className="w-3 h-3" />
              ro
            </span>
          )}
        </div>
        <div className="mt-1 text-[11px] text-gray-600 flex items-center justify-between gap-2">
          <span className="truncate">
            {childCount} {childCount === 1 ? 'поле' : 'полей'}
          </span>
          <code className="text-[10px] text-gray-500 truncate max-w-[120px]">{path.full_path}</code>
        </div>
        <Handle type="source" position={Position.Bottom} />
      </div>
    </Tooltip>
  );
});
JsonGroupNode.displayName = 'JsonGroupNode';
