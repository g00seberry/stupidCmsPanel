import { notificationService } from '@/services/notificationService';
import { onError } from '@/utils/onError';
import { findPathInTree } from '@/utils/pathUtils';
import { App } from 'antd';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import type { BlueprintEditorStore } from '../BlueprintEditorStore';
import { PathContextMenu } from './PathContextMenu';

export type PropsPathContextMenuContainer = {
  store: BlueprintEditorStore;
};

/**
 * Контейнер для контекстного меню paths.
 * Инкапсулирует логику permissions, actions и рендер PathContextMenu.
 */
export const PathContextMenuContainer: React.FC<PropsPathContextMenuContainer> = observer(
  ({ store }) => {
    const { modal, message } = App.useApp();

    // Вычисление permissions для выбранного path
    const selectedPath = useMemo(() => {
      if (store.menuContext?.type !== 'node') return null;
      return findPathInTree(store.paths, store.menuContext.pathId);
    }, [store.menuContext, store.paths]);

    const menuPermissions = useMemo(
      () => ({
        canEdit: !selectedPath?.blueprint_embed_id,
        canAddChild: selectedPath?.data_type === 'json' && !selectedPath?.blueprint_embed_id,
        canEmbed: selectedPath?.data_type === 'json' && !selectedPath?.blueprint_embed_id,
        canDelete: !selectedPath?.blueprint_embed_id,
      }),
      [selectedPath]
    );

    // Действия контекстного меню
    const menuActions = useMemo(
      () => ({
        onEdit: (pathId: string) => {
          store.openNodeEdit(pathId);
        },
        onAddChild: (pathId: string) => {
          store.openNodeCreate(pathId);
        },
        onEmbed: (pathId: string | null) => {
          message.info(`Встроить Blueprint в: ${pathId ?? 'корень'}`);
          // TODO: открыть форму выбора Blueprint для embed
          store.closeContextMenu();
        },
        onDelete: async (pathId: string) => {
          const pathToDelete = findPathInTree(store.paths, pathId);
          if (!pathToDelete) return;

          modal.confirm({
            title: 'Удалить поле?',
            content: `Вы уверены, что хотите удалить поле "${pathToDelete.name}"? Это действие нельзя отменить.`,
            okText: 'Удалить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk: async () => {
              try {
                await store.pathStore.deletePath(pathId);
                notificationService.showSuccess({ message: 'Поле удалено' });
              } catch (error) {
                onError(error);
              }
            },
          });
          store.closeContextMenu();
        },
        onAddRoot: () => {
          store.openNodeCreate(null);
        },
      }),
      [store, modal, message]
    );

    return (
      <PathContextMenu
        context={store.menuContext}
        actions={menuActions}
        permissions={menuPermissions}
        onClose={() => store.closeContextMenu()}
      />
    );
  }
);
