import { makeAutoObservable } from 'mobx';
import type { ZEmbeddableBlueprints } from '@/types/blueprint';
import type { ZBlueprintEmbed } from '@/types/blueprintEmbed';
import { onError } from '@/utils/onError';
import {
  listEmbeds,
  createEmbed as createEmbedApi,
  deleteEmbed as deleteEmbedApi,
} from '@/api/blueprintEmbedApi';
import { getEmbeddableBlueprints } from '@/api/blueprintApi';

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
    makeAutoObservable(this);
  }

  /**
   * Загрузить список встраиваний.
   * @param blueprintId Идентификатор Blueprint.
   */
  async loadEmbeds(blueprintId: number): Promise<void> {
    this.blueprintId = blueprintId;
    this.pending = true;
    try {
      this.embeds = await listEmbeds(blueprintId);
    } catch (error) {
      onError(error);
      this.embeds = [];
    } finally {
      this.pending = false;
    }
  }

  /**
   * Загрузить список доступных для встраивания Blueprint.
   * @param blueprintId Идентификатор Blueprint, в который планируется встраивание.
   */
  async loadEmbeddable(blueprintId: number): Promise<void> {
    this.blueprintId = blueprintId;
    this.pending = true;
    try {
      const response: ZEmbeddableBlueprints = await getEmbeddableBlueprints(blueprintId);
      this.embeddableBlueprints = response.data;
    } catch (error) {
      onError(error);
      this.embeddableBlueprints = [];
    } finally {
      this.pending = false;
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
    this.pending = true;
    try {
      const embed = await createEmbedApi(this.blueprintId, dto);
      await this.loadEmbeds(this.blueprintId);
      return embed;
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.pending = false;
    }
  }

  /**
   * Удалить встраивание.
   * @param id Идентификатор встраивания для удаления.
   */
  async deleteEmbed(id: number): Promise<void> {
    this.pending = true;
    try {
      await deleteEmbedApi(id);
      if (this.blueprintId) {
        await this.loadEmbeds(this.blueprintId);
      }
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.pending = false;
    }
  }
}

