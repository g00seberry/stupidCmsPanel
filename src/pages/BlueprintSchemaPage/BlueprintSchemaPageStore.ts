import { makeAutoObservable, runInAction } from 'mobx';
import type { ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import type { ZEditComponent } from '@/components/schemaForm/componentDefs/ZComponent';
import { findPathInTree } from '@/utils/pathUtils';
import { getBlueprint } from '@/api/blueprintApi';
import { getFormConfig, saveFormConfig } from '@/api/apiFormConfig';
import { onError } from '@/utils/onError';
import type { PathStore } from './PathStore';
import type { BlueprintEmbedStore } from './BlueprintEmbedStore';

/**
 * Режим работы формы узла.
 */
export type NodeFormMode = 'create' | 'edit' | 'embed';

/**
 * Позиция контекстного меню.
 */
export type ContextMenuPosition = { x: number; y: number };

/**
 * Store для управления состоянием страницы редактирования схемы Blueprint.
 * Обеспечивает управление UI-состоянием, загрузку данных и бизнес-логику работы со схемой.
 */
export class BlueprintSchemaPageStore {
  /** Идентификатор выбранного пути. */
  selectedPathId: number | null = null;
  /** Флаг открытия формы узла. */
  nodeFormOpen = false;
  /** Режим работы формы узла. */
  nodeFormMode: NodeFormMode = 'create';
  /** Идентификатор родительского узла для формы. */
  nodeFormParentId: number | null = null;
  /** Идентификатор узла для контекстного меню. */
  contextMenuNodeId: number | null = null;
  /** Позиция контекстного меню узла. */
  contextMenuPosition: ContextMenuPosition | null = null;
  /** Позиция контекстного меню пустой области. */
  emptyAreaContextMenuPosition: ContextMenuPosition | null = null;
  /** Slug типа записи для загрузки formConfig. */
  postTypeSlug: string | null = null;
  /** Конфигурация компонентов формы. */
  formConfig: Record<string, ZEditComponent> = {};
  /** Флаг загрузки данных. */
  pending = false;

  constructor(
    private readonly pathStore: PathStore,
    private readonly embedStore: BlueprintEmbedStore
  ) {
    makeAutoObservable(this);
  }

  /**
   * Установить идентификатор выбранного пути.
   * @param pathId Идентификатор пути или `null` для сброса выбора.
   */
  setSelectedPathId(pathId: number | null): void {
    this.selectedPathId = pathId;
  }

  /**
   * Установить состояние открытия формы узла.
   * @param open Флаг открытия формы.
   */
  setNodeFormOpen(open: boolean): void {
    this.nodeFormOpen = open;
  }

  /**
   * Установить режим работы формы узла.
   * @param mode Режим работы формы.
   */
  setNodeFormMode(mode: NodeFormMode): void {
    this.nodeFormMode = mode;
  }

  /**
   * Установить идентификатор родительского узла для формы.
   * @param parentId Идентификатор родительского узла или `null`.
   */
  setNodeFormParentId(parentId: number | null): void {
    this.nodeFormParentId = parentId;
  }

  /**
   * Установить состояние контекстного меню узла.
   * @param nodeId Идентификатор узла или `null`.
   * @param position Позиция меню или `null`.
   */
  setContextMenu(nodeId: number | null, position: ContextMenuPosition | null): void {
    this.contextMenuNodeId = nodeId;
    this.contextMenuPosition = position;
  }

  /**
   * Закрыть контекстное меню узла.
   */
  closeContextMenu(): void {
    this.setContextMenu(null, null);
  }

  /**
   * Установить позицию контекстного меню пустой области.
   * @param position Позиция меню или `null`.
   */
  setEmptyAreaContextMenuPosition(position: ContextMenuPosition | null): void {
    this.emptyAreaContextMenuPosition = position;
  }

  /**
   * Закрыть контекстное меню пустой области.
   */
  closeEmptyAreaContextMenu(): void {
    this.setEmptyAreaContextMenuPosition(null);
  }

  /**
   * Загрузить данные Blueprint и formConfig.
   * @param blueprintId Идентификатор Blueprint.
   */
  async loadBlueprintData(blueprintId: number): Promise<void> {
    runInAction(() => {
      this.pending = true;
    });
    try {
      const blueprint = await getBlueprint(blueprintId);
      if (blueprint.post_types && blueprint.post_types.length > 0) {
        const slug = blueprint.post_types[0].slug;
        runInAction(() => {
          this.postTypeSlug = slug;
        });
        try {
          const config = await getFormConfig(slug, blueprintId);
          runInAction(() => {
            this.formConfig = config;
          });
        } catch (error) {
          runInAction(() => {
            this.formConfig = {};
          });
        }
      }
    } catch (error) {
      onError(error);
    } finally {
      runInAction(() => {
        this.pending = false;
      });
    }
  }

  /**
   * Выбрать узел.
   * @param pathId Идентификатор пути.
   */
  selectNode(pathId: number): void {
    this.setSelectedPathId(pathId);
  }

  /**
   * Открыть форму редактирования узла.
   * @param pathId Идентификатор пути для редактирования.
   */
  openEditForm(pathId: number): void {
    this.setSelectedPathId(pathId);
    this.setNodeFormMode('edit');
    this.setNodeFormOpen(true);
  }

  /**
   * Обработать контекстное меню узла.
   * @param pathId Идентификатор пути.
   * @param position Позиция курсора.
   */
  handleNodeContextMenu(pathId: number, position: ContextMenuPosition): void {
    this.setSelectedPathId(pathId);
    this.setContextMenu(pathId, position);
    this.setEmptyAreaContextMenuPosition(null);
  }

  /**
   * Обработать контекстное меню пустой области.
   * @param position Позиция курсора.
   */
  handlePaneContextMenu(position: ContextMenuPosition): void {
    this.setEmptyAreaContextMenuPosition(position);
    this.closeContextMenu();
  }

  /**
   * Открыть форму добавления дочернего узла.
   * @param parentId Идентификатор родительского узла.
   * @returns `true`, если форма открыта, `false` если операция невозможна.
   */
  openAddChildForm(parentId: number): boolean {
    const parentPath = findPathInTree(this.pathStore.paths, parentId);
    if (parentPath && parentPath.data_type === 'json') {
      this.setNodeFormMode('create');
      this.setNodeFormParentId(parentId);
      this.setNodeFormOpen(true);
      this.closeContextMenu();
      return true;
    }
    return false;
  }

  /**
   * Открыть форму встраивания Blueprint.
   * @param parentId Идентификатор родительского узла или `null` для корня.
   * @returns `true`, если форма открыта, `false` если операция невозможна.
   */
  openEmbedForm(parentId: number | null): boolean {
    if (parentId !== null) {
      const parentPath = findPathInTree(this.pathStore.paths, parentId);
      if (parentPath && parentPath.data_type === 'json') {
        this.setNodeFormMode('embed');
        this.setNodeFormParentId(parentId);
        this.setNodeFormOpen(true);
        this.closeContextMenu();
        return true;
      }
      return false;
    } else {
      this.setNodeFormMode('embed');
      this.setNodeFormParentId(null);
      this.setNodeFormOpen(true);
      this.closeEmptyAreaContextMenu();
      return true;
    }
  }

  /**
   * Открыть форму добавления корневого узла.
   */
  openAddRootForm(): void {
    this.setNodeFormMode('create');
    this.setNodeFormParentId(null);
    this.setNodeFormOpen(true);
    this.closeEmptyAreaContextMenu();
  }

  /**
   * Закрыть форму узла и сбросить связанное состояние.
   */
  closeNodeForm(): void {
    this.setNodeFormOpen(false);
    this.setSelectedPathId(null);
    this.setNodeFormParentId(null);
  }

  /**
   * Проверить, можно ли удалить узел.
   * @param pathId Идентификатор пути.
   * @returns `true`, если узел можно удалить, `false` если он readonly.
   */
  canDeleteNode(pathId: number): boolean {
    const path = findPathInTree(this.pathStore.paths, pathId);
    return path ? !path.is_readonly : false;
  }

  /**
   * Сохранить узел (создать, обновить или встроить).
   * @param blueprintId Идентификатор Blueprint.
   * @param values Данные для сохранения.
   * @param formComponentConfig Опциональная конфигурация компонента формы.
   */
  async saveNode(
    blueprintId: number,
    values: ZCreatePathDto | ZUpdatePathDto | { embedded_blueprint_id: number },
    formComponentConfig?: ZEditComponent
  ): Promise<void> {
    if (this.nodeFormMode === 'embed') {
      const embedDto = {
        embedded_blueprint_id: (values as { embedded_blueprint_id: number }).embedded_blueprint_id,
        host_path_id: this.nodeFormParentId || undefined,
      };
      await this.embedStore.createEmbed(embedDto);
      await this.pathStore.loadPaths(blueprintId);
    } else if (this.nodeFormMode === 'edit' && this.selectedPathId) {
      await this.pathStore.updatePath(this.selectedPathId, values as ZUpdatePathDto);
      await this.pathStore.loadPaths(blueprintId);

      if (this.postTypeSlug) {
        const path = findPathInTree(this.pathStore.paths, this.selectedPathId);
        if (path) {
          const updatedConfig = { ...this.formConfig };
          if (formComponentConfig) {
            updatedConfig[path.full_path] = formComponentConfig;
          } else {
            delete updatedConfig[path.full_path];
          }
          try {
            await saveFormConfig(this.postTypeSlug, blueprintId, updatedConfig);
            runInAction(() => {
              this.formConfig = updatedConfig;
            });
          } catch (error) {
            onError(error);
          }
        }
      }
    } else {
      const createDto = {
        ...(values as ZCreatePathDto),
        parent_id: this.nodeFormParentId || null,
      };
      await this.pathStore.createPath(createDto);
    }
    this.closeNodeForm();
  }

  /**
   * Получить путь по идентификатору.
   * @param pathId Идентификатор пути.
   * @returns Найденный путь или `undefined`.
   */
  getPathById(pathId: number | null): ReturnType<typeof findPathInTree> {
    if (!pathId) return undefined;
    return findPathInTree(this.pathStore.paths, pathId);
  }

  /**
   * Получить конфигурацию компонента формы для пути.
   * @param pathId Идентификатор пути.
   * @returns Конфигурация компонента или `undefined`.
   */
  getFormComponentConfig(pathId: number | null): ZEditComponent | undefined {
    if (!pathId) return undefined;
    const path = this.getPathById(pathId);
    return path ? this.formConfig[path.full_path] : undefined;
  }
}

