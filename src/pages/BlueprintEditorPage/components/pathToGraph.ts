import type { ZPath } from '@/types/path/path';
import dagre from 'dagre';

/**
 * Базовые типы для построения графа Path → ReactFlow.
 * Этот файл не зависит от ReactFlow напрямую: он возвращает "flow" узлы/рёбра,
 * которые затем можно адаптировать под любые визуальные компоненты.
 */
export type PathNodeType = 'simpleField' | 'jsonGroup' | 'embeddedBlueprint';

export type FlowNodeData = {
  path: ZPath;
  label: string;
  dataType: ZPath['data_type'];
  isIndexed: boolean;
  isReadonly: boolean;
  sourceBlueprintName?: string;
};

export type FlowNode = Readonly<{
  id: string;
  type: PathNodeType;
  data: FlowNodeData;
  position: { x: number; y: number };
}>;

/**
 * Ребро графа (под ReactFlow/ReactFlow-like).
 */
export type FlowEdge = Readonly<{
  id: string;
  source: string;
  target: string;
  type: 'smoothstep';
  animated: boolean;
}>;

export type PathGraph = Readonly<{
  nodes: FlowNode[];
  edges: FlowEdge[];
}>;

export type BuildGraphOptions = Readonly<{
  /**
   * Горизонтальный шаг для начальной (не dagre) раскладки.
   * Реальная раскладка обычно делается через `applyDagreLayout`.
   */
  rootXStep?: number;
  /** Вертикальный шаг для начальной (не dagre) раскладки. */
  depthYStep?: number;
  /** Горизонтальный шаг между siblings в начальной раскладке. */
  siblingXStep?: number;
}>;

export type DagreLayoutOptions = Readonly<{
  direction?: 'TB' | 'LR';
  nodeWidth?: number;
  nodeHeight?: number;
  nodesep?: number;
  ranksep?: number;
}>;

const DEFAULT_BUILD_OPTIONS: Required<BuildGraphOptions> = {
  rootXStep: 320,
  depthYStep: 120,
  siblingXStep: 220,
};

const DEFAULT_DAGRE_OPTIONS: Required<DagreLayoutOptions> = {
  direction: 'TB',
  nodeWidth: 220,
  nodeHeight: 90,
  nodesep: 100,
  ranksep: 80,
};

const toNodeId = (id: ZPath['id']): string => String(id);

const computeNodeType = (path: ZPath): PathNodeType => {
  if (path.blueprint_embed_id) return 'embeddedBlueprint';
  if (path.data_type === 'json') return 'jsonGroup';
  return 'simpleField';
};

const buildNodeData = (path: ZPath): FlowNodeData => ({
  path,
  label: path.name,
  dataType: path.data_type,
  isIndexed: path.is_indexed,
  isReadonly: !!path.blueprint_embed_id,
  sourceBlueprintName: path.source_blueprint?.name,
});

/**
 * Преобразует дерево Path из API в узлы и связи для React Flow.
 * @param paths Дерево полей Blueprint.
 * @param options Параметры начальной раскладки (до dagre).
 * @returns Граф (узлы + рёбра).
 */
export const pathTreeToGraph = (
  paths: ReadonlyArray<ZPath>,
  options?: BuildGraphOptions
): PathGraph => {
  const opt = { ...DEFAULT_BUILD_OPTIONS, ...options };
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];

  const walk = (path: ZPath, depth: number, x: number, parentId?: string) => {
    const id = toNodeId(path.id);

    nodes.push({
      id,
      type: computeNodeType(path),
      data: buildNodeData(path),
      position: { x, y: depth * opt.depthYStep },
    });

    if (parentId) {
      edges.push({
        id: `e${parentId}-${id}`,
        source: parentId,
        target: id,
        type: 'smoothstep',
        animated: !!path.blueprint_embed_id,
      });
    }

    const children = path.children ?? [];
    if (children.length === 0) return;

    children.forEach((child, idx) => {
      const childX = x + (idx - (children.length - 1) / 2) * opt.siblingXStep;
      walk(child, depth + 1, childX, id);
    });
  };

  paths.forEach((root, idx) => {
    walk(root as ZPath, 0, idx * opt.rootXStep);
  });

  return { nodes, edges };
};

/**
 * Применить автоматическую компоновку графа через dagre.
 * @param nodes Узлы графа.
 * @param edges Связи графа.
 * @param options Параметры компоновки.
 * @returns Узлы с обновлёнными позициями.
 */
export const applyDagreLayout = (
  nodes: ReadonlyArray<FlowNode>,
  edges: ReadonlyArray<FlowEdge>,
  options?: DagreLayoutOptions
): FlowNode[] => {
  const opt = { ...DEFAULT_DAGRE_OPTIONS, ...options };
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: opt.direction, nodesep: opt.nodesep, ranksep: opt.ranksep });

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: opt.nodeWidth, height: opt.nodeHeight });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map(node => {
    const position = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x: position.x, y: position.y },
    };
  });
};
