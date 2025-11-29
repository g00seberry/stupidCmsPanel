import { EmbedList } from '@/components/embeds/EmbedList';
import { ContextMenu } from '@/components/paths/ContextMenu';
import { EmbedForm } from '@/pages/BlueprintSchemaPage/EmbedForm';
import { GraphControls } from '@/components/paths/GraphControls';
import { NodeFormTabs } from '@/components/paths/NodeFormTabs';
import { PathGraphEditor } from '@/components/paths/PathGraphEditor';
import { BlueprintSchemaViewModel } from '@/pages/BlueprintSchemaPage/BlueprintSchemaViewModel';
import { buildUrl, PageUrl } from '@/PageUrl';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import { zCreatePathDto, zUpdatePathDto } from '@/types/path';
import { App, Card, Drawer, Modal } from 'antd';
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
    pageStore.openNodeContextMenu(pathId, { x: event.clientX, y: event.clientY });
  };

  const handlePaneContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    pageStore.openPaneContextMenu({ x: event.clientX, y: event.clientY });
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

  const mode = pageStore.ctx.nodeId ? 'edit' : 'create';
  const isReadonly = pageStore.selectedPath?.is_readonly || false;
  const sourceBlueprint = pageStore.selectedPath?.source_blueprint ?? undefined;
  const wayToRoot = pageStore.nodeFormParentPath;
  const initialValues = pageStore.getNodeFormInitialValues();

  const handleNodeOk = async (values: ZCreatePathDto | ZUpdatePathDto) => {
    try {
      const validatedValues =
        mode === 'edit' ? zUpdatePathDto.parse(values) : zCreatePathDto.parse(values);
      await pageStore.saveNode(validatedValues);
      message.success(pageStore.getSuccessMessage());
    } catch (error: any) {
      if (error?.errorFields) {
        throw error;
      }
      onError(error);
      throw error;
    }
  };

  const handleNodeCancel = () => {
    pageStore.closeModal();
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
        {pageStore.modalMode === 'node' && (
          <Drawer
            open
            onClose={handleNodeCancel}
            width="80%"
            title={mode === 'edit' ? 'Редактирование поля' : 'Создание поля'}
          >
            <NodeFormTabs
              disabled={isReadonly}
              mode={mode}
              wayToRoot={wayToRoot}
              sourceBlueprint={sourceBlueprint}
              initialValues={initialValues}
              onOk={handleNodeOk}
              onCancel={handleNodeCancel}
              loading={pageStore.pending}
            />
          </Drawer>
        )}
        {pageStore.modalMode === 'embed' && (
          <Modal open onCancel={pageStore.closeModal} footer={null} width={600} forceRender>
            <EmbedForm
              embeddableBlueprints={embedStore.embeddableBlueprints}
              onOk={handleEmbedSave}
              onCancel={() => pageStore.closeModal()}
              loading={pageStore.pending}
            />
          </Modal>
        )}
        {pageStore.modalMode === 'ctx' && <ContextMenu pageStore={pageStore} />}
      </div>
    </div>
  );
});
