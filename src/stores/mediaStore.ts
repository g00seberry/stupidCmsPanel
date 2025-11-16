import { makeAutoObservable, runInAction } from 'mobx';
import {
  listMedia,
  getMedia,
  uploadMedia,
  updateMedia,
  deleteMedia,
  restoreMedia,
} from '@/api/apiMedia';
import { PaginatedDataLoader } from '@/utils/paginatedDataLoader';
import { onError } from '@/utils/onError';
import type { ZMedia, ZMediaFilters, ZMediaUpdatePayload } from '@/types/media';

/**
 * Store для управления состоянием медиафайлов CMS.
 * Обеспечивает загрузку, фильтрацию, пагинацию и CRUD операции с медиафайлами.
 */
export class MediaStore {
  /** Универсальный загрузчик пагинированных данных. */
  private readonly loader: PaginatedDataLoader<ZMedia, ZMediaFilters>;

  /** Текущий выбранный медиафайл для детального просмотра. */
  currentMedia: ZMedia | null = null;

  /** Флаг выполнения запроса загрузки деталей медиафайла. */
  currentMediaPending = false;

  /** Флаг выполнения операции загрузки файла. */
  uploadPending = false;

  constructor() {
    const defaultFilters: ZMediaFilters = {
      page: 1,
      per_page: 15,
      sort: 'created_at',
      order: 'desc',
    };

    this.loader = new PaginatedDataLoader(listMedia, defaultFilters);
    makeAutoObservable(this);
  }

  /** Массив загруженных медиафайлов. */
  get mediaList(): ZMedia[] {
    return this.loader.data;
  }

  /** Метаданные пагинации. */
  get paginationMeta() {
    return this.loader.paginationMeta;
  }

  /** Ссылки пагинации. */
  get paginationLinks() {
    return this.loader.paginationLinks;
  }

  /** Флаг выполнения запроса загрузки списка. */
  get pending(): boolean {
    return this.loader.pending;
  }

  /** Флаг начальной загрузки данных. */
  get initialLoading(): boolean {
    return this.loader.initialLoading;
  }

  /** Текущие параметры фильтрации. */
  get filters(): ZMediaFilters {
    return this.loader.filters;
  }

  /** Универсальный загрузчик пагинированных данных. */
  get paginatedLoader(): PaginatedDataLoader<ZMedia, ZMediaFilters> {
    return this.loader;
  }

  /**
   * Загружает список медиафайлов с текущими фильтрами.
   */
  async loadMediaList(): Promise<void> {
    try {
      await this.loader.load();
    } catch (error) {
      onError(error);
    }
  }

  /**
   * Устанавливает фильтры и перезагружает данные.
   * @param filters Новые параметры фильтрации.
   */
  async setFilters(filters: Partial<ZMediaFilters>): Promise<void> {
    try {
      await this.loader.setFilters(filters);
    } catch (error) {
      onError(error);
    }
  }

  /**
   * Переходит на указанную страницу.
   * @param page Номер страницы.
   */
  async setPage(page: number): Promise<void> {
    try {
      await this.loader.goToPage(page);
    } catch (error) {
      onError(error);
    }
  }

  /**
   * Сбрасывает фильтры к значениям по умолчанию.
   */
  async resetFilters(): Promise<void> {
    const defaultFilters: ZMediaFilters = {
      page: 1,
      per_page: 15,
      sort: 'created_at',
      order: 'desc',
    };
    try {
      await this.loader.resetFilters(defaultFilters);
    } catch (error) {
      onError(error);
    }
  }

  /**
   * Инициализирует загрузку данных при первом открытии страницы.
   */
  async initialize(): Promise<void> {
    try {
      await this.loader.initialize();
    } catch (error) {
      onError(error);
    }
  }

  /**
   * Загружает детальную информацию о медиафайле по ID.
   * @param id Идентификатор медиафайла.
   */
  async loadMedia(id: string): Promise<void> {
    this.currentMediaPending = true;
    this.currentMedia = null;
    try {
      const media = await getMedia(id);
      runInAction(() => {
        this.currentMedia = media;
        this.currentMediaPending = false;
      });
    } catch (error) {
      runInAction(() => {
        this.currentMediaPending = false;
      });
      onError(error);
    }
  }

  /**
   * Загружает новый медиафайл на сервер.
   * После успешной загрузки обновляет список медиафайлов.
   * @param file Файл для загрузки.
   * @param metadata Опциональные метаданные: title, alt, collection.
   * @returns Созданный медиафайл.
   */
  async uploadMedia(
    file: File,
    metadata?: {
      title?: string;
      alt?: string;
      collection?: string;
    }
  ): Promise<ZMedia | null> {
    this.uploadPending = true;
    try {
      const media = await uploadMedia(file, metadata);
      runInAction(() => {
        this.uploadPending = false;
      });
      // Перезагружаем список после успешной загрузки
      await this.loadMediaList();
      return media;
    } catch (error) {
      runInAction(() => {
        this.uploadPending = false;
      });
      onError(error);
      return null;
    }
  }

  /**
   * Обновляет метаданные существующего медиафайла.
   * После успешного обновления обновляет список и текущий медиафайл.
   * @param id Идентификатор медиафайла для обновления.
   * @param payload Новые значения метаданных: title, alt, collection.
   */
  async updateMedia(id: string, payload: ZMediaUpdatePayload): Promise<void> {
    try {
      const updatedMedia = await updateMedia(id, payload);
      runInAction(() => {
        // Обновляем медиафайл в списке, если он там есть
        const index = this.mediaList.findIndex(m => m.id === id);
        if (index !== -1) {
          this.mediaList[index] = updatedMedia;
        }
        // Обновляем текущий медиафайл, если он выбран
        if (this.currentMedia?.id === id) {
          this.currentMedia = updatedMedia;
        }
      });
    } catch (error) {
      onError(error);
    }
  }

  /**
   * Удаляет медиафайл (soft delete).
   * После успешного удаления обновляет список.
   * @param id Идентификатор медиафайла для удаления.
   */
  async deleteMedia(id: string): Promise<void> {
    try {
      await deleteMedia(id);
      // Перезагружаем список после успешного удаления
      await this.loadMediaList();
      // Сбрасываем текущий медиафайл, если он был удалён
      if (this.currentMedia?.id === id) {
        runInAction(() => {
          this.currentMedia = null;
        });
      }
    } catch (error) {
      onError(error);
      throw error; // Пробрасываем ошибку для обработки в UI (например, для показа модального окна с информацией о связанных записях)
    }
  }

  /**
   * Восстанавливает удалённый медиафайл из корзины.
   * После успешного восстановления обновляет список.
   * @param id Идентификатор медиафайла для восстановления.
   */
  async restoreMedia(id: string): Promise<void> {
    try {
      const restoredMedia = await restoreMedia(id);
      runInAction(() => {
        // Обновляем медиафайл в списке, если он там есть
        const index = this.mediaList.findIndex(m => m.id === id);
        if (index !== -1) {
          this.mediaList[index] = restoredMedia;
        }
        // Обновляем текущий медиафайл, если он выбран
        if (this.currentMedia?.id === id) {
          this.currentMedia = restoredMedia;
        }
      });
      // Перезагружаем список после успешного восстановления
      await this.loadMediaList();
    } catch (error) {
      onError(error);
    }
  }

  /**
   * Сбрасывает состояние стора к начальному состоянию.
   */
  reset(): void {
    this.currentMedia = null;
    this.currentMediaPending = false;
    this.uploadPending = false;
    this.loader.resetFilters(this.loader.filters);
  }
}

/**
 * Экземпляр стора медиафайлов для повторного использования.
 */
export const mediaStore = new MediaStore();
