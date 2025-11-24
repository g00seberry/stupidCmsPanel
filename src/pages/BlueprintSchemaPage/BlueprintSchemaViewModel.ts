import { makeAutoObservable } from 'mobx';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import type { ZEditComponent } from '@/components/schemaForm/componentDefs/ZComponent';
import { findPathInTree } from '@/utils/pathUtils';
import { getBlueprint } from '@/api/blueprintApi';
import { getFormConfig, saveFormConfig } from '@/api/apiFormConfig';
import { onError } from '@/utils/onError';
import { PathStore } from './PathStore';
import { BlueprintEmbedStore } from './BlueprintEmbedStore';

export type NodeFormMode = 'create' | 'edit' | 'embed';

export type ContextMenuPosition = { x: number; y: number };

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

  contextMenuNodeId: number | null = null;
  contextMenuPosition: ContextMenuPosition | null = null;
  emptyAreaContextMenuPosition: ContextMenuPosition | null = null;

  postTypeSlug: string | null = null;
  formConfig: Record<string, ZEditComponent> = {};

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

  get nodeFormComponentConfig(): ZEditComponent | undefined {
    if (this.nodeFormMode !== 'edit' || !this.selectedPathId) return undefined;
    const fullPath = this.selectedPath?.full_path;
    if (!fullPath) return undefined;
    return this.formConfig[fullPath];
  }

  get nodeFormDataType() {
    if (this.nodeFormMode !== 'edit' || !this.selectedPathId) return undefined;
    return this.selectedPath?.data_type;
  }

  get nodeFormCardinality() {
    if (this.nodeFormMode !== 'edit' || !this.selectedPathId) return undefined;
    return this.selectedPath?.cardinality;
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
        this.loadBlueprintMeta(blueprintId),
      ]);
    } finally {
      this.setLoadingInit(false);
    }
  }

  async loadBlueprintMeta(blueprintId: number) {
    try {
      const blueprint = await getBlueprint(blueprintId);
      if (blueprint.post_types && blueprint.post_types.length > 0) {
        const slug = blueprint.post_types[0].slug;
        this.setPostTypeSlug(slug);
        try {
          const config = await getFormConfig(slug, blueprintId);
          this.setFormConfig(config);
        } catch {
          this.setFormConfig({});
        }
      }
    } catch (error) {
      onError(error);
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

  setPostTypeSlug(slug: string | null) {
    this.postTypeSlug = slug;
  }

  setFormConfig(config: Record<string, ZEditComponent>) {
    this.formConfig = config;
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
    this.contextMenuNodeId = pathId;
    this.contextMenuPosition = position;
    this.emptyAreaContextMenuPosition = null;
  }

  closeContextMenu() {
    this.contextMenuNodeId = null;
    this.contextMenuPosition = null;
  }

  handlePaneContextMenu(position: ContextMenuPosition) {
    this.emptyAreaContextMenuPosition = position;
    this.closeContextMenu();
  }

  closeEmptyAreaContextMenu() {
    this.emptyAreaContextMenuPosition = null;
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
    this.closeEmptyAreaContextMenu();
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
    if (parentId === null) {
      this.closeEmptyAreaContextMenu();
    } else {
      this.closeContextMenu();
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

  async saveNode(
    values: ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number },
    formComponentConfig?: ZEditComponent
  ) {
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
        await this.persistFormConfig(formComponentConfig);
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

  private async persistFormConfig(formComponentConfig?: ZEditComponent) {
    if (!this.postTypeSlug || !this.blueprintId || !this.selectedPath) return;
    const updatedConfig = { ...this.formConfig };
    const fullPath = this.selectedPath.full_path;
    if (formComponentConfig) {
      updatedConfig[fullPath] = formComponentConfig;
    } else {
      delete updatedConfig[fullPath];
    }

    try {
      await saveFormConfig(this.postTypeSlug, this.blueprintId, updatedConfig);
      this.setFormConfig(updatedConfig);
    } catch (error) {
      onError(error);
    }
  }
}
