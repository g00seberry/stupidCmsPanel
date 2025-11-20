import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Button, Card, Form, Tabs, message, App, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Plus, Edit, Trash2 } from 'lucide-react';
import type { ReactFlowInstance } from 'reactflow';
import { BlueprintForm } from '@/components/blueprints/BlueprintForm';
import { PathGraphEditor } from '@/components/paths/PathGraphEditor';
import { GraphControls } from '@/components/paths/GraphControls';
import { NodeFormModal } from '@/components/paths/NodeFormModal';
import { EmbedList, EmbedForm } from '@/components/embeds';
import { DependencyGraph } from '@/components/blueprints/DependencyGraph';
import { BlueprintStore } from '@/stores/BlueprintStore';
import { PathStore } from '@/stores/PathStore';
import { BlueprintEmbedStore } from '@/stores/BlueprintEmbedStore';
import type {
  ZCreateBlueprintDto,
  ZUpdateBlueprintDto,
  ZBlueprintDependencies,
} from '@/types/blueprint';
import type { ZCreatePathDto, ZUpdatePathDto, ZPathTreeNode } from '@/types/path';
import { buildUrl, PageUrl } from '@/PageUrl';
import { onError } from '@/utils/onError';
import { setFormValidationErrors } from '@/utils/blueprintFormErrors';
import {
  handleCyclicDependencyError,
  handlePathConflictError,
  handleReadonlyFieldError,
} from '@/utils/blueprintErrors';

/**
 * Найти путь в дереве по ID.
 */
const findPathInTree = (paths: ZPathTreeNode[], pathId: number): ZPathTreeNode | undefined => {
  for (const path of paths) {
    if (path.id === pathId) return path;
    if (path.children) {
      const found = findPathInTree(path.children, pathId);
      if (found) return found;
    }
  }
  return undefined;
};

/**
 * Пропсы компонента контекстного меню для узла графа.
 */
type PropsContextMenu = {
  /** Идентификатор узла. */
  pathId: number;
  /** Позиция меню на экране. */
  position: { x: number; y: number };
  /** Обработчик закрытия меню. */
  onClose: () => void;
  /** Обработчик редактирования узла. */
  onEdit: () => void;
  /** Обработчик добавления дочернего узла. */
  onAddChild: () => void;
  /** Обработчик встраивания Blueprint. */
  onEmbed: () => void;
  /** Обработчик удаления узла. */
  onDelete: () => void;
  /** Store для получения информации о пути. */
  pathStore: PathStore;
};

/**
 * Контекстное меню для узла графа.
 */
const ContextMenu: React.FC<PropsContextMenu> = ({
  pathId,
  position,
  onClose,
  onEdit,
  onAddChild,
  onEmbed,
  onDelete,
  pathStore,
}) => {
  const path = findPathInTree(pathStore.paths, pathId);
  const canAddChild = path?.data_type === 'json' && !path.is_readonly;
  const canEdit = !path?.is_readonly;
  const canDelete = !path?.is_readonly;

  // Обработчик клика, который закрывает меню только если клик был вне меню
  useEffect(() => {
    const menuElement = document.getElementById(`context-menu-${pathId}`);
    if (!menuElement) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuElement && !menuElement.contains(target)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Небольшая задержка, чтобы не закрыть меню сразу после открытия
    const timeout = setTimeout(() => {
      // Используем click без capture phase, чтобы onClick пунктов меню успел выполниться
      window.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 200);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, pathId]);

  const menuItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Редактировать',
      icon: <Edit className="w-4 h-4" />,
      onClick: onEdit,
      disabled: !canEdit,
    },
    {
      key: 'addChild',
      label: 'Добавить дочерний узел',
      icon: <Plus className="w-4 h-4" />,
      onClick: onAddChild,
      disabled: !canAddChild,
    },
    {
      key: 'embed',
      label: 'Встроить Blueprint',
      icon: <Plus className="w-4 h-4" />,
      onClick: onEmbed,
      disabled: !canAddChild,
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'Удалить',
      icon: <Trash2 className="w-4 h-4" />,
      danger: true,
      onClick: onDelete,
      disabled: !canDelete,
    },
  ];

  return (
    <div
      id={`context-menu-${pathId}`}
      className="fixed z-50 bg-white border rounded shadow-lg"
      style={{ left: position.x, top: position.y, minWidth: '200px' }}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      onContextMenu={e => {
        e.preventDefault();
        onClose();
      }}
    >
      <Menu items={menuItems} selectable={false} />
    </div>
  );
};

/**
 * Обёртка для EmbedForm с формой.
 */
const EmbedFormWrapper: React.FC<{
  embedStore: BlueprintEmbedStore;
  pathStore: PathStore;
}> = ({ embedStore, pathStore }) => {
  const [form] = Form.useForm<{ embedded_blueprint_id: number; host_path_id?: number }>();

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      await embedStore.createEmbed({
        embedded_blueprint_id: values.embedded_blueprint_id,
        host_path_id: values.host_path_id || undefined,
      });
      message.success('Встраивание добавлено');
      form.resetFields();
    } catch (error) {
      // Обработка специфичных ошибок Blueprint
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as Parameters<typeof handlePathConflictError>[0];
        const responseData = (error as { response?: { data?: { message?: string } } }).response
          ?.data;
        const errorMessage = responseData?.message || '';
        const lowerMessage = String(errorMessage).toLowerCase();

        if (lowerMessage.includes('цикл') || lowerMessage.includes('cyclic')) {
          message.error(handleCyclicDependencyError(axiosError));
        } else if (lowerMessage.includes('конфликт') || lowerMessage.includes('conflict')) {
          message.error(handlePathConflictError(axiosError));
        } else if (!setFormValidationErrors(axiosError, form)) {
          onError(error);
        }
      } else {
        onError(error);
      }
    }
  }, [form, embedStore]);

  return (
    <Card title="Добавить встраивание" size="small">
      <EmbedForm form={form} embedStore={embedStore} pathStore={pathStore} />
      <div className="mt-4">
        <Button type="primary" onClick={handleSubmit} loading={embedStore.pending}>
          Добавить
        </Button>
      </div>
    </Card>
  );
};

/**
 * Страница редактирования Blueprint.
 * Включает форму основной информации и вкладки для работы со схемой, встраиваниями и зависимостями.
 */
export const BlueprintEditorPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<ZCreateBlueprintDto | ZUpdateBlueprintDto>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [selectedPathId, setSelectedPathId] = useState<number | null>(null);
  const [nodeFormOpen, setNodeFormOpen] = useState(false);
  const [nodeFormMode, setNodeFormMode] = useState<'create' | 'edit' | 'embed'>('create');
  const [nodeFormParentId, setNodeFormParentId] = useState<number | null>(null);
  const [dependencies, setDependencies] = useState<ZBlueprintDependencies | null>(null);
  const [loadingDependencies, setLoadingDependencies] = useState(false);
  const [contextMenuNodeId, setContextMenuNodeId] = useState<number | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

  const isEditMode = id !== 'new' && id !== undefined;
  const blueprintId = isEditMode ? Number(id) : null;

  const blueprintStore = useMemo(() => new BlueprintStore(), []);
  const pathStore = useMemo(() => new PathStore(), []);
  const embedStore = useMemo(() => new BlueprintEmbedStore(), []);
  const { modal } = App.useApp();

  // Загрузка Blueprint при редактировании
  useEffect(() => {
    if (blueprintId) {
      void blueprintStore.loadBlueprint(blueprintId);
      void pathStore.loadPaths(blueprintId);
      void embedStore.loadEmbeds(blueprintId);
      void embedStore.loadEmbeddable(blueprintId);
      setLoadingDependencies(true);
      blueprintStore
        .loadDependencies(blueprintId)
        .then(deps => {
          setDependencies(deps);
        })
        .catch(() => {
          setDependencies(null);
        })
        .finally(() => {
          setLoadingDependencies(false);
        });
    }
  }, [blueprintId, blueprintStore, pathStore, embedStore]);

  // Синхронизация формы со стором
  useEffect(() => {
    if (blueprintStore.currentBlueprint) {
      form.setFieldsValue({
        name: blueprintStore.currentBlueprint.name,
        code: blueprintStore.currentBlueprint.code,
        description: blueprintStore.currentBlueprint.description ?? undefined,
      });
    }
  }, [blueprintStore.currentBlueprint, form]);

  /**
   * Сохраняет Blueprint (создание или обновление).
   */
  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      if (isEditMode && blueprintId) {
        await blueprintStore.updateBlueprint(blueprintId, values as ZUpdateBlueprintDto);
        message.success('Blueprint обновлён');
      } else {
        const newBlueprint = await blueprintStore.createBlueprint(values as ZCreateBlueprintDto);
        if (newBlueprint) {
          message.success('Blueprint создан');
          navigate(buildUrl(PageUrl.BlueprintsEdit, { id: String(newBlueprint.id) }), {
            replace: true,
          });
        }
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as Parameters<typeof setFormValidationErrors>[0];
        if (!setFormValidationErrors(axiosError, form)) {
          onError(error);
        }
      } else {
        onError(error);
      }
    }
  }, [form, isEditMode, blueprintId, blueprintStore, navigate]);

  /**
   * Обработчик выбора узла в графе.
   */
  const handleNodeSelect = useCallback((pathId: number) => {
    setSelectedPathId(pathId);
  }, []);

  /**
   * Обработчик двойного клика на узел (открытие формы редактирования).
   */
  const handleNodeDoubleClick = useCallback((pathId: number) => {
    setSelectedPathId(pathId);
    setNodeFormMode('edit');
    setNodeFormOpen(true);
  }, []);

  /**
   * Обработчик контекстного меню на узле.
   */
  const handleNodeContextMenu = useCallback((pathId: number, event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedPathId(pathId);
    setContextMenuNodeId(pathId);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
  }, []);

  /**
   * Закрыть контекстное меню.
   */
  const handleCloseContextMenu = useCallback(() => {
    setContextMenuNodeId(null);
    setContextMenuPosition(null);
  }, []);

  /**
   * Обработчик добавления дочернего узла из контекстного меню.
   */
  const handleAddChildNode = useCallback(
    (parentId: number) => {
      const parentPath = findPathInTree(pathStore.paths, parentId);
      if (parentPath && parentPath.data_type === 'json') {
        setNodeFormMode('create');
        setNodeFormParentId(parentId);
        setNodeFormOpen(true);
        handleCloseContextMenu();
      } else {
        message.warning('Дочерние узлы можно добавлять только к полям типа JSON');
      }
    },
    [pathStore.paths, handleCloseContextMenu]
  );

  /**
   * Обработчик встраивания Blueprint из контекстного меню.
   */
  const handleEmbedBlueprint = useCallback(
    (parentId: number) => {
      const parentPath = findPathInTree(pathStore.paths, parentId);
      if (parentPath && parentPath.data_type === 'json') {
        setNodeFormMode('embed');
        setNodeFormParentId(parentId);
        setNodeFormOpen(true);
        handleCloseContextMenu();
      } else {
        message.warning('Встраивание возможно только в поля типа JSON');
      }
    },
    [pathStore.paths, handleCloseContextMenu]
  );

  /**
   * Обработчик удаления узла.
   */
  const handleDeleteNode = useCallback(
    async (pathId: number) => {
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
            onError(error);
          }
        },
      });
      handleCloseContextMenu();
    },
    [pathStore, handleCloseContextMenu]
  );

  /**
   * Обработчик добавления корневого узла.
   */
  const handleAddRootNode = useCallback(() => {
    setNodeFormMode('create');
    setNodeFormParentId(null);
    setNodeFormOpen(true);
  }, []);

  /**
   * Обработчик встраивания Blueprint в корень.
   */
  const handleEmbedRootNode = useCallback(() => {
    setNodeFormMode('embed');
    setNodeFormParentId(null);
    setNodeFormOpen(true);
  }, []);

  /**
   * Обработчик сохранения узла (создание, обновление или встраивание).
   */
  const handleNodeSave = useCallback(
    async (values: ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number }) => {
      if (!blueprintId) return;

      try {
        if (nodeFormMode === 'embed') {
          // Режим встраивания Blueprint
          const embedDto = {
            embedded_blueprint_id: (values as { embedded_blueprint_id: number })
              .embedded_blueprint_id,
            host_path_id: nodeFormParentId || undefined,
          };
          await embedStore.createEmbed(embedDto);
          // Перезагружаем пути после встраивания
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
        // Обработка специфичных ошибок Blueprint
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as Parameters<typeof handleReadonlyFieldError>[0];
          const responseData = (error as { response?: { data?: { message?: string } } }).response
            ?.data;
          const errorMessage = responseData?.message || '';
          const lowerMessage = String(errorMessage).toLowerCase();

          if (lowerMessage.includes('readonly') || lowerMessage.includes('скопированное')) {
            message.error(handleReadonlyFieldError(axiosError));
          } else if (lowerMessage.includes('конфликт') || lowerMessage.includes('уже существует')) {
            message.error(handlePathConflictError(axiosError));
          } else if (lowerMessage.includes('цикл') || lowerMessage.includes('cyclic')) {
            message.error(handleCyclicDependencyError(axiosError));
          } else {
            onError(error);
          }
        } else {
          onError(error);
        }
      }
    },
    [blueprintId, nodeFormMode, selectedPathId, nodeFormParentId, pathStore, embedStore]
  );

  /**
   * Обработчики управления графом.
   */
  const handleCenter = useCallback(() => {
    reactFlowInstanceRef.current?.fitView();
  }, []);

  const handleAutoLayout = useCallback(() => {
    // Автоматическая компоновка применяется автоматически при загрузке
    reactFlowInstanceRef.current?.fitView();
  }, []);

  const handleZoomIn = useCallback(() => {
    reactFlowInstanceRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    reactFlowInstanceRef.current?.zoomOut();
  }, []);

  const handleResetZoom = useCallback(() => {
    reactFlowInstanceRef.current?.setViewport({ x: 0, y: 0, zoom: 1 });
  }, []);

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
              <span className="text-foreground">
                {isEditMode
                  ? blueprintStore.currentBlueprint?.name || 'Редактирование'
                  : 'Создание'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button type="primary" icon={<Save className="w-4 h-4" />} onClick={handleSave}>
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card className="mb-6">
          <BlueprintForm
            form={form}
            initialValues={
              blueprintStore.currentBlueprint
                ? {
                    name: blueprintStore.currentBlueprint.name,
                    code: blueprintStore.currentBlueprint.code,
                    description: blueprintStore.currentBlueprint.description ?? undefined,
                  }
                : undefined
            }
            isEditMode={isEditMode}
          />
        </Card>

        {isEditMode && blueprintId && (
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'schema',
                label: 'Схема',
                children: (
                  <>
                    <Card className="mt-4">
                      <GraphControls
                        onAddRoot={handleAddRootNode}
                        onEmbedRoot={handleEmbedRootNode}
                        onCenter={handleCenter}
                        onAutoLayout={handleAutoLayout}
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                        onResetZoom={handleResetZoom}
                        onEmbedBlueprint={() => setActiveTab('embeds')}
                      />
                      <div className="h-[600px]">
                        <PathGraphEditor
                          store={pathStore}
                          onNodeSelect={handleNodeSelect}
                          onNodeDoubleClick={handleNodeDoubleClick}
                          onNodeContextMenu={handleNodeContextMenu}
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
                        nodeFormParentId
                          ? findPathInTree(pathStore.paths, nodeFormParentId)
                          : undefined
                      }
                      isReadonly={
                        nodeFormMode === 'edit' && selectedPathId
                          ? findPathInTree(pathStore.paths, selectedPathId)?.is_readonly || false
                          : false
                      }
                      sourceBlueprint={
                        nodeFormMode === 'edit' && selectedPathId
                          ? findPathInTree(pathStore.paths, selectedPathId)?.source_blueprint ||
                            undefined
                          : undefined
                      }
                      embeddableBlueprints={embedStore.embeddableBlueprints}
                      loading={pathStore.pending || embedStore.pending}
                    />
                    {contextMenuNodeId && contextMenuPosition && (
                      <ContextMenu
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
                  </>
                ),
              },
              {
                key: 'embeds',
                label: 'Встраивания',
                children: (
                  <Card className="mt-4">
                    <EmbedList
                      store={embedStore}
                      onDelete={useCallback(
                        async (id: number) => {
                          try {
                            await embedStore.deleteEmbed(id);
                            message.success('Встраивание удалено');
                          } catch (error) {
                            onError(error);
                          }
                        },
                        [embedStore]
                      )}
                      onShowInGraph={useCallback(
                        (embed: { embedded_blueprint_id: number; host_path_id: number | null }) => {
                          // Переключиться на вкладку схемы
                          setActiveTab('schema');
                          // Подсветить узлы встраивания в графе
                          const embedNodes = pathStore.paths
                            .flatMap(p => [p, ...(p.children || [])])
                            .filter(p => p.source_blueprint_id === embed.embedded_blueprint_id)
                            .map(p => p.id);
                          if (embedNodes.length > 0) {
                            // Выделить первый узел и центрировать граф
                            setSelectedPathId(embedNodes[0]);
                            setTimeout(() => {
                              reactFlowInstanceRef.current?.fitView();
                            }, 100);
                          }
                        },
                        [pathStore.paths]
                      )}
                    />
                    <div className="mt-4">
                      <EmbedFormWrapper embedStore={embedStore} pathStore={pathStore} />
                    </div>
                  </Card>
                ),
              },
              {
                key: 'dependencies',
                label: 'Зависимости',
                children: (
                  <Card className="mt-4">
                    <DependencyGraph
                      dependencies={dependencies}
                      loading={loadingDependencies}
                      getEditUrl={useCallback(
                        (id: number) => buildUrl(PageUrl.BlueprintsEdit, { id: String(id) }),
                        []
                      )}
                    />
                  </Card>
                ),
              },
            ]}
          />
        )}
      </div>
    </div>
  );
});
