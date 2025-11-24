import { makeAutoObservable, runInAction } from 'mobx';
import type { ZPath, ZCreatePathDto, ZUpdatePathDto } from '@/types/path';
import { onError } from '@/utils/onError';
import {
  listPaths,
  getPath as getPathApi,
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
  /** Текущее выбранное поле. */
  currentPath: ZPath | null = null;
  /** Флаг выполнения запроса. */
  pending = false;
  /** Идентификатор текущего Blueprint. */
  blueprintId: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Загрузить дерево полей Blueprint.
   * @param blueprintId Идентификатор Blueprint.
   */
  async loadPaths(blueprintId: number): Promise<void> {
    runInAction(() => {
      this.blueprintId = blueprintId;
      this.pending = true;
    });
    try {
      const paths = await listPaths(blueprintId);
      runInAction(() => {
        this.paths = paths;
      });
    } catch (error) {
      onError(error);
      runInAction(() => {
        this.paths = [];
      });
    } finally {
      runInAction(() => {
        this.pending = false;
      });
    }
  }

  /**
   * Загрузить поле по ID.
   * @param id Идентификатор поля.
   */
  async loadPath(id: number): Promise<void> {
    this.pending = true;
    try {
      const path = await getPathApi(id);
      runInAction(() => {
        this.currentPath = path;
      });
    } catch (error) {
      onError(error);
      runInAction(() => {
        this.currentPath = null;
      });
    } finally {
      runInAction(() => {
        this.pending = false;
      });
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
    this.pending = true;
    try {
      const path = await createPathApi(this.blueprintId, dto);
      await this.loadPaths(this.blueprintId);
      return path;
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      runInAction(() => {
        this.pending = false;
      });
    }
  }

  /**
   * Обновить поле с перерасчетом full_path дочерних элементов.
   * @param id Идентификатор поля.
   * @param dto Данные для обновления.
   */
  async updatePath(id: number, dto: ZUpdatePathDto): Promise<void> {
    this.pending = true;
    try {
      const updated = await updatePathApi(id, dto);
      runInAction(() => {
        this.currentPath = updated;
      });
      if (this.blueprintId) {
        await this.loadPaths(this.blueprintId);
      }
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      runInAction(() => {
        this.pending = false;
      });
    }
  }

  /**
   * Удалить поле (с каскадным удалением дочерних).
   * @param id Идентификатор поля для удаления.
   */
  async deletePath(id: number): Promise<void> {
    runInAction(() => {
      this.pending = true;
    });
    try {
      await deletePathApi(id);
      runInAction(() => {
        if (this.currentPath?.id === id) {
          this.currentPath = null;
        }
      });
      if (this.blueprintId) {
        await this.loadPaths(this.blueprintId);
      }
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      runInAction(() => {
        this.pending = false;
      });
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

    const findPath = (paths: ZPath[], id: number): ZPath | null => {
      for (const path of paths) {
        if (path.id === id) {
          return path;
        }
        if (path.children) {
          const found = findPath(path.children, id);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    const parent = findPath(this.paths, parentId);
    if (!parent) {
      return name;
    }

    return `${parent.full_path}.${name}`;
  }
}
