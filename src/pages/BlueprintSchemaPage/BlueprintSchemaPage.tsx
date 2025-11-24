import { EmbedList } from '@/components/embeds/EmbedList';
import { EmptyAreaContextMenu } from '@/components/paths/EmptyAreaContextMenu';
import { GraphControls } from '@/components/paths/GraphControls';
import { NodeFormModal } from '@/components/paths/NodeFormModal';
import { PathContextMenu } from '@/components/paths/PathContextMenu';
import { PathGraphEditor } from '@/components/paths/PathGraphEditor';
import type { ZEditComponent } from '@/components/schemaForm/componentDefs/ZComponent';
import { BlueprintSchemaViewModel } from '@/pages/BlueprintSchemaPage/BlueprintSchemaViewModel';
import { buildUrl, PageUrl } from '@/PageUrl';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import { handleBlueprintNodeError } from '@/utils/blueprintErrorHandler';
import { App, Card, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ReactFlowInstance } from 'reactflow';

/**
 * Страница редактирования схемы Blueprint.
 * Позволяет визуально редактировать структуру данных Blueprint через граф путей.
 */
export const BlueprintSchemaPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const blueprintId = id ? Number(id) : null;
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);
  const { modal } = App.useApp();
  const pageStore = useMemo(() => new BlueprintSchemaViewModel(), []);
  const { pathStore, embedStore } = pageStore;
  const selectedPath = pageStore.selectedPath;

  // Загрузка blueprint, путей, встраиваний и formConfig при монтировании
  useEffect(() => {
    if (blueprintId) {
      void pageStore.init(blueprintId);
    }
  }, [blueprintId, pageStore]);

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
    try {
      await pageStore.saveNode(values, formComponentConfig);
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

  const nodeFormInitialValues = useMemo(() => {
    if (pageStore.nodeFormMode === 'edit' && selectedPath) {
      return {
        name: selectedPath.name,
        data_type: selectedPath.data_type,
        cardinality: selectedPath.cardinality,
        is_required: selectedPath.is_required,
        is_indexed: selectedPath.is_indexed,
      } as Partial<ZCreatePathDto | ZUpdatePathDto>;
    }

    if (pageStore.nodeFormMode === 'create') {
      return {
        cardinality: 'one',
        is_required: false,
        is_indexed: false,
      } as Partial<ZCreatePathDto>;
    }

    return undefined;
  }, [pageStore.nodeFormMode, selectedPath]);

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
                  highlightedNodes={pageStore.highlightedNodes}
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
          parentPath={pageStore.nodeFormParentPath}
          isReadonly={
            pageStore.nodeFormMode === 'edit' ? selectedPath?.is_readonly || false : false
          }
          sourceBlueprint={
            pageStore.nodeFormMode === 'edit'
              ? (selectedPath?.source_blueprint ?? undefined)
              : undefined
          }
          embeddableBlueprints={embedStore.embeddableBlueprints}
          loading={pageStore.pending}
          fullPath={pageStore.nodeFormMode === 'edit' ? selectedPath?.full_path : undefined}
          formComponentConfig={
            pageStore.nodeFormMode === 'edit' ? pageStore.nodeFormComponentConfig : undefined
          }
          dataType={pageStore.nodeFormMode === 'edit' ? pageStore.nodeFormDataType : undefined}
          cardinality={
            pageStore.nodeFormMode === 'edit' ? pageStore.nodeFormCardinality : undefined
          }
          initialValues={nodeFormInitialValues}
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
