import { deleteBlueprint, getBlueprint, updateBlueprint } from '@/api/blueprintApi';
import type { ZBlueprint, ZUpdateBlueprintDto } from '@/types/blueprint';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/**
 * Store для управления редактированием отдельного Blueprint.
 * Обеспечивает загрузку, создание, обновление и удаление Blueprint,
 * а также работу с зависимостями и встраиваниями.
 */
export class BlueprintStore {
  /** Текущий редактируемый Blueprint с полной информацией. */
  currentBlueprint: ZBlueprint | null = null;

  setCurrentBlueprint(blueprint: ZBlueprint | null) {
    this.currentBlueprint = blueprint;
  }

  /** Флаг выполнения асинхронной операции. */
  loading = false;

  setLoading(value: boolean) {
    this.loading = value;
  }

  constructor(public blueprintId: ZId) {
    this.init();
    makeAutoObservable(this);
  }

  /**
   * Загрузить Blueprint по ID.
   * @param id Идентификатор Blueprint.
   */
  async init(): Promise<void> {
    this.setLoading(true);
    try {
      const blueprint = await getBlueprint(this.blueprintId);
      this.setCurrentBlueprint(blueprint);
    } catch (error) {
      onError(error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Обновить Blueprint.
   * @param id Идентификатор Blueprint.
   * @param dto Данные для обновления.
   */
  async updateBlueprint(dto: ZUpdateBlueprintDto): Promise<void> {
    this.setLoading(true);
    try {
      const updated = await updateBlueprint(this.blueprintId, dto);
      this.setCurrentBlueprint(updated);
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Удалить Blueprint.
   * @param id Идентификатор Blueprint для удаления.
   */
  async deleteBlueprint(): Promise<void> {
    this.setLoading(true);
    try {
      await deleteBlueprint(this.blueprintId);
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }
}
