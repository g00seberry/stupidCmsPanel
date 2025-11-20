import type { ZPathTreeNode } from '@/types/path';
import dagre from 'dagre';

/**
 * Тип узла React Flow (будет использоваться после установки reactflow).
 */
export type FlowNode = {
  id: string;
  type: string;
  data: {
    path: ZPathTreeNode;
    label: string;
    dataType: string;
    isRequired: boolean;
    isIndexed: boolean;
    isReadonly: boolean;
    sourceBlueprintName?: string;
  };
  position: { x: number; y: number };
};

/**
 * Тип связи React Flow (будет использоваться после установки reactflow).
 */
export type FlowEdge = {
  id: string;
  source: string;
  target: string;
  type: string;
  animated: boolean;
};

/**
 * Преобразует дерево Path из API в узлы и связи для React Flow.
 * @param paths Дерево полей Blueprint.
 * @returns Объект с узлами и связями для React Flow.
 */
export const pathTreeToGraph = (
  paths: ZPathTreeNode[]
): { nodes: FlowNode[]; edges: FlowEdge[] } => {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];

  const traverse = (path: ZPathTreeNode, level: number, parentX: number, parentY: number) => {
    // Определить тип узла
    let nodeType = 'simpleField';
    if (path.data_type === 'json') {
      nodeType = 'jsonGroup';
    }
    if (path.is_readonly && path.source_blueprint_id) {
      nodeType = 'embeddedBlueprint';
    }

    // Создать узел
    nodes.push({
      id: path.id.toString(),
      type: nodeType,
      data: {
        path,
        label: path.name,
        dataType: path.data_type,
        isRequired: path.is_required,
        isIndexed: path.is_indexed,
        isReadonly: path.is_readonly,
        sourceBlueprintName: path.source_blueprint?.name,
      },
      position: { x: parentX, y: parentY + level * 100 },
    });

    // Создать связь с родителем
    if (path.parent_id) {
      edges.push({
        id: `e${path.parent_id}-${path.id}`,
        source: path.parent_id.toString(),
        target: path.id.toString(),
        type: 'smoothstep',
        animated: path.is_readonly,
      });
    }

    // Обработать дочерние узлы
    if (path.children) {
      path.children.forEach((child: ZPathTreeNode, index: number) => {
        traverse(child, level + 1, parentX + index * 200, parentY);
      });
    }
  };

  paths.forEach((path, index) => traverse(path, 0, index * 300, 0));

  return { nodes, edges };
};

/**
 * Применить автоматическую компоновку графа через dagre.
 * @param nodes Узлы графа.
 * @param edges Связи графа.
 * @param direction Направление компоновки (TB - сверху вниз, LR - слева направо).
 * @returns Узлы с обновлёнными позициями.
 */
export const applyDagreLayout = (
  nodes: FlowNode[],
  edges: FlowEdge[],
  direction: 'TB' | 'LR' = 'TB'
): FlowNode[] => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 80 });

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: 200, height: 80 });
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
