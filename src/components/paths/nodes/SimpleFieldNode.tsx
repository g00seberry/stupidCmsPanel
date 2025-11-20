import { Handle, Position, type NodeProps } from 'reactflow';
import { FileText, Hash, CheckSquare, Calendar, Link2 } from 'lucide-react';
import type { FlowNode } from '../utils/pathToGraph';
import { Tooltip } from 'antd';

/**
 * Получить иконку для типа данных.
 */
const getDataTypeIcon = (dataType: string) => {
  switch (dataType) {
    case 'string':
    case 'text':
      return <FileText className="w-4 h-4" />;
    case 'int':
    case 'float':
      return <Hash className="w-4 h-4" />;
    case 'bool':
      return <CheckSquare className="w-4 h-4" />;
    case 'date':
    case 'datetime':
      return <Calendar className="w-4 h-4" />;
    case 'ref':
      return <Link2 className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
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
    case 'date':
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
export const SimpleFieldNode: React.FC<NodeProps<FlowNode['data']>> = ({ data, selected }) => {
  const { path, label, dataType, isRequired, isIndexed } = data;

  return (
    <Tooltip title={`Полный путь: ${path.full_path}`}>
      <div
        className={`px-3 py-2 rounded border min-w-[150px] ${
          selected ? 'ring-2 ring-blue-500' : ''
        } ${getDataTypeColor(dataType)}`}
      >
        <Handle type="target" position={Position.Top} />
        <div className="flex items-center gap-2">
          {getDataTypeIcon(dataType)}
          <span className="font-semibold text-sm">{label}</span>
          {isRequired && <span className="text-red-500 text-xs">*</span>}
          {isIndexed && (
            <span className="text-blue-500 text-xs" title="Индексировано">
              🔍
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">{dataType}</div>
        <Handle type="source" position={Position.Bottom} />
      </div>
    </Tooltip>
  );
};
