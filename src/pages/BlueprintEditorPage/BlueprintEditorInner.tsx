import { DeleteButton } from '@/components/DeleteButton';
import { PageLayout } from '@/components/PageLayout';
import { BlueprintForm } from '@/pages/BlueprintEditorPage/BlueprintForm';
import { PageUrl } from '@/PageUrl';
import { notificationService } from '@/services/notificationService';
import type { ZUpdateBlueprintDto } from '@/types/blueprint';
import { onError } from '@/utils/onError';
import { Button, Form } from 'antd';
import { Save } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlueprintEditorStore } from './BlueprintEditorStore';
import { BlueprintPathsPanel } from './components/BlueprintPathsPanel';
import { NodeEditorDrawer } from './components/NodeEditorDrawer';
import { PathContextMenuContainer } from './components/PathContextMenuContainer';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';

type Props = {
  store: BlueprintEditorStore;
};

export const BlueprintEditorInner: React.FC<Props> = observer(({ store }) => {
  const {
    blueprintStore,
    blueprintStore: { currentBlueprint },
  } = store;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [pathForm] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(blueprintStore.currentBlueprint);
  }, [blueprintStore.currentBlueprint]);

  const handleDelete = useCallback(async () => {
    try {
      await blueprintStore.deleteBlueprint();
      notificationService.showSuccess({ message: 'Blueprint удалён' });
      navigate(PageUrl.Blueprints);
    } catch (error) {
      onError(error);
    }
  }, [blueprintStore, navigate]);

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      await blueprintStore.updateBlueprint(values as ZUpdateBlueprintDto);
      notificationService.showSuccess({ message: 'Blueprint сохранён' });
    } catch (error) {
      onError(error);
    }
  }, [blueprintStore, form]);

  // === Обработчики контекстного меню ===
  const handleNodeContextMenu = useCallback(
    (pathId: string, event: React.MouseEvent) => {
      store.openNodeContextMenu(pathId, { x: event.clientX, y: event.clientY });
    },
    [store]
  );

  const handlePaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      store.openPaneContextMenu({ x: event.clientX, y: event.clientY });
    },
    [store]
  );

  const handleNodeCancel = useCallback(() => {
    store.closeEditorWindow();
  }, [store]);

  const handleNodeSave = useCallback(
    async (values: ZCreatePathDto | ZUpdatePathDto) => {
      if (store.editContext?.type === 'edit') {
        await store.savePathNode(values as ZUpdatePathDto);
      } else if (store.editContext?.type === 'create') {
        await store.createPathNode(values as ZCreatePathDto);
      }
      await store.pathStore.init();
      store.closeEditorWindow();
    },
    [store]
  );

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Blueprints', onClick: () => navigate(PageUrl.Blueprints) },
        currentBlueprint?.name || '...',
      ]}
      extra={
        <>
          <DeleteButton
            onDelete={handleDelete}
            selectedCount={1}
            loading={blueprintStore.loading}
            itemName="Blueprint"
            buttonText="Удалить"
          />
          <Button type="primary" icon={<Save className="w-4 h-4" />} onClick={handleSave}>
            Сохранить
          </Button>
        </>
      }
      loading={blueprintStore.loading}
    >
      <BlueprintForm form={form} isEditMode={true} />
      <BlueprintPathsPanel
        paths={store.paths}
        pending={store.pending}
        onNodeContextMenu={handleNodeContextMenu}
        onPaneContextMenu={handlePaneContextMenu}
      />
      <PathContextMenuContainer store={store} />
      {store.editContext && (
        <NodeEditorDrawer
          loading={store.pending}
          editContext={store.editContext}
          pathForm={pathForm}
          paths={store.pathStore.paths}
          onCancel={handleNodeCancel}
          onSave={handleNodeSave}
        />
      )}
    </PageLayout>
  );
});
