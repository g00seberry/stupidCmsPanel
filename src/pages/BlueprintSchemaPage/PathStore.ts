import { makeAutoObservable, runInAction } from 'mobx';
import type { ZPath, ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import { onError } from '@/utils/onError';
import { findPathInTree } from '@/utils/pathUtils';
import {
  listPaths,
  createPath as createPathApi,
  updatePath as updatePathApi,
  deletePath as deletePathApi,
} from '@/api/pathApi';

/**
 * Store для управления полями Blueprint (Path).
 * Обеспечивает загрузку, создание, обновление и удаление полей,
 * а также работу с иерархической структурой полей.
 */
export class PathStore {
  /** Дерево полей Blueprint. */
  paths: ZPath[] = [];
  /** Флаг выполнения запроса. */
  pending = false;
  /** Идентификатор текущего Blueprint. */
  blueprintId: number | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setPaths(paths: ZPath[]) {
    this.paths = paths;
  }

  setPending(value: boolean) {
    this.pending = value;
  }

  setBlueprintId(blueprintId: number | null) {
    this.blueprintId = blueprintId;
  }

  /**
   * Загрузить дерево полей Blueprint.
   * @param blueprintId Идентификатор Blueprint.
   */
  async loadPaths(blueprintId: number): Promise<void> {
    this.setBlueprintId(blueprintId);
    this.setPending(true);
    try {
      const paths = await listPaths(blueprintId);
      this.setPaths(paths);
    } catch (error) {
      onError(error);
      this.setPaths([]);
    } finally {
      this.setPending(false);
    }
  }

  /**
   * Создать новое поле.
   * @param dto Данные для создания поля.
   * @returns Созданное поле.
   */
  async createPath(dto: ZCreatePathDto): Promise<ZPath> {
    if (!this.blueprintId) {
      throw new Error('Blueprint ID не установлен');
    }
    this.setPending(true);
    try {
      const path = await createPathApi(this.blueprintId, dto);
      await this.loadPaths(this.blueprintId);
      return path;
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.setPending(false);
    }
  }

  /**
   * Обновить поле с перерасчетом full_path дочерних элементов.
   * @param id Идентификатор поля.
   * @param dto Данные для обновления.
   */
  async updatePath(id: number, dto: ZUpdatePathDto): Promise<void> {
    this.setPending(true);
    try {
      await updatePathApi(id, dto);
      if (this.blueprintId) {
        await this.loadPaths(this.blueprintId);
      }
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.setPending(false);
    }
  }

  /**
   * Удалить поле (с каскадным удалением дочерних).
   * @param id Идентификатор поля для удаления.
   */
  async deletePath(id: number): Promise<void> {
    this.setPending(true);
    try {
      await deletePathApi(id);
      if (this.blueprintId) {
        await this.loadPaths(this.blueprintId);
      }
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.setPending(false);
    }
  }

  /**
   * Вычислить full_path для предпросмотра.
   * @param name Имя нового поля.
   * @param parentId Идентификатор родительского поля. `null` для корневого поля.
   * @returns Полный путь поля для предпросмотра.
   */
  computeFullPath(name: string, parentId: number | null): string {
    if (!parentId) {
      return name;
    }

    const parent = findPathInTree(this.paths, parentId);
    if (!parent) {
      return name;
    }

    return `${parent.full_path}.${name}`;
  }
}
