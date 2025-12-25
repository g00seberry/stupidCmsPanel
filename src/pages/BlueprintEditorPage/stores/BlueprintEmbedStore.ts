import { getEmbeddableBlueprints } from '@/api/blueprintApi';
import {
  createEmbed as createEmbedApi,
  deleteEmbed as deleteEmbedApi,
  listEmbeds,
} from '@/api/blueprintEmbedApi';
import type { ZEmbeddableBlueprints } from '@/types/blueprint';
import type { ZBlueprintEmbed } from '@/types/blueprintEmbed';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

type AllowedToEmbed = { id: ZId; code: string; name: string };
/**
 * Store для управления встраиваниями Blueprint.
 * Обеспечивает загрузку, создание и удаление встраиваний,
 * а также работу со списком доступных для встраивания Blueprint.
 */
export class BlueprintEmbedStore {
  /** Список встраиваний текущего Blueprint. */
  embeds: ZBlueprintEmbed[] = [];
  /** Список Blueprint, доступных для безопасного встраивания. */
  embeddableBlueprints: AllowedToEmbed[] = [];
  /** Флаг выполнения запроса. */
  loading = false;

  constructor(public blueprintId: ZId) {
    this.init();
    makeAutoObservable(this);
  }

  setEmbeds(embeds: ZBlueprintEmbed[]) {
    this.embeds = embeds;
  }

  setEmbeddableBlueprints(blueprints: Array<{ id: ZId; code: string; name: string }>) {
    this.embeddableBlueprints = blueprints;
  }

  setLoading(value: boolean) {
    this.loading = value;
  }

  async init(): Promise<void> {
    try {
      this.loadEmbeds();
      this.loadEmbeddable();
    } catch (error) {
      onError(error);
    }
  }

  /**
   * Загрузить список встраиваний.
   * @param blueprintId Идентификатор Blueprint.
   */
  async loadEmbeds(): Promise<void> {
    this.setLoading(true);
    try {
      const embeds = await listEmbeds(this.blueprintId);
      this.setEmbeds(embeds);
    } catch (error) {
      onError(error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Загрузить список доступных для встраивания Blueprint.
   * @param blueprintId Идентификатор Blueprint, в который планируется встраивание.
   */
  async loadEmbeddable(): Promise<void> {
    this.setLoading(true);
    try {
      const response: ZEmbeddableBlueprints = await getEmbeddableBlueprints(this.blueprintId);
      this.setEmbeddableBlueprints(response.data);
    } catch (error) {
      onError(error);
      this.setEmbeddableBlueprints([]);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Создать встраивание с валидацией конфликтов.
   * @param dto Данные для создания встраивания.
   * @returns Созданное встраивание.
   */
  async createEmbed(dto: { embedded_blueprint_id: ZId; host_path_id?: ZId }) {
    this.setLoading(true);
    try {
      await createEmbedApi(this.blueprintId, dto);
    } catch (error) {
      onError(error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Удалить встраивание.
   * @param id Идентификатор встраивания для удаления.
   */
  async deleteEmbed(id: ZId) {
    this.setLoading(true);
    try {
      await deleteEmbedApi(id);
      this.loadEmbeds();
    } catch (error) {
      onError(error);
    } finally {
      this.setLoading(false);
    }
  }
}
