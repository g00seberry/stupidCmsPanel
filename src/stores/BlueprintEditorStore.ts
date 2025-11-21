import { makeAutoObservable, runInAction } from 'mobx';
import type {
  ZBlueprint,
  ZCreateBlueprintDto,
  ZUpdateBlueprintDto,
  ZCanDeleteBlueprint,
  ZBlueprintDependencies,
  ZEmbeddableBlueprints,
} from '@/types/blueprint';
import { onError } from '@/utils/onError';
import {
  getBlueprint,
  createBlueprint as createBlueprintApi,
  updateBlueprint as updateBlueprintApi,
  deleteBlueprint as deleteBlueprintApi,
  canDeleteBlueprint as canDeleteBlueprintApi,
  getBlueprintDependencies as getBlueprintDependenciesApi,
  getEmbeddableBlueprints as getEmbeddableBlueprintsApi,
} from '@/api/blueprintApi';

/**
 * Store для управления редактированием отдельного Blueprint.
 * Обеспечивает загрузку, создание, обновление и удаление Blueprint,
 * а также работу с зависимостями и встраиваниями.
 */
export class BlueprintEditorStore {
  /** Текущий редактируемый Blueprint с полной информацией. */
  currentBlueprint: ZBlueprint | null = null;

  /** Флаг выполнения запроса загрузки. */
  pending = false;
  /** Флаг выполнения запроса создания. */
  creating = false;
  /** Флаг выполнения запроса обновления. */
  updating = false;
  /** Флаг выполнения запроса удаления. */
  deleting = false;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Загрузить Blueprint по ID.
   * @param id Идентификатор Blueprint.
   */
  async loadBlueprint(id: number): Promise<void> {
    this.pending = true;
    try {
      const blueprint = await getBlueprint(id);
      runInAction(() => {
        this.currentBlueprint = blueprint;
      });
    } catch (error) {
      onError(error);
      runInAction(() => {
        this.currentBlueprint = null;
      });
    } finally {
      runInAction(() => {
        this.pending = false;
      });
    }
  }

  /**
   * Создать новый Blueprint.
   * @param dto Данные для создания Blueprint.
   * @returns Созданный Blueprint.
   */
  async createBlueprint(dto: ZCreateBlueprintDto): Promise<ZBlueprint> {
    this.creating = true;
    try {
      const blueprint = await createBlueprintApi(dto);
      runInAction(() => {
        this.currentBlueprint = blueprint;
      });
      return blueprint;
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      runInAction(() => {
        this.creating = false;
      });
    }
  }

  /**
   * Обновить Blueprint.
   * @param id Идентификатор Blueprint.
   * @param dto Данные для обновления.
   */
  async updateBlueprint(id: number, dto: ZUpdateBlueprintDto): Promise<void> {
    this.updating = true;
    try {
      const updated = await updateBlueprintApi(id, dto);
      runInAction(() => {
        this.currentBlueprint = updated;
      });
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      runInAction(() => {
        this.updating = false;
      });
    }
  }

  /**
   * Удалить Blueprint.
   * @param id Идентификатор Blueprint для удаления.
   */
  async deleteBlueprint(id: number): Promise<void> {
    this.deleting = true;
    try {
      await deleteBlueprintApi(id);
      runInAction(() => {
        if (this.currentBlueprint?.id === id) {
          this.currentBlueprint = null;
        }
      });
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      runInAction(() => {
        this.deleting = false;
      });
    }
  }

  /**
   * Проверить возможность удаления Blueprint.
   * @param id Идентификатор Blueprint.
   * @returns Результат проверки с флагом can_delete и списком причин.
   */
  async checkCanDelete(id: number): Promise<ZCanDeleteBlueprint> {
    try {
      return await canDeleteBlueprintApi(id);
    } catch (error) {
      onError(error);
      throw error;
    }
  }

  /**
   * Получить граф зависимостей Blueprint.
   * @param id Идентификатор Blueprint.
   * @returns Граф зависимостей (depends_on и depended_by).
   */
  async loadDependencies(id: number): Promise<ZBlueprintDependencies> {
    try {
      return await getBlueprintDependenciesApi(id);
    } catch (error) {
      onError(error);
      throw error;
    }
  }

  /**
   * Получить список Blueprint для безопасного встраивания.
   * @param id Идентификатор Blueprint, в который планируется встраивание.
   * @returns Список Blueprint, которые можно безопасно встроить.
   */
  async loadEmbeddable(id: number): Promise<ZEmbeddableBlueprints> {
    try {
      return await getEmbeddableBlueprintsApi(id);
    } catch (error) {
      onError(error);
      throw error;
    }
  }
}

