import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState, useRef } from 'react';
import { Card, message, App } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import type { ReactFlowInstance } from 'reactflow';
import { PathGraphEditor } from '@/components/paths/PathGraphEditor';
import { GraphControls } from '@/components/paths/GraphControls';
import { NodeFormModal } from '@/components/paths/NodeFormModal';
import { PathContextMenu } from '@/components/paths/PathContextMenu';
import { EmptyAreaContextMenu } from '@/components/paths/EmptyAreaContextMenu';
import { PathStore } from '@/stores/PathStore';
import { BlueprintEmbedStore } from '@/stores/BlueprintEmbedStore';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import { buildUrl, PageUrl } from '@/PageUrl';
import { findPathInTree } from '@/utils/pathUtils';
import { handleBlueprintNodeError } from '@/utils/blueprintErrorHandler';

/**
 * Страница редактирования схемы Blueprint.
 * Позволяет визуально редактировать структуру данных Blueprint через граф путей.
 */
export const BlueprintSchemaPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedPathId, setSelectedPathId] = useState<number | null>(null);
  const [nodeFormOpen, setNodeFormOpen] = useState(false);
  const [nodeFormMode, setNodeFormMode] = useState<'create' | 'edit' | 'embed'>('create');
  const [nodeFormParentId, setNodeFormParentId] = useState<number | null>(null);
  const [contextMenuNodeId, setContextMenuNodeId] = useState<number | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const [emptyAreaContextMenuPosition, setEmptyAreaContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

  const blueprintId = id ? Number(id) : null;
  const { modal } = App.useApp();

  const pathStore = useMemo(() => new PathStore(), []);
  const embedStore = useMemo(() => new BlueprintEmbedStore(), []);

  // Загрузка путей и встраиваний при монтировании
  useEffect(() => {
    if (blueprintId) {
      void pathStore.loadPaths(blueprintId);
      void embedStore.loadEmbeddable(blueprintId);
    }
  }, [blueprintId, pathStore, embedStore]);

  const handleNodeSelect = (pathId: number) => {
    setSelectedPathId(pathId);
  };

  const handleNodeDoubleClick = (pathId: number) => {
    setSelectedPathId(pathId);
    setNodeFormMode('edit');
    setNodeFormOpen(true);
  };

  const handleNodeContextMenu = (pathId: number, event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedPathId(pathId);
    setContextMenuNodeId(pathId);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setEmptyAreaContextMenuPosition(null);
  };

  const handlePaneContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setEmptyAreaContextMenuPosition({ x: event.clientX, y: event.clientY });
    setContextMenuNodeId(null);
    setContextMenuPosition(null);
  };

  const handleCloseContextMenu = () => {
    setContextMenuNodeId(null);
    setContextMenuPosition(null);
  };

  const handleCloseEmptyAreaContextMenu = () => {
    setEmptyAreaContextMenuPosition(null);
  };

  const handleAddChildNode = (parentId: number) => {
    const parentPath = findPathInTree(pathStore.paths, parentId);
    if (parentPath && parentPath.data_type === 'json') {
      setNodeFormMode('create');
      setNodeFormParentId(parentId);
      setNodeFormOpen(true);
      handleCloseContextMenu();
    } else {
      message.warning('Дочерние узлы можно добавлять только к полям типа JSON');
    }
  };

  const handleEmbedBlueprint = (parentId: number) => {
    const parentPath = findPathInTree(pathStore.paths, parentId);
    if (parentPath && parentPath.data_type === 'json') {
      setNodeFormMode('embed');
      setNodeFormParentId(parentId);
      setNodeFormOpen(true);
      handleCloseContextMenu();
    } else {
      message.warning('Встраивание возможно только в поля типа JSON');
    }
  };

  const handleDeleteNode = async (pathId: number) => {
    const path = findPathInTree(pathStore.paths, pathId);
    if (!path) return;

    if (path.is_readonly) {
      message.warning('Нельзя удалить readonly поле. Измените исходный Blueprint.');
      return;
    }

    modal.confirm({
      title: 'Удалить поле?',
      content: `Вы уверены, что хотите удалить поле "${path.name}"? Это действие нельзя отменить.`,
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await pathStore.deletePath(pathId);
          message.success('Поле удалено');
          setSelectedPathId(null);
        } catch (error) {
          handleBlueprintNodeError(error);
        }
      },
    });
    handleCloseContextMenu();
  };

  const handleAddRootNode = () => {
    setNodeFormMode('create');
    setNodeFormParentId(null);
    setNodeFormOpen(true);
    handleCloseEmptyAreaContextMenu();
  };

  const handleEmbedRootNode = () => {
    setNodeFormMode('embed');
    setNodeFormParentId(null);
    setNodeFormOpen(true);
    handleCloseEmptyAreaContextMenu();
  };

  const handleNodeSave = async (
    values: ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number }
  ) => {
    if (!blueprintId) return;

    try {
      if (nodeFormMode === 'embed') {
        const embedDto = {
          embedded_blueprint_id: (values as { embedded_blueprint_id: number })
            .embedded_blueprint_id,
          host_path_id: nodeFormParentId || undefined,
        };
        await embedStore.createEmbed(embedDto);
        await pathStore.loadPaths(blueprintId);
        message.success('Blueprint встроен');
      } else if (nodeFormMode === 'edit' && selectedPathId) {
        await pathStore.updatePath(selectedPathId, values as ZUpdatePathDto);
        message.success('Поле обновлено');
      } else {
        const createDto = {
          ...(values as ZCreatePathDto),
          parent_id: nodeFormParentId || null,
        };
        await pathStore.createPath(createDto);
        message.success('Поле создано');
      }
      setNodeFormOpen(false);
      setSelectedPathId(null);
      setNodeFormParentId(null);
    } catch (error) {
      handleBlueprintNodeError(error);
    }
  };

  const handleCenter = () => {
    reactFlowInstanceRef.current?.fitView();
  };

  const handleAutoLayout = () => {
    reactFlowInstanceRef.current?.fitView();
  };

  const handleZoomIn = () => {
    reactFlowInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    reactFlowInstanceRef.current?.zoomOut();
  };

  const handleResetZoom = () => {
    reactFlowInstanceRef.current?.setViewport({ x: 0, y: 0, zoom: 1 });
  };

  if (!blueprintId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className="hover:text-foreground cursor-pointer transition-colors"
                onClick={() => navigate(PageUrl.Blueprints)}
              >
                Blueprint
              </span>
              <span>/</span>
              <span
                className="hover:text-foreground cursor-pointer transition-colors"
                onClick={() =>
                  navigate(buildUrl(PageUrl.BlueprintsEdit, { id: String(blueprintId) }))
                }
              >
                Редактирование
              </span>
              <span>/</span>
              <span className="text-foreground">Схема</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card className="mt-4">
          <GraphControls
            onCenter={handleCenter}
            onAutoLayout={handleAutoLayout}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
          />
          <div className="h-[600px]">
            <PathGraphEditor
              store={pathStore}
              onNodeSelect={handleNodeSelect}
              onNodeDoubleClick={handleNodeDoubleClick}
              onNodeContextMenu={handleNodeContextMenu}
              onPaneContextMenu={handlePaneContextMenu}
              highlightedNodes={selectedPathId ? [selectedPathId] : []}
              reactFlowInstanceRef={reactFlowInstanceRef}
            />
          </div>
        </Card>
        <NodeFormModal
          open={nodeFormOpen}
          onCancel={() => {
            setNodeFormOpen(false);
            setSelectedPathId(null);
            setNodeFormParentId(null);
          }}
          onOk={handleNodeSave}
          mode={nodeFormMode}
          parentPath={
            nodeFormParentId ? findPathInTree(pathStore.paths, nodeFormParentId) : undefined
          }
          isReadonly={
            nodeFormMode === 'edit' && selectedPathId
              ? findPathInTree(pathStore.paths, selectedPathId)?.is_readonly || false
              : false
          }
          sourceBlueprint={
            nodeFormMode === 'edit' && selectedPathId
              ? findPathInTree(pathStore.paths, selectedPathId)?.source_blueprint || undefined
              : undefined
          }
          embeddableBlueprints={embedStore.embeddableBlueprints}
          loading={pathStore.pending || embedStore.pending}
        />
        {contextMenuNodeId && contextMenuPosition && (
          <PathContextMenu
            pathId={contextMenuNodeId}
            position={contextMenuPosition}
            onClose={handleCloseContextMenu}
            onEdit={() => {
              setSelectedPathId(contextMenuNodeId);
              setNodeFormMode('edit');
              setNodeFormOpen(true);
              handleCloseContextMenu();
            }}
            onAddChild={() => handleAddChildNode(contextMenuNodeId)}
            onEmbed={() => handleEmbedBlueprint(contextMenuNodeId)}
            onDelete={() => handleDeleteNode(contextMenuNodeId)}
            pathStore={pathStore}
          />
        )}
        {emptyAreaContextMenuPosition && (
          <EmptyAreaContextMenu
            position={emptyAreaContextMenuPosition}
            onClose={handleCloseEmptyAreaContextMenu}
            onAddRoot={handleAddRootNode}
            onEmbedRoot={handleEmbedRootNode}
          />
        )}
      </div>
    </div>
  );
});
