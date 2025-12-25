import {
  createPath as createPathApi,
  deletePath as deletePathApi,
  listPaths,
  updatePath as updatePathApi,
} from '@/api/pathApi';
import type { ZCreatePathDto, ZPath, ZUpdatePathDto } from '@/types/path';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/**
 * Store для управления полями Blueprint (Path).
 * Обеспечивает загрузку, создание, обновление и удаление полей,
 * а также работу с иерархической структурой полей.
 */
export class PathStore {
  /** Дерево полей Blueprint. */
  paths: ZPath[] = [];
  /** Флаг выполнения запроса. */
  loading = false;

  constructor(public blueprintId: ZId) {
    this.init();
    makeAutoObservable(this);
  }

  setPaths(paths: ZPath[]) {
    this.paths = paths;
  }

  setLoading(value: boolean) {
    this.loading = value;
  }

  /**
   * Загрузить дерево полей Blueprint.
   * @param blueprintId Идентификатор Blueprint.
   */
  async init(): Promise<void> {
    this.setLoading(true);
    try {
      const paths = await listPaths(this.blueprintId);
      this.setPaths(paths);
    } catch (error) {
      onError(error);
      this.setPaths([]);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Создать новое поле.
   * @param dto Данные для создания поля.
   * @returns Созданное поле.
   */
  async createPath(dto: ZCreatePathDto): Promise<ZPath> {
    this.setLoading(true);
    try {
      const path = await createPathApi(this.blueprintId, dto);
      await this.init();
      return path;
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Обновить поле с перерасчетом full_path дочерних элементов.
   * @param id Идентификатор поля.
   * @param dto Данные для обновления.
   */
  async updatePath(id: ZId, dto: ZUpdatePathDto): Promise<void> {
    this.setLoading(true);
    try {
      await updatePathApi(id, dto);
      await this.init();
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Удалить поле (с каскадным удалением дочерних).
   * @param id Идентификатор поля для удаления.
   */
  async deletePath(id: ZId): Promise<void> {
    this.setLoading(true);
    try {
      await deletePathApi(id);
      await this.init();
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }
}
