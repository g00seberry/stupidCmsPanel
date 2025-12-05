import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type ReactFlowInstance,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { ZId } from '@/types/ZId';
import type { PathStore } from '@/pages/BlueprintSchemaPage/PathStore';
import { pathTreeToGraph, applyDagreLayout } from './utils/pathToGraph';
import { SimpleFieldNode } from './nodes/SimpleFieldNode';
import { JsonGroupNode } from './nodes/JsonGroupNode';
import { EmbeddedBlueprintNode } from './nodes/EmbeddedBlueprintNode';

/**
 * Пропсы компонента визуального редактора графа полей Blueprint.
 */
export type PropsPathGraphEditor = {
  /** Store для управления полями Blueprint. */
  store: PathStore;
  /** Обработчик контекстного меню на узле. */
  onNodeContextMenu?: (pathId: ZId, event: React.MouseEvent) => void;
  /** Обработчик контекстного меню на пустой области графа. */
  onPaneContextMenu?: (event: React.MouseEvent) => void;
  /** Выделенные узлы (для подсветки). */
  highlightedNodes?: ZId[];
  /** Референс на ReactFlow instance (для управления извне через GraphControls). */
  reactFlowInstanceRef?: React.MutableRefObject<ReactFlowInstance | null>;
};

/**
 * Типы кастомных узлов для React Flow.
 */
const nodeTypes = {
  simpleField: SimpleFieldNode,
  jsonGroup: JsonGroupNode,
  embeddedBlueprint: EmbeddedBlueprintNode,
} as const;

/**
 * Визуальный редактор графов для схемы Blueprint.
 * Отображает интерактивный граф с возможностью drag&drop, контекстного меню и визуального редактирования структуры полей.
 */
export const PathGraphEditor: React.FC<PropsPathGraphEditor> = observer(
  ({
    store,
    onNodeContextMenu,
    onPaneContextMenu,
    highlightedNodes = [],
    reactFlowInstanceRef,
  }) => {
    const instanceRef = useRef<ReactFlowInstance | null>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    // Вычисление графа с выделением узлов
    const graphData = useMemo(() => {
      if (store.paths.length === 0) {
        return { nodes: [], edges: [] };
      }
      const rawGraph = pathTreeToGraph(store.paths);
      const highlightedSet = new Set(highlightedNodes);
      const layoutedNodes = applyDagreLayout(rawGraph.nodes, rawGraph.edges);
      const nodesWithSelection = layoutedNodes.map(node => ({
        ...node,
        selected: highlightedSet.has(node.id as ZId),
      }));
      return { nodes: nodesWithSelection, edges: rawGraph.edges };
    }, [store.paths, highlightedNodes]);

    // Применение компоновки и центрирование
    useEffect(() => {
      if (graphData.nodes.length > 0) {
        setNodes(graphData.nodes as Node[]);
        setEdges(graphData.edges as Edge[]);
        setTimeout(() => instanceRef.current?.fitView(), 100);
      } else {
        setNodes([]);
        setEdges([]);
      }
    }, [graphData]);

    const handleInit = (instance: ReactFlowInstance) => {
      instanceRef.current = instance;
      reactFlowInstanceRef && (reactFlowInstanceRef.current = instance);
    };

    if (store.pending) {
      return (
        <div className="w-full h-full min-h-[400px] border rounded bg-background flex items-center justify-center">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      );
    }

    if (store.paths.length === 0) {
      return (
        <div
          className="w-full h-full min-h-[400px] border rounded bg-background flex items-center justify-center"
          onContextMenu={e => {
            e.preventDefault();
            onPaneContextMenu?.(e);
          }}
        >
          <div className="text-gray-500">
            Нет полей. Кликните правой кнопкой мыши на пустом месте для добавления первого поля.
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full min-h-[600px] border rounded bg-background">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={changes => setNodes(prev => applyNodeChanges(changes, prev))}
          onEdgesChange={changes => setEdges(prev => applyEdgeChanges(changes, prev))}
          onNodeContextMenu={(e, node) => {
            e.preventDefault();
            onNodeContextMenu?.(node.id as ZId, e);
          }}
          onPaneContextMenu={e => {
            e.preventDefault();
            onPaneContextMenu?.(e);
          }}
          onInit={handleInit}
          nodeTypes={nodeTypes}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    );
  }
);
