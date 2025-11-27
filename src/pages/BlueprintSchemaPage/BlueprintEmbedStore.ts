import { getEmbeddableBlueprints } from '@/api/blueprintApi';
import {
  createEmbed as createEmbedApi,
  deleteEmbed as deleteEmbedApi,
  listEmbeds,
} from '@/api/blueprintEmbedApi';
import type { ZEmbeddableBlueprints } from '@/types/blueprint';
import type { ZBlueprintEmbed } from '@/types/blueprintEmbed';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/**
 * Store для управления встраиваниями Blueprint.
 * Обеспечивает загрузку, создание и удаление встраиваний,
 * а также работу со списком доступных для встраивания Blueprint.
 */
export class BlueprintEmbedStore {
  /** Список встраиваний текущего Blueprint. */
  embeds: ZBlueprintEmbed[] = [];
  /** Список Blueprint, доступных для безопасного встраивания. */
  embeddableBlueprints: Array<{ id: number; code: string; name: string }> = [];
  /** Флаг выполнения запроса. */
  pending = false;
  /** Идентификатор текущего Blueprint. */
  blueprintId: number | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setEmbeds(embeds: ZBlueprintEmbed[]) {
    this.embeds = embeds;
  }

  setEmbeddableBlueprints(blueprints: Array<{ id: number; code: string; name: string }>) {
    this.embeddableBlueprints = blueprints;
  }

  setPending(value: boolean) {
    this.pending = value;
  }

  setBlueprintId(blueprintId: number | null) {
    this.blueprintId = blueprintId;
  }

  /**
   * Загрузить список встраиваний.
   * @param blueprintId Идентификатор Blueprint.
   */
  async loadEmbeds(blueprintId: number): Promise<void> {
    this.setBlueprintId(blueprintId);
    this.setPending(true);
    try {
      const embeds = await listEmbeds(blueprintId);
      this.setEmbeds(embeds);
    } catch (error) {
      onError(error);
      this.setEmbeds([]);
    } finally {
      this.setPending(false);
    }
  }

  /**
   * Загрузить список доступных для встраивания Blueprint.
   * @param blueprintId Идентификатор Blueprint, в который планируется встраивание.
   */
  async loadEmbeddable(blueprintId: number): Promise<void> {
    this.setBlueprintId(blueprintId);
    this.setPending(true);
    try {
      const response: ZEmbeddableBlueprints = await getEmbeddableBlueprints(blueprintId);
      this.setEmbeddableBlueprints(response.data);
    } catch (error) {
      onError(error);
      this.setEmbeddableBlueprints([]);
    } finally {
      this.setPending(false);
    }
  }

  /**
   * Создать встраивание с валидацией конфликтов.
   * @param dto Данные для создания встраивания.
   * @returns Созданное встраивание.
   */
  async createEmbed(dto: {
    embedded_blueprint_id: number;
    host_path_id?: number;
  }): Promise<ZBlueprintEmbed> {
    if (!this.blueprintId) {
      throw new Error('Blueprint ID не установлен');
    }
    this.setPending(true);
    try {
      return await createEmbedApi(this.blueprintId, dto);
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.setPending(false);
    }
  }

  /**
   * Удалить встраивание.
   * @param id Идентификатор встраивания для удаления.
   */
  async deleteEmbed(id: number): Promise<void> {
    this.setPending(true);
    try {
      await deleteEmbedApi(id);
      if (this.blueprintId) {
        await this.loadEmbeds(this.blueprintId);
      }
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.setPending(false);
    }
  }
}
