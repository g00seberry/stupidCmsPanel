import { Tooltip } from 'antd';
import { CopyOutlined, LockOutlined } from '@ant-design/icons';
import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { FlowNode } from '../pathToGraph';

/**
 * Компонент узла встроенного Blueprint для React Flow.
 * Отображает встроенный Blueprint (readonly) с серым фоном и индикатором блокировки.
 */
export const EmbeddedBlueprintNode = memo(({ data, selected }: NodeProps<FlowNode['data']>) => {
  const { path, label, sourceBlueprintName } = data;
  const childCount = path.children?.length ?? 0;

  return (
    <Tooltip
      mouseEnterDelay={0.2}
      title={
        <div className="text-xs">
          <div>
            full_path: <code>{path.full_path}</code>
          </div>
          {sourceBlueprintName && (
            <div>
              source blueprint: <code>{sourceBlueprintName}</code>
            </div>
          )}
          <div>
            readonly: <code>true</code>
          </div>
          {path.blueprint_embed_id != null && (
            <div>
              embed_id: <code>{path.blueprint_embed_id}</code>
            </div>
          )}
        </div>
      }
    >
      <div
        className={[
          'px-3 py-2 rounded-lg border min-w-[220px] select-none shadow-sm bg-gray-100 border-gray-300',
          'opacity-80',
          selected ? 'ring-2 ring-gray-500' : '',
        ].join(' ')}
      >
        <Handle type="target" position={Position.Top} />
        <div className="flex items-center gap-2">
          <LockOutlined className="w-4 h-4 text-gray-700" />
          <CopyOutlined className="w-4 h-4 text-gray-700" />
          <span className="font-semibold text-sm text-gray-900">{label}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/70 border border-black/10 text-gray-700">
            readonly
          </span>
        </div>
        {sourceBlueprintName && (
          <div className="text-[11px] text-gray-600 mt-1">
            из <span className="font-medium">{sourceBlueprintName}</span>
          </div>
        )}
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
EmbeddedBlueprintNode.displayName = 'EmbeddedBlueprintNode';
