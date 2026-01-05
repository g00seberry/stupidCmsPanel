import { Tooltip } from 'antd';
import { CalendarOutlined, CheckSquareOutlined, FileTextOutlined, NumberOutlined, LinkOutlined, LockOutlined, SearchOutlined } from '@ant-design/icons';
import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { FlowNode } from '../pathToGraph';

/**
 * Получить иконку для типа данных.
 */
const getDataTypeIcon = (dataType: string) => {
  switch (dataType) {
    case 'string':
    case 'text':
      return <FileTextOutlined className="w-4 h-4" />;
    case 'int':
    case 'float':
      return <NumberOutlined className="w-4 h-4" />;
    case 'bool':
      return <CheckSquareOutlined className="w-4 h-4" />;
    case 'datetime':
      return <CalendarOutlined className="w-4 h-4" />;
    case 'ref':
      return <LinkOutlined className="w-4 h-4" />;
    default:
      return <FileTextOutlined className="w-4 h-4" />;
  }
};

/**
 * Получить цвет фона для типа данных.
 */
const getDataTypeColor = (dataType: string): string => {
  switch (dataType) {
    case 'ref':
      return 'bg-purple-100 border-purple-300';
    case 'string':
    case 'text':
    case 'int':
    case 'float':
    case 'bool':
    case 'datetime':
      return 'bg-blue-100 border-blue-300';
    default:
      return 'bg-gray-100 border-gray-300';
  }
};

/**
 * Компонент узла простого поля для React Flow.
 * Отображает простое поле (string, int, bool и т.д.) с иконками и индикаторами.
 */
export const SimpleFieldNode = memo(({ data, selected }: NodeProps<FlowNode['data']>) => {
  const { path, label, dataType, isIndexed, isReadonly } = data;
  const isRequired = path.validation_rules?.required ?? false;
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
            type: <code>{path.data_type}</code> • cardinality: <code>{path.cardinality}</code>
          </div>
          {isReadonly && (
            <div>
              readonly: <code>true</code>
            </div>
          )}
          {path.validation_rules?.required && (
            <div>
              required: <code>true</code>
            </div>
          )}
          {isIndexed && (
            <div>
              indexed: <code>true</code>
            </div>
          )}
        </div>
      }
    >
      <div
        className={[
          'px-3 py-2 rounded-lg border min-w-[190px] select-none shadow-sm',
          selected ? 'ring-2 ring-blue-500' : '',
          getDataTypeColor(dataType),
        ].join(' ')}
      >
        <Handle type="target" position={Position.Top} />

        <div className="flex items-center gap-2">
          <span className="text-gray-700">{getDataTypeIcon(dataType)}</span>
          <span className="font-semibold text-sm text-gray-900">{label}</span>

          {isRequired && <span className="text-red-600 text-xs font-semibold">*</span>}

          {isMany && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/70 border border-black/10 text-gray-700">
              many
            </span>
          )}

          {isIndexed && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/70 border border-black/10 text-gray-700">
              <SearchOutlined className="w-3 h-3" />
              indexed
            </span>
          )}

          {isReadonly && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/70 border border-black/10 text-gray-700">
              <LockOutlined className="w-3 h-3" />
              ro
            </span>
          )}
        </div>

        <div className="mt-1 text-[11px] text-gray-600 flex items-center justify-between gap-2">
          <span className="truncate">{dataType}</span>
          <code className="text-[10px] text-gray-500 truncate max-w-[120px]">{path.full_path}</code>
        </div>

        <Handle type="source" position={Position.Bottom} />
      </div>
    </Tooltip>
  );
});
SimpleFieldNode.displayName = 'SimpleFieldNode';
