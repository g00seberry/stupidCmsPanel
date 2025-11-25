import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type ReactFlowInstance,
  type NodeMouseHandler,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
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
  /** Обработчик выбора узла. */
  onNodeSelect?: (pathId: number) => void;
  /** Обработчик двойного клика на узел (для редактирования). */
  onNodeDoubleClick?: (pathId: number) => void;
  /** Обработчик контекстного меню на узле. */
  onNodeContextMenu?: (pathId: number, event: React.MouseEvent) => void;
  /** Обработчик контекстного меню на пустой области графа. */
  onPaneContextMenu?: (event: React.MouseEvent) => void;
  /** Выделенные узлы (для подсветки). */
  highlightedNodes?: number[];
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
    onNodeSelect,
    onNodeDoubleClick,
    onNodeContextMenu,
    onPaneContextMenu,
    highlightedNodes = [],
    reactFlowInstanceRef,
  }) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [, setAutoLayoutApplied] = useState(false);
    const internalInstanceRef = useRef<ReactFlowInstance | null>(null);

    // Преобразование Path дерева в граф React Flow
    const graphData = useMemo(() => {
      if (store.paths.length === 0) {
        return { nodes: [], edges: [] };
      }
      return pathTreeToGraph(store.paths);
    }, [store.paths]);

    // Применение автоматической компоновки при изменении данных графа
    useEffect(() => {
      if (graphData.nodes.length > 0) {
        const layoutedNodes = applyDagreLayout(graphData.nodes, graphData.edges);
        setNodes(layoutedNodes as Node[]);
        setEdges(graphData.edges as Edge[]);
        setAutoLayoutApplied(true);
        // Центрирование после применения компоновки
        setTimeout(() => {
          internalInstanceRef.current?.fitView();
        }, 100);
      } else {
        setNodes([]);
        setEdges([]);
        setAutoLayoutApplied(false);
      }
    }, [graphData]);

    // Обновление выделенных узлов
    useEffect(() => {
      const highlightedSet = new Set(highlightedNodes);
      setNodes(prevNodes => {
        if (prevNodes.length === 0) return prevNodes;
        return prevNodes.map(node => {
          const isSelected = highlightedSet.has(Number(node.id));
          if (node.selected === isSelected) return node;
          return { ...node, selected: isSelected };
        });
      });
    }, [highlightedNodes]);

    const onNodesChange: OnNodesChange = useCallback(changes => {
      setNodes(prevNodes => applyNodeChanges(changes, prevNodes));
    }, []);

    const onEdgesChange: OnEdgesChange = useCallback(changes => {
      setEdges(prevEdges => applyEdgeChanges(changes, prevEdges));
    }, []);

    const handleNodeClick: NodeMouseHandler = useCallback(
      (_event: React.MouseEvent, node: Node) => {
        onNodeSelect?.(Number(node.id));
      },
      [onNodeSelect]
    );

    const handleNodeDoubleClick: NodeMouseHandler = useCallback(
      (_event: React.MouseEvent, node: Node) => {
        onNodeDoubleClick?.(Number(node.id));
      },
      [onNodeDoubleClick]
    );

    const handleNodeContextMenu: NodeMouseHandler = useCallback(
      (event: React.MouseEvent, node: Node) => {
        event.preventDefault();
        onNodeContextMenu?.(Number(node.id), event);
      },
      [onNodeContextMenu]
    );

    const handlePaneContextMenu = useCallback(
      (event: React.MouseEvent) => {
        event.preventDefault();
        onPaneContextMenu?.(event);
      },
      [onPaneContextMenu]
    );

    const onInit = useCallback(
      (instance: ReactFlowInstance) => {
        internalInstanceRef.current = instance;
        if (reactFlowInstanceRef) {
          reactFlowInstanceRef.current = instance;
        }
      },
      [reactFlowInstanceRef]
    );

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
          onContextMenu={handlePaneContextMenu}
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
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
          onNodeContextMenu={handleNodeContextMenu}
          onPaneContextMenu={handlePaneContextMenu}
          onInit={onInit}
          nodeTypes={nodeTypes}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
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
