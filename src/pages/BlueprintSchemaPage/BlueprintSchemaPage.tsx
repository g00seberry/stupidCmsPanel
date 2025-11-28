import { EmbedList } from '@/components/embeds/EmbedList';
import { ContextMenu } from '@/components/paths/ContextMenu';
import { EmbedForm } from '@/pages/BlueprintSchemaPage/EmbedForm';
import { GraphControls } from '@/components/paths/GraphControls';
import { NodeForm } from '@/components/paths/NodeForm';
import { ValidationRulesForm } from '@/components/paths/ValidationRulesForm';
import { PathGraphEditor } from '@/components/paths/PathGraphEditor';
import { BlueprintSchemaViewModel } from '@/pages/BlueprintSchemaPage/BlueprintSchemaViewModel';
import { buildUrl, PageUrl } from '@/PageUrl';
import type { ZCreatePathDto, ZUpdatePathDto, ZDataType } from '@/types/path';
import { zCreatePathDto, zUpdatePathDto } from '@/types/path';
import { App, Card, Modal, Form, Tabs, Button, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ReactFlowInstance } from 'reactflow';
import { onError } from '@/utils/onError';
import { normalizeValidationRulesForApi } from '@/utils/validationRules';
import { setFormValidationErrors } from '@/utils/blueprintFormErrors';
import { normalizeFormInitialValues, buildFullPath } from '@/components/paths/utils/nodeFormUtils';
import type { AxiosError } from 'axios';

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

  const [nodeForm] = Form.useForm<ZCreatePathDto | ZUpdatePathDto>();
  const [displayedFullPath, setDisplayedFullPath] = useState<string | undefined>();

  const dataType = Form.useWatch<ZDataType | undefined>('data_type', nodeForm);
  const cardinality = Form.useWatch<'one' | 'many' | undefined>('cardinality', nodeForm);
  const showValidationTab = dataType !== 'json';

  const mode = pageStore.nodeFormMode === 'edit' ? 'edit' : 'create';
  const isReadonly =
    pageStore.nodeFormMode === 'edit' ? pageStore.selectedPath?.is_readonly || false : false;
  const sourceBlueprint =
    pageStore.nodeFormMode === 'edit'
      ? (pageStore.selectedPath?.source_blueprint ?? undefined)
      : undefined;
  const fullPath =
    pageStore.nodeFormMode === 'edit' ? pageStore.selectedPath?.full_path : undefined;
  const parentPath = pageStore.nodeFormParentPath;
  const initialValues = pageStore.getNodeFormInitialValues();
  const normalizedInitialValues = normalizeFormInitialValues(initialValues, mode);

  useEffect(() => {
    if (pageStore.modeOpen !== 'node') return;
    nodeForm.resetFields();
    nodeForm.setFieldsValue(normalizedInitialValues);
    const pathToDisplay =
      mode === 'edit'
        ? fullPath
        : buildFullPath((normalizedInitialValues as Partial<ZCreatePathDto>).name, parentPath);
    setDisplayedFullPath(pathToDisplay);
  }, [fullPath, mode, nodeForm, normalizedInitialValues, parentPath, pageStore.modeOpen]);

  const handleNameChange = (name: string) => {
    setDisplayedFullPath(buildFullPath(name, parentPath));
  };

  const handleNodeSave = async () => {
    try {
      const values = await nodeForm.validateFields();
      const pathValues = values as ZCreatePathDto | ZUpdatePathDto;
      const normalizedValues = {
        ...pathValues,
        validation_rules: normalizeValidationRulesForApi(pathValues.validation_rules),
      };
      const validatedValues =
        mode === 'edit'
          ? zUpdatePathDto.parse(normalizedValues)
          : zCreatePathDto.parse(normalizedValues);
      await pageStore.saveNode(validatedValues);
      message.success(pageStore.getSuccessMessage());
      nodeForm.resetFields();
      setDisplayedFullPath(mode === 'edit' ? fullPath : undefined);
    } catch (error: any) {
      if (error?.errorFields) return;
      if (error && typeof error === 'object' && 'response' in error) {
        if (setFormValidationErrors(error as AxiosError, nodeForm)) return;
      }
      onError(error);
    }
  };

  const handleNodeCancel = () => {
    nodeForm.resetFields();
    setDisplayedFullPath(mode === 'edit' ? fullPath : undefined);
    pageStore.closeNodeForm();
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
        {pageStore.modeOpen === 'node' && (
          <Modal
            open
            onCancel={handleNodeCancel}
            footer={null}
            width={600}
            forceRender
            title={mode === 'edit' ? 'Редактирование поля' : 'Создание поля'}
          >
            <Tabs
              items={[
                {
                  key: 'basic',
                  label: 'Основное',
                  children: (
                    <NodeForm
                      form={nodeForm as FormInstance<ZCreatePathDto | ZUpdatePathDto>}
                      mode={mode}
                      parentPath={parentPath}
                      computedFullPath={displayedFullPath}
                      isReadonly={isReadonly}
                      sourceBlueprint={sourceBlueprint}
                      onNameChange={handleNameChange}
                    />
                  ),
                },
                ...(showValidationTab
                  ? [
                      {
                        key: 'validation',
                        label: 'Валидация',
                        children: (
                          <ValidationRulesForm
                            form={nodeForm}
                            dataType={dataType}
                            cardinality={cardinality}
                            isReadonly={isReadonly}
                          />
                        ),
                      },
                    ]
                  : []),
              ]}
            />
            <div className="mt-6 flex justify-end">
              <Space>
                <Button onClick={handleNodeCancel}>Отмена</Button>
                <Button
                  type="primary"
                  loading={pageStore.pending}
                  onClick={() => {
                    void handleNodeSave();
                  }}
                  disabled={isReadonly && mode === 'edit'}
                >
                  {mode === 'edit' ? 'Сохранить' : 'Создать'}
                </Button>
              </Space>
            </div>
          </Modal>
        )}
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
