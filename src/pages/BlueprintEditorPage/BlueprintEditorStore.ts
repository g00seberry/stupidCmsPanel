import { notificationService } from '@/services/notificationService';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';
import type { PathContextMenuContext } from './components/PathContextMenu';
import { BlueprintEmbedStore } from './stores/BlueprintEmbedStore';
import { BlueprintStore } from './stores/BlueprintStore';
import { PathStore } from './stores/PathStore';

export type EditCtx = { type: 'edit'; nodeId: ZId } | { type: 'create'; parentNodeId: ZId | null };

export class BlueprintEditorStore {
  menuContext: PathContextMenuContext = null;
  editContext: EditCtx | null = null;

  constructor(
    readonly pathStore: PathStore,
    readonly embedStore: BlueprintEmbedStore,
    readonly blueprintStore: BlueprintStore
  ) {
    makeAutoObservable(this);
  }

  private async init() {
    try {
      await Promise.all([
        this.blueprintStore.init(),
        this.pathStore.init(),
        this.embedStore.init(),
      ]);
    } catch (err) {
      onError(err);
    }
  }

  get paths() {
    return this.pathStore.paths;
  }

  get pending() {
    return this.pathStore.loading || this.embedStore.loading || this.blueprintStore.loading;
  }

  openNodeContextMenu(pathId: string, position: { x: number; y: number }) {
    this.menuContext = { type: 'node', pathId, position };
  }

  openPaneContextMenu(position: { x: number; y: number }) {
    this.menuContext = { type: 'pane', position };
  }

  closeContextMenu() {
    this.menuContext = null;
  }

  openNodeEdit(nodeId: ZId) {
    this.editContext = { nodeId, type: 'edit' };
  }

  openNodeCreate(parentNodeId: ZId | null) {
    this.editContext = { parentNodeId, type: 'create' };
  }

  closeEditorWindow() {
    this.editContext = null;
  }

  async saveEmbed(values: { embedded_blueprint_id: ZId }) {
    try {
      const hostPathId = this.menuContext?.type === 'node' ? this.menuContext.pathId : undefined;
      const embedDto = {
        embedded_blueprint_id: values.embedded_blueprint_id,
        host_path_id: hostPathId,
      };
      await this.embedStore.createEmbed(embedDto);
      await this.init();
      this.closeEditorWindow();
      notificationService.showSuccess({
        message: 'Blueprint встроен',
      });
    } catch (error) {
      onError(error);
    }
  }

  async savePathNode(values: ZUpdatePathDto) {
    if (this.editContext?.type !== 'edit') return;
    await this.pathStore.updatePath(this.editContext.nodeId, values);
    await this.pathStore.init();
  }

  async createPathNode(values: ZCreatePathDto) {
    if (this.editContext?.type !== 'create') return;
    await this.pathStore.createPath({
      ...values,
      parent_id: this.editContext.parentNodeId,
    });
  }
}
