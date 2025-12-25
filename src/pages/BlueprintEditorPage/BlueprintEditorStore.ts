import { notificationService } from '@/services/notificationService';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';
import { BlueprintEmbedStore } from './stores/BlueprintEmbedStore';
import { BlueprintStore } from './stores/BlueprintStore';
import { PathStore } from './stores/PathStore';

export type ContextMenuPosition = { x: number; y: number };

export type NodeMenuCtx = {
  nodeId: ZId | null;
  position: ContextMenuPosition | null;
};

export class BlueprintEditorStore {
  modalMode: 'node' | 'embed' | 'ctx' | null = null;

  ctx: NodeMenuCtx = {
    nodeId: null,
    position: null,
  };

  constructor(
    readonly pathStore: PathStore,
    readonly embedStore: BlueprintEmbedStore,
    readonly blueprintStore: BlueprintStore
  ) {
    this.init();
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

  setCtx(ctx: NodeMenuCtx) {
    this.ctx = ctx;
  }

  setModalMode(mode: 'node' | 'embed' | 'ctx' | null) {
    this.modalMode = mode;
  }

  clearContext() {
    this.setCtx({ nodeId: null, position: null });
  }

  closeModal() {
    this.setModalMode(null);
    this.clearContext();
  }

  async saveEmbed(values: { embedded_blueprint_id: ZId }) {
    try {
      const embedDto = {
        embedded_blueprint_id: values.embedded_blueprint_id,
        host_path_id: this.ctx.nodeId ?? undefined,
      };
      await this.embedStore.createEmbed(embedDto);
      await this.init();
      this.closeModal();
      notificationService.showSuccess({
        message: 'Blueprint встроен',
      });
    } catch (error) {
      onError(error);
    }
  }

  async savePathNode(values: ZUpdatePathDto) {
    if (!this.ctx.nodeId) return;
    await this.pathStore.updatePath(this.ctx.nodeId, values);
    await this.pathStore.init();
  }

  async createPathNode(values: ZCreatePathDto) {
    const createDto = {
      ...values,
      parent_id: this.ctx.nodeId,
    };
    await this.pathStore.createPath(createDto);
  }
}
