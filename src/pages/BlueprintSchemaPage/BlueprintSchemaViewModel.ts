import { makeAutoObservable } from 'mobx';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import { findPathInTree } from '@/utils/pathUtils';
import { PathStore } from './PathStore';
import { BlueprintEmbedStore } from './BlueprintEmbedStore';
import { onError } from '@/utils/onError';

export type NodeFormMode = 'create' | 'edit' | 'embed';

export type ContextMenuPosition = { x: number; y: number };

/**
 * Контекст контекстного меню узла.
 * Содержит информацию о выбранном узле и позиции меню.
 */
export type NodeMenuCtx = {
  /** ID узла, для которого открыто контекстное меню. `null` если меню закрыто. */
  nodeId: number | null;
  /** Позиция контекстного меню узла. `null` если меню закрыто. */
  position: ContextMenuPosition | null;
};

type LoadingState = {
  init: boolean;
  action: boolean;
};

export class BlueprintSchemaViewModel {
  blueprintId: number | null = null;

  selectedPathId: number | null = null;
  nodeFormOpen = false;
  nodeFormMode: NodeFormMode = 'create';
  nodeFormParentId: number | null = null;

  ctx: NodeMenuCtx = {
    nodeId: null,
    position: null,
  };

  loading: LoadingState = { init: false, action: false };

  readonly pathStore: PathStore = new PathStore();
  readonly embedStore: BlueprintEmbedStore = new BlueprintEmbedStore();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get paths() {
    return this.pathStore.paths;
  }

  get embeds() {
    return this.embedStore.embeds;
  }

  get pending() {
    return (
      this.loading.init || this.loading.action || this.pathStore.pending || this.embedStore.pending
    );
  }

  get selectedPath() {
    if (!this.selectedPathId) return undefined;
    return findPathInTree(this.paths, this.selectedPathId);
  }

  get highlightedNodes() {
    return this.selectedPathId ? [this.selectedPathId] : [];
  }

  get nodeFormParentPath() {
    if (this.nodeFormParentId == null) return undefined;
    const parent = findPathInTree(this.paths, this.nodeFormParentId);
    if (!parent) return undefined;
    return { id: parent.id, full_path: parent.full_path };
  }

  async init(blueprintId: number) {
    if (this.blueprintId === blueprintId && this.paths.length) return;
    this.setBlueprintId(blueprintId);
    this.setLoadingInit(true);
    try {
      await Promise.all([
        this.pathStore.loadPaths(blueprintId),
        this.embedStore.loadEmbeddable(blueprintId),
        this.embedStore.loadEmbeds(blueprintId),
      ]);
    } finally {
      this.setLoadingInit(false);
    }
  }

  setSelectedPathId(pathId: number | null) {
    this.selectedPathId = pathId;
  }

  setBlueprintId(blueprintId: number | null) {
    this.blueprintId = blueprintId;
  }

  setLoadingInit(value: boolean) {
    this.loading.init = value;
  }

  setLoadingAction(value: boolean) {
    this.loading.action = value;
  }

  setNodeForm(open: boolean, mode: NodeFormMode, parentId: number | null) {
    this.nodeFormOpen = open;
    this.nodeFormMode = mode;
    this.nodeFormParentId = parentId;
  }

  closeNodeForm() {
    this.setNodeForm(false, 'create', null);
    this.setSelectedPathId(null);
  }

  handleNodeContextMenu(pathId: number, position: ContextMenuPosition) {
    this.setSelectedPathId(pathId);
    this.ctx.nodeId = pathId;
    this.ctx.position = position;
  }

  closeContextMenu() {
    this.ctx.nodeId = null;
    this.ctx.position = null;
  }

  handlePaneContextMenu(position: ContextMenuPosition) {
    this.ctx.nodeId = null;
    this.ctx.position = position;
  }

  selectNode(pathId: number) {
    this.setSelectedPathId(pathId);
  }

  openEditForm(pathId: number) {
    this.setSelectedPathId(pathId);
    this.setNodeForm(true, 'edit', null);
  }

  openAddRootForm() {
    this.setNodeForm(true, 'create', null);
    this.closeContextMenu();
  }

  openAddChildForm(parentId: number): boolean {
    const parentPath = findPathInTree(this.paths, parentId);
    if (parentPath && parentPath.data_type === 'json') {
      this.setNodeForm(true, 'create', parentId);
      this.closeContextMenu();
      return true;
    }
    return false;
  }

  openEmbedForm(parentId: number | null): boolean {
    if (parentId !== null) {
      const parentPath = findPathInTree(this.paths, parentId);
      if (!parentPath || parentPath.data_type !== 'json') return false;
    }
    this.setNodeForm(true, 'embed', parentId);
    this.closeContextMenu();
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

  async saveNode(values: ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number }) {
    if (!this.blueprintId) return;
    this.setLoadingAction(true);
    try {
      if (this.nodeFormMode === 'embed') {
        const embedDto = {
          embedded_blueprint_id: (values as { embedded_blueprint_id: number })
            .embedded_blueprint_id,
          host_path_id: this.nodeFormParentId || undefined,
        };
        await this.embedStore.createEmbed(embedDto);
        await this.pathStore.loadPaths(this.blueprintId);
      } else if (this.nodeFormMode === 'edit' && this.selectedPathId) {
        await this.pathStore.updatePath(this.selectedPathId, values as ZUpdatePathDto);
        await this.pathStore.loadPaths(this.blueprintId);
      } else {
        const createDto = {
          ...(values as ZCreatePathDto),
          parent_id: this.nodeFormParentId || null,
        };
        await this.pathStore.createPath(createDto);
      }
      this.closeNodeForm();
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.setLoadingAction(false);
    }
  }
}
