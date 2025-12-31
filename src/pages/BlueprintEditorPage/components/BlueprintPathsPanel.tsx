import { Card } from 'antd';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type ReactFlowInstance,
  type Edge,
  type Node,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ZPath } from '@/types/path';
import { GraphControls } from '@/components/paths/GraphControls';
import { applyDagreLayout, pathTreeToGraph, type FlowEdge, type FlowNode } from './pathToGraph';
import { EmbeddedBlueprintNode } from './nodes/EmbeddedBlueprintNode';
import { JsonGroupNode } from './nodes/JsonGroupNode';
import { SimpleFieldNode } from './nodes/SimpleFieldNode';

const nodeTypes = {
  simpleField: SimpleFieldNode,
  jsonGroup: JsonGroupNode,
  embeddedBlueprint: EmbeddedBlueprintNode,
};

export type PropsBlueprintPathsPanel = {
  paths: ZPath[];
  pending?: boolean;
  height?: number;
  direction?: 'TB' | 'LR';
  draggable?: boolean;
  showMiniMap?: boolean;
  showControls?: boolean;
  onNodeClick?: (pathId: string) => void;
  onNodeContextMenu?: (pathId: string, event: React.MouseEvent) => void;
  onPaneContextMenu?: (event: React.MouseEvent) => void;
};

type RFNode = Node<FlowNode['data']>;
type RFEdge = Edge;

const toReactFlowGraph = (graph: {
  nodes: FlowNode[];
  edges: FlowEdge[];
}): { nodes: RFNode[]; edges: RFEdge[] } => {
  return {
    nodes: graph.nodes.map(n => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    })),
    edges: graph.edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: e.type,
      animated: e.animated,
    })),
  };
};

export const BlueprintPathsPanel: React.FC<PropsBlueprintPathsPanel> = ({
  paths,
  pending = false,
  height = 600,
  direction = 'TB',
  draggable = true,
  showMiniMap = true,
  showControls = true,
  onNodeClick,
  onNodeContextMenu,
  onPaneContextMenu,
}) => {
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);
  const [nodes, setNodes] = useState<RFNode[]>([]);
  const [edges, setEdges] = useState<RFEdge[]>([]);

  const baseGraph = useMemo(() => {
    if (paths.length === 0) return { nodes: [] as RFNode[], edges: [] as RFEdge[] };

    const graph = pathTreeToGraph(paths);
    const layouted = applyDagreLayout(graph.nodes, graph.edges, { direction });
    return toReactFlowGraph({ nodes: layouted, edges: graph.edges });
  }, [paths, direction]);

  useEffect(() => {
    // Источник истины — `paths`. При их изменении перестраиваем граф целиком.
    // (Если позже захочешь сохранять ручной drag-позиционинг — это отдельная политика.)
    if (baseGraph.nodes.length > 0) {
      setNodes(baseGraph.nodes);
      setEdges(baseGraph.edges);
      setTimeout(() => reactFlowInstanceRef.current?.fitView(), 100);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [baseGraph]);

  const handleCenter = useCallback(() => {
    reactFlowInstanceRef.current?.fitView();
  }, []);

  const handleAutoLayout = useCallback(() => {
    if (paths.length === 0) return;
    const graph = pathTreeToGraph(paths);
    const layouted = applyDagreLayout(graph.nodes, graph.edges, { direction });
    const rf = toReactFlowGraph({ nodes: layouted, edges: graph.edges });
    setNodes(rf.nodes);
    setEdges(rf.edges);
    setTimeout(() => reactFlowInstanceRef.current?.fitView(), 50);
  }, [paths, direction]);

  const handleResetZoom = useCallback(() => {
    reactFlowInstanceRef.current?.setViewport({ x: 0, y: 0, zoom: 1 });
  }, []);

  const handleZoomIn = useCallback(() => {
    reactFlowInstanceRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    reactFlowInstanceRef.current?.zoomOut();
  }, []);

  return (
    <Card
      title={'Управление структурой данных'}
      className="mt-4 lg:mt-0"
      styles={{
        header: { borderBottom: '1px solid #f0f0f0' },
        body: { padding: 0 },
      }}
    >
      <GraphControls
        onCenter={handleCenter}
        onAutoLayout={handleAutoLayout}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
      />

      {pending ? (
        <div className="w-full flex items-center justify-center text-gray-500" style={{ height }}>
          Загрузка...
        </div>
      ) : paths.length === 0 ? (
        <div className="w-full flex items-center justify-center text-gray-500" style={{ height }}>
          Нет полей (paths)
        </div>
      ) : (
        <div className="w-full" style={{ height }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={changes => setNodes(prev => applyNodeChanges(changes, prev))}
            onEdgesChange={changes => setEdges(prev => applyEdgeChanges(changes, prev))}
            onNodeClick={(_, node) => onNodeClick?.(node.id)}
            onNodeContextMenu={(event, node) => {
              event.preventDefault();
              onNodeContextMenu?.(node.id, event);
            }}
            onPaneContextMenu={event => {
              event.preventDefault();
              onPaneContextMenu?.(event);
            }}
            onInit={instance => {
              reactFlowInstanceRef.current = instance;
            }}
            nodesDraggable={draggable}
            nodesConnectable={false}
            elementsSelectable
            fitView
          >
            <Background />
            {showControls && <Controls />}
            {showMiniMap && <MiniMap />}
          </ReactFlow>
        </div>
      )}
    </Card>
  );
};
