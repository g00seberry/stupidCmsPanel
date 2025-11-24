import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef } from 'react';
import { Card, message, App } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import type { ReactFlowInstance } from 'reactflow';
import { PathGraphEditor } from '@/components/paths/PathGraphEditor';
import { GraphControls } from '@/components/paths/GraphControls';
import { NodeFormModal } from '@/components/paths/NodeFormModal';
import { PathContextMenu } from '@/components/paths/PathContextMenu';
import { EmptyAreaContextMenu } from '@/components/paths/EmptyAreaContextMenu';
import { EmbedList } from '@/components/embeds/EmbedList';
import { PathStore } from '@/pages/BlueprintSchemaPage/PathStore';
import { BlueprintEmbedStore } from '@/pages/BlueprintSchemaPage/BlueprintEmbedStore';
import { BlueprintSchemaPageStore } from '@/pages/BlueprintSchemaPage/BlueprintSchemaPageStore';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import type { ZEditComponent } from '@/components/schemaForm/componentDefs/ZComponent';
import { buildUrl, PageUrl } from '@/PageUrl';
import { handleBlueprintNodeError } from '@/utils/blueprintErrorHandler';

/**
 * Страница редактирования схемы Blueprint.
 * Позволяет визуально редактировать структуру данных Blueprint через граф путей.
 */
export const BlueprintSchemaPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

  const blueprintId = id ? Number(id) : null;
  const { modal } = App.useApp();

  const pathStore = useMemo(() => new PathStore(), []);
  const embedStore = useMemo(() => new BlueprintEmbedStore(), []);
  const pageStore = useMemo(
    () => new BlueprintSchemaPageStore(pathStore, embedStore),
    [pathStore, embedStore]
  );

  // Загрузка blueprint, путей, встраиваний и formConfig при монтировании
  useEffect(() => {
    if (blueprintId) {
      void pathStore.loadPaths(blueprintId);
      void embedStore.loadEmbeddable(blueprintId);
      void embedStore.loadEmbeds(blueprintId);
      void pageStore.loadBlueprintData(blueprintId);
    }
  }, [blueprintId, pathStore, embedStore, pageStore]);

  const handleNodeSelect = (pathId: number) => {
    pageStore.selectNode(pathId);
  };

  const handleNodeDoubleClick = (pathId: number) => {
    pageStore.openEditForm(pathId);
  };

  const handleNodeContextMenu = (pathId: number, event: React.MouseEvent) => {
    event.preventDefault();
    pageStore.handleNodeContextMenu(pathId, { x: event.clientX, y: event.clientY });
  };

  const handlePaneContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    pageStore.handlePaneContextMenu({ x: event.clientX, y: event.clientY });
  };

  const handleAddChildNode = (parentId: number) => {
    if (!pageStore.openAddChildForm(parentId)) {
      message.warning('Дочерние узлы можно добавлять только к полям типа JSON');
    }
  };

  const handleEmbedBlueprint = (parentId: number) => {
    if (!pageStore.openEmbedForm(parentId)) {
      message.warning('Встраивание возможно только в поля типа JSON');
    }
  };

  const handleDeleteNode = async (pathId: number) => {
    const path = pageStore.getPathById(pathId);
    if (!path) return;

    if (!pageStore.canDeleteNode(pathId)) {
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
          pageStore.setSelectedPathId(null);
        } catch (error) {
          handleBlueprintNodeError(error);
        }
      },
    });
    pageStore.closeContextMenu();
  };

  const handleDeleteEmbed = async (embedId: number) => {
    if (!blueprintId) return;

    modal.confirm({
      title: 'Удалить встраивание?',
      content:
        'Все встроенные поля будут удалены, и все данные в этих полях будут потеряны. Это действие нельзя отменить.',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await embedStore.deleteEmbed(embedId);
          await pathStore.loadPaths(blueprintId);
          message.success('Встраивание удалено');
        } catch (error) {
          handleBlueprintNodeError(error);
        }
      },
    });
  };

  const handleAddRootNode = () => {
    pageStore.openAddRootForm();
  };

  const handleEmbedRootNode = () => {
    pageStore.openEmbedForm(null);
  };

  const handleNodeSave = async (
    values: ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number },
    formComponentConfig?: ZEditComponent
  ) => {
    if (!blueprintId) return;

    try {
      await pageStore.saveNode(blueprintId, values, formComponentConfig);
      if (pageStore.nodeFormMode === 'embed') {
        message.success('Blueprint встроен');
      } else if (pageStore.nodeFormMode === 'edit') {
        message.success('Поле обновлено');
      } else {
        message.success('Поле создано');
      }
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
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
                  highlightedNodes={pageStore.selectedPathId ? [pageStore.selectedPathId] : []}
                  reactFlowInstanceRef={reactFlowInstanceRef}
                />
              </div>
            </Card>
          </div>
          <div>
            <Card className="mt-4" title="Встраивания">
              <EmbedList store={embedStore} onUnembed={handleDeleteEmbed} />
            </Card>
          </div>
        </div>
        <NodeFormModal
          open={pageStore.nodeFormOpen}
          onCancel={() => {
            pageStore.closeNodeForm();
          }}
          onOk={handleNodeSave}
          mode={pageStore.nodeFormMode}
          parentPath={pageStore.getPathById(pageStore.nodeFormParentId)}
          isReadonly={
            pageStore.nodeFormMode === 'edit' && pageStore.selectedPathId
              ? pageStore.getPathById(pageStore.selectedPathId)?.is_readonly || false
              : false
          }
          sourceBlueprint={
            pageStore.nodeFormMode === 'edit' && pageStore.selectedPathId
              ? pageStore.getPathById(pageStore.selectedPathId)?.source_blueprint || undefined
              : undefined
          }
          embeddableBlueprints={embedStore.embeddableBlueprints}
          loading={pathStore.pending || embedStore.pending || pageStore.pending}
          fullPath={
            pageStore.nodeFormMode === 'edit' && pageStore.selectedPathId
              ? pageStore.getPathById(pageStore.selectedPathId)?.full_path
              : undefined
          }
          formComponentConfig={
            pageStore.nodeFormMode === 'edit' && pageStore.selectedPathId
              ? pageStore.getFormComponentConfig(pageStore.selectedPathId)
              : undefined
          }
          dataType={
            pageStore.nodeFormMode === 'edit' && pageStore.selectedPathId
              ? pageStore.getPathById(pageStore.selectedPathId)?.data_type
              : undefined
          }
          cardinality={
            pageStore.nodeFormMode === 'edit' && pageStore.selectedPathId
              ? pageStore.getPathById(pageStore.selectedPathId)?.cardinality
              : undefined
          }
        />
        {pageStore.contextMenuNodeId && pageStore.contextMenuPosition && (
          <PathContextMenu
            pathId={pageStore.contextMenuNodeId}
            position={pageStore.contextMenuPosition}
            onClose={() => {
              pageStore.closeContextMenu();
            }}
            onEdit={() => {
              pageStore.openEditForm(pageStore.contextMenuNodeId!);
              pageStore.closeContextMenu();
            }}
            onAddChild={() => handleAddChildNode(pageStore.contextMenuNodeId!)}
            onEmbed={() => handleEmbedBlueprint(pageStore.contextMenuNodeId!)}
            onDelete={() => handleDeleteNode(pageStore.contextMenuNodeId!)}
            pathStore={pathStore}
          />
        )}
        {pageStore.emptyAreaContextMenuPosition && (
          <EmptyAreaContextMenu
            position={pageStore.emptyAreaContextMenuPosition}
            onClose={() => {
              pageStore.closeEmptyAreaContextMenu();
            }}
            onAddRoot={handleAddRootNode}
            onEmbedRoot={handleEmbedRootNode}
          />
        )}
      </div>
    </div>
  );
});
