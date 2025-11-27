import { EmbedList } from '@/components/embeds/EmbedList';
import { ContextMenu } from '@/components/paths/ContextMenu';
import { EmbedForm } from '@/pages/BlueprintSchemaPage/EmbedForm';
import { GraphControls } from '@/components/paths/GraphControls';
import { NodeFormModal } from '@/components/paths/NodeFormModal';
import { PathGraphEditor } from '@/components/paths/PathGraphEditor';
import { BlueprintSchemaViewModel } from '@/pages/BlueprintSchemaPage/BlueprintSchemaViewModel';
import { buildUrl, PageUrl } from '@/PageUrl';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import { App, Card, Modal } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ReactFlowInstance } from 'reactflow';
import { onError } from '@/utils/onError';

/**
 * Страница редактирования схемы Blueprint.
 * Позволяет визуально редактировать структуру данных Blueprint через граф путей.
 */
export const BlueprintSchemaPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const blueprintId = id ? Number(id) : null;
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);
  const { modal, message } = App.useApp();
  const pageStore = useMemo(() => new BlueprintSchemaViewModel(), []);
  const { pathStore, embedStore } = pageStore;

  // Загрузка blueprint, путей и встраиваний при монтировании
  useEffect(() => {
    if (blueprintId) {
      void pageStore.init(blueprintId);
    }
  }, [blueprintId, pageStore]);

  const handleNodeContextMenu = (pathId: number, event: React.MouseEvent) => {
    event.preventDefault();
    pageStore.handleNodeContextMenu(pathId, { x: event.clientX, y: event.clientY });
  };

  const handlePaneContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    pageStore.handlePaneContextMenu({ x: event.clientX, y: event.clientY });
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
          onError(error);
        }
      },
    });
  };

  const handleNodeSave = async (values: ZCreatePathDto | ZUpdatePathDto) => {
    try {
      await pageStore.saveNode(values);
      message.success(pageStore.getSuccessMessage());
    } catch (error) {
      onError(error);
    }
  };

  const handleEmbedSave = (values: { embedded_blueprint_id: number }) => {
    void pageStore.saveEmbed(values);
  };

  const handleFitView = () => {
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
                onCenter={handleFitView}
                onAutoLayout={handleFitView}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetZoom={handleResetZoom}
              />
              <div className="h-[600px]">
                <PathGraphEditor
                  store={pathStore}
                  onNodeSelect={pageStore.selectNode}
                  onNodeDoubleClick={pageStore.openEditForm}
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
          open={pageStore.modeOpen === 'node'}
          onCancel={pageStore.closeNodeForm}
          onOk={handleNodeSave}
          mode={pageStore.nodeFormMode === 'edit' ? 'edit' : 'create'}
          parentPath={pageStore.nodeFormParentPath}
          isReadonly={
            pageStore.nodeFormMode === 'edit' ? pageStore.selectedPath?.is_readonly || false : false
          }
          sourceBlueprint={
            pageStore.nodeFormMode === 'edit'
              ? (pageStore.selectedPath?.source_blueprint ?? undefined)
              : undefined
          }
          loading={pageStore.pending}
          fullPath={
            pageStore.nodeFormMode === 'edit' ? pageStore.selectedPath?.full_path : undefined
          }
          initialValues={pageStore.getNodeFormInitialValues()}
        />
        {pageStore.modeOpen === 'embed' && (
          <Modal open onCancel={pageStore.closeNodeForm} footer={null} width={600} forceRender>
            <EmbedForm
              embeddableBlueprints={embedStore.embeddableBlueprints}
              onOk={handleEmbedSave}
              onCancel={() => pageStore.closeNodeForm()}
              loading={pageStore.pending}
            />
          </Modal>
        )}
        {pageStore.ctx.position ? <ContextMenu pageStore={pageStore} /> : null}
      </div>
    </div>
  );
});
