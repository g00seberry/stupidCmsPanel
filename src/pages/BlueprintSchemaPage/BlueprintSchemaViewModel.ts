import { makeAutoObservable } from 'mobx';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import { buildPathWayToRoot, findPathInTree } from '@/utils/pathUtils';
import { PathStore } from './PathStore';
import { BlueprintEmbedStore } from './BlueprintEmbedStore';

import { onError } from '@/utils/onError';
import { notificationService } from '@/services/notificationService';

export type ContextMenuPosition = { x: number; y: number };
export type NodeMenuCtx = {
  nodeId: number | null;
  position: ContextMenuPosition | null;
};

export class BlueprintSchemaViewModel {
  modalMode: 'node' | 'embed' | 'ctx' | null = null;
  blueprintId: number | null = null;
  loading = false;
  ctx: NodeMenuCtx = {
    nodeId: null,
    position: null,
  };

  readonly pathStore: PathStore = new PathStore();
  readonly embedStore: BlueprintEmbedStore = new BlueprintEmbedStore();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get paths() {
    return this.pathStore.paths;
  }

  get pending() {
    return this.loading || this.pathStore.pending || this.embedStore.pending;
  }

  get selectedPath() {
    if (!this.ctx.nodeId) return undefined;
    return findPathInTree(this.paths, this.ctx.nodeId);
  }

  get highlightedNodes() {
    return this.ctx.nodeId ? [this.ctx.nodeId] : [];
  }

  get nodeFormParentPath() {
    if (this.ctx.nodeId == null) return [];
    return buildPathWayToRoot(this.paths, this.ctx.nodeId);
  }

  async init(blueprintId: number) {
    this.blueprintId = blueprintId;
    this.loading = true;
    try {
      await Promise.all([
        this.pathStore.loadPaths(blueprintId),
        this.embedStore.loadEmbeddable(blueprintId),
        this.embedStore.loadEmbeds(blueprintId),
      ]);
    } finally {
      this.loading = false;
    }
  }

  setCtx(ctx: NodeMenuCtx) {
    this.ctx = ctx;
  }

  setModalMode(mode: 'node' | 'embed' | 'ctx' | null) {
    this.modalMode = mode;
  }

  closeModal() {
    this.setModalMode(null);
    this.setCtx({ nodeId: null, position: null });
  }

  openAddChildForm(parentId: number): boolean {
    const parentPath = findPathInTree(this.paths, parentId);
    if (parentPath && parentPath.data_type === 'json') {
      return true;
    }
    return false;
  }

  openEmbedForm(parentId: number | null): boolean {
    if (parentId !== null) {
      const parentPath = findPathInTree(this.paths, parentId);
      if (!parentPath || parentPath.data_type !== 'json') return false;
    }

    return true;
  }

  canDeleteNode(pathId: number): boolean {
    const path = findPathInTree(this.paths, pathId);
    return path ? !path.is_readonly : false;
  }

  getPathById(pathId: number | null) {
    if (!pathId) return undefined;
    return findPathInTree(this.paths, pathId);
  }

  getNodeFormInitialValues(): Partial<ZCreatePathDto | ZUpdatePathDto> | undefined {
    if (this.selectedPath) {
      return {
        name: this.selectedPath.name,
        data_type: this.selectedPath.data_type,
        cardinality: this.selectedPath.cardinality,
        is_indexed: this.selectedPath.is_indexed,
        validation_rules: this.selectedPath.validation_rules ?? undefined,
      };
    }
    return {
      cardinality: 'one',
      is_indexed: false,
    };
  }

  getSuccessMessage(): string {
    if (this.ctx.nodeId) return 'Поле обновлено';
    return 'Поле создано';
  }

  async saveNode(values: ZCreatePathDto | ZUpdatePathDto) {
    if (!this.blueprintId) return;
    this.loading = true;
    try {
      if (this.ctx.nodeId) {
        await this.saveEditNode(values as ZUpdatePathDto);
      } else {
        await this.saveCreateNode(values as ZCreatePathDto);
      }
      this.closeModal();
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  async saveEmbed(values: { embedded_blueprint_id: number }) {
    if (!this.blueprintId) return;
    this.loading = true;
    try {
      const embedDto = {
        embedded_blueprint_id: values.embedded_blueprint_id,
        host_path_id: this.ctx.nodeId || undefined,
      };
      await this.embedStore.createEmbed(embedDto);
      await this.init(this.blueprintId);
      this.closeModal();
      notificationService.showSuccess({
        message: 'Blueprint встроен',
      });
    } catch (error) {
      onError(error);
    } finally {
      this.loading = false;
    }
  }

  private async saveEditNode(values: ZUpdatePathDto) {
    if (!this.ctx.nodeId) return;
    await this.pathStore.updatePath(this.ctx.nodeId, values);
    await this.pathStore.loadPaths(this.blueprintId!);
  }

  private async saveCreateNode(values: ZCreatePathDto) {
    const createDto = {
      ...values,
      parent_id: this.ctx.nodeId || null,
    };
    await this.pathStore.createPath(createDto);
  }
}
