import { makeAutoObservable } from 'mobx';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import { findPathInTree } from '@/utils/pathUtils';
import { PathStore } from './PathStore';
import { BlueprintEmbedStore } from './BlueprintEmbedStore';
import { NodeFormState } from './NodeFormState';
import { ContextMenuState } from './ContextMenuState';
import { SelectionState } from './SelectionState';
import { onError } from '@/utils/onError';

export type NodeFormMode = 'create' | 'edit' | 'embed';

type LoadingState = {
  init: boolean;
  action: boolean;
};

export class BlueprintSchemaViewModel {
  blueprintId: number | null = null;
  loading: LoadingState = { init: false, action: false };

  readonly pathStore: PathStore = new PathStore();
  readonly embedStore: BlueprintEmbedStore = new BlueprintEmbedStore();
  readonly nodeFormState: NodeFormState = new NodeFormState();
  readonly contextMenuState: ContextMenuState = new ContextMenuState();
  readonly selectionState: SelectionState = new SelectionState();

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
    if (!this.selectionState.selectedPathId) return undefined;
    return findPathInTree(this.paths, this.selectionState.selectedPathId);
  }

  get highlightedNodes() {
    return this.selectionState.selectedPathId ? [this.selectionState.selectedPathId] : [];
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
    if (this.blueprintId === blueprintId && this.paths.length) return;
    this.blueprintId = blueprintId;
    this.loading.init = true;
    try {
      await Promise.all([
        this.pathStore.loadPaths(blueprintId),
        this.embedStore.loadEmbeddable(blueprintId),
        this.embedStore.loadEmbeds(blueprintId),
      ]);
    } finally {
      this.loading.init = false;
    }
  }

  closeNodeForm() {
    this.nodeFormState.close();
    this.selectionState.clear();
  }

  handleNodeContextMenu(pathId: number, position: { x: number; y: number }) {
    this.selectionState.select(pathId);
    this.contextMenuState.openForNode(pathId, position);
  }

  closeContextMenu() {
    this.contextMenuState.close();
  }

  handlePaneContextMenu(position: { x: number; y: number }) {
    this.contextMenuState.openForPane(position);
  }

  selectNode(pathId: number) {
    this.selectionState.select(pathId);
  }

  openEditForm(pathId: number) {
    this.selectionState.select(pathId);
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
    if (this.nodeFormState.mode === 'embed') return 'Blueprint встроен';
    if (this.nodeFormState.mode === 'edit') return 'Поле обновлено';
    return 'Поле создано';
  }

  async saveNode(values: ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number }) {
    if (!this.blueprintId) return;
    this.loading.action = true;
    try {
      if (this.nodeFormState.mode === 'embed') {
        await this.saveEmbedNode(values as { embedded_blueprint_id: number });
      } else if (this.nodeFormState.mode === 'edit') {
        await this.saveEditNode(values as ZUpdatePathDto);
      } else {
        await this.saveCreateNode(values as ZCreatePathDto);
      }
      this.closeNodeForm();
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.loading.action = false;
    }
  }

  private async saveEmbedNode(values: { embedded_blueprint_id: number }) {
    const embedDto = {
      embedded_blueprint_id: values.embedded_blueprint_id,
      host_path_id: this.nodeFormState.parentId || undefined,
    };
    await this.embedStore.createEmbed(embedDto);
    await this.pathStore.loadPaths(this.blueprintId!);
  }

  private async saveEditNode(values: ZUpdatePathDto) {
    if (!this.selectionState.selectedPathId) return;
    await this.pathStore.updatePath(this.selectionState.selectedPathId, values);
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
