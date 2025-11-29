import { makeAutoObservable } from 'mobx';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import { buildPathWayToRoot, findPathInTree } from '@/utils/pathUtils';
import { PathStore } from './PathStore';
import { BlueprintEmbedStore } from './BlueprintEmbedStore';

import { onError } from '@/utils/onError';
import { notificationService } from '@/services/notificationService';

export type ContextMenuPosition = { x: number; y: number };
export type NodeMenuCtx = {
  parentId: number | null;
  nodeId: number | null;
  position: ContextMenuPosition | null;
};

export class BlueprintSchemaViewModel {
  modalMode: 'node' | 'embed' | 'ctx' | null = null;
  blueprintId: number | null = null;
  loading = false;
  ctx: NodeMenuCtx = {
    parentId: null,
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
    // Если редактируем узел, показываем путь до него
    if (this.ctx.nodeId != null) {
      return buildPathWayToRoot(this.paths, this.ctx.nodeId);
    }
    // Если создаем дочерний узел, показываем путь до родителя
    if (this.ctx.parentId != null) {
      return buildPathWayToRoot(this.paths, this.ctx.parentId);
    }
    // Если создаем корневой узел, путь пустой
    return [];
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

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setCtx(ctx: NodeMenuCtx) {
    this.ctx = ctx;
  }

  setModalMode(mode: 'node' | 'embed' | 'ctx' | null) {
    this.modalMode = mode;
  }

  /**
   * Очищает контекст, сбрасывая все значения в null.
   */
  clearContext() {
    this.setCtx({ parentId: null, nodeId: null, position: null });
  }

  /**
   * Открывает контекстное меню на узле графа.
   * @param nodeId ID узла, на котором открывается меню.
   * @param position Позиция курсора для отображения меню.
   */
  openNodeContextMenu(nodeId: number, position: ContextMenuPosition) {
    this.setCtx({
      parentId: null,
      nodeId,
      position,
    });
    this.setModalMode('ctx');
  }

  /**
   * Открывает контекстное меню на пустой области графа.
   * @param position Позиция курсора для отображения меню.
   */
  openPaneContextMenu(position: ContextMenuPosition) {
    this.setCtx({
      parentId: null,
      nodeId: null,
      position,
    });
    this.setModalMode('ctx');
  }

  /**
   * Подготавливает контекст для создания дочернего узла.
   * @param parentId ID родительского узла, под которым будет создан дочерний узел.
   */
  prepareAddChild(parentId: number) {
    this.setCtx({
      parentId,
      nodeId: null,
      position: null,
    });
    this.setModalMode('node');
  }

  /**
   * Подготавливает контекст для встраивания Blueprint.
   * @param parentId ID родительского узла, под которым будет встроен Blueprint. Если null, то встраивается в корень.
   */
  prepareEmbed(parentId: number | null) {
    this.setCtx({
      parentId,
      nodeId: null,
      position: null,
    });
    this.setModalMode('embed');
  }

  /**
   * Открывает форму редактирования узла.
   * @param nodeId ID узла для редактирования.
   */
  openEditNodeForm(nodeId: number) {
    this.setCtx({
      parentId: null,
      nodeId,
      position: null,
    });
    this.setModalMode('node');
  }

  /**
   * Подготавливает контекст для создания корневого узла.
   */
  prepareCreateRootNode() {
    this.setCtx({
      parentId: null,
      nodeId: null,
      position: null,
    });
    this.setModalMode('node');
  }

  closeModal() {
    this.setModalMode(null);
    this.clearContext();
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
    this.setLoading(true);

    try {
      if (this.ctx.nodeId) {
        await this.saveEditNode(values as ZUpdatePathDto);
      } else {
        await this.saveCreateNode(values as ZCreatePathDto);
      }
      this.closeModal();
    } catch (error) {
      onError(error);
    } finally {
      this.setLoading(false);
    }
  }

  async saveEmbed(values: { embedded_blueprint_id: number }) {
    if (!this.blueprintId) return;
    this.setLoading(true);
    try {
      const embedDto = {
        embedded_blueprint_id: values.embedded_blueprint_id,
        host_path_id: this.ctx.parentId || undefined,
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
      this.setLoading(false);
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
      parent_id: this.ctx.parentId || null,
    };
    await this.pathStore.createPath(createDto);
  }
}
