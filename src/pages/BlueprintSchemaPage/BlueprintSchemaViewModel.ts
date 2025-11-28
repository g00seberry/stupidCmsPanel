import { makeAutoObservable } from 'mobx';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import { findPathInTree } from '@/utils/pathUtils';
import { PathStore } from './PathStore';
import { BlueprintEmbedStore } from './BlueprintEmbedStore';
import { NodeFormState } from './NodeFormState';
import { ContextMenuState } from './ContextMenuState';
import { onError } from '@/utils/onError';
import { notificationService } from '@/services/notificationService';

export type NodeFormMode = 'create' | 'edit' | 'embed';

export class BlueprintSchemaViewModel {
  blueprintId: number | null = null;
  selectedPathId: number | null = null;
  loading = false;

  readonly pathStore: PathStore = new PathStore();
  readonly embedStore: BlueprintEmbedStore = new BlueprintEmbedStore();
  readonly nodeFormState: NodeFormState = new NodeFormState();
  readonly contextMenuState: ContextMenuState = new ContextMenuState();

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
    if (!this.selectedPathId) return undefined;
    return findPathInTree(this.paths, this.selectedPathId);
  }

  get highlightedNodes() {
    return this.selectedPathId ? [this.selectedPathId] : [];
  }

  get modeOpen() {
    return this.nodeFormState.modeOpen;
  }

  get nodeFormMode() {
    return this.nodeFormState.mode;
  }

  get nodeFormParentPath() {
    if (this.nodeFormState.parentId == null) return undefined;
    const parent = findPathInTree(this.paths, this.nodeFormState.parentId);
    if (!parent) return undefined;
    return { id: parent.id, full_path: parent.full_path };
  }

  get ctx() {
    return this.contextMenuState.ctx;
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

  setSelectedPathId(pathId: number | null) {
    this.selectedPathId = pathId;
  }

  closeNodeForm() {
    this.nodeFormState.close();
    this.setSelectedPathId(null);
  }

  handleNodeContextMenu(pathId: number, position: { x: number; y: number }) {
    this.setSelectedPathId(pathId);
    this.contextMenuState.openForNode(pathId, position);
  }

  closeContextMenu() {
    this.contextMenuState.close();
  }

  handlePaneContextMenu(position: { x: number; y: number }) {
    this.contextMenuState.openForPane(position);
  }

  selectNode(pathId: number) {
    this.setSelectedPathId(pathId);
  }

  openEditForm(pathId: number) {
    this.setSelectedPathId(pathId);
    this.nodeFormState.openForm('edit', null);
  }

  openAddRootForm() {
    this.nodeFormState.openForm('create', null);
    this.contextMenuState.close();
  }

  openAddChildForm(parentId: number): boolean {
    const parentPath = findPathInTree(this.paths, parentId);
    if (parentPath && parentPath.data_type === 'json') {
      this.nodeFormState.openForm('create', parentId);
      this.contextMenuState.close();
      return true;
    }
    return false;
  }

  openEmbedForm(parentId: number | null): boolean {
    if (parentId !== null) {
      const parentPath = findPathInTree(this.paths, parentId);
      if (!parentPath || parentPath.data_type !== 'json') return false;
    }
    this.nodeFormState.openForm('embed', parentId);
    this.contextMenuState.close();
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
    if (this.nodeFormState.mode === 'edit' && this.selectedPath) {
      return {
        name: this.selectedPath.name,
        data_type: this.selectedPath.data_type,
        cardinality: this.selectedPath.cardinality,
        is_indexed: this.selectedPath.is_indexed,
        validation_rules: this.selectedPath.validation_rules ?? undefined,
      };
    }

    if (this.nodeFormState.mode === 'create') {
      return {
        cardinality: 'one',
        is_indexed: false,
      };
    }

    return undefined;
  }

  getSuccessMessage(): string {
    if (this.nodeFormState.mode === 'edit') return 'Поле обновлено';
    return 'Поле создано';
  }

  async saveNode(values: ZCreatePathDto | ZUpdatePathDto) {
    if (!this.blueprintId) return;
    this.loading = true;
    try {
      if (this.nodeFormState.mode === 'edit') {
        await this.saveEditNode(values as ZUpdatePathDto);
      } else {
        await this.saveCreateNode(values as ZCreatePathDto);
      }
      this.closeNodeForm();
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
        host_path_id: this.nodeFormState.parentId || undefined,
      };
      await this.embedStore.createEmbed(embedDto);
      await this.init(this.blueprintId);
      this.closeNodeForm();
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
    if (!this.selectedPathId) return;
    await this.pathStore.updatePath(this.selectedPathId, values);
    await this.pathStore.loadPaths(this.blueprintId!);
  }

  private async saveCreateNode(values: ZCreatePathDto) {
    const createDto = {
      ...values,
      parent_id: this.nodeFormState.parentId || null,
    };
    await this.pathStore.createPath(createDto);
  }
}
