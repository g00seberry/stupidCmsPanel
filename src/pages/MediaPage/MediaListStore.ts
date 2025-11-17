import { makeAutoObservable } from 'mobx';
import { listMedia, deleteMedia, restoreMedia } from '@/api/apiMedia';
import { PaginatedDataLoader } from '@/utils/paginatedDataLoader';
import { onError } from '@/utils/onError';
import type { ZMedia, ZMediaListParams } from '@/types/media';
import type { ZPaginationMeta, ZPaginationLinks } from '@/types/pagination';
import { notification } from 'antd';

/**
 * Store для управления состоянием списка медиа-файлов.
 * Обеспечивает загрузку, фильтрацию и пагинацию медиа-файлов.
 */
export class MediaListStore {
  /** Универсальный загрузчик пагинированных данных. */
  private readonly loader: PaginatedDataLoader<ZMedia, ZMediaListParams>;

  constructor() {
    const defaultFilters: ZMediaListParams = {
      page: 1,
      per_page: 20,
      sort: 'created_at',
      order: 'desc',
    };

    this.loader = new PaginatedDataLoader(listMedia, defaultFilters);
    makeAutoObservable(this);
  }

  /** Массив загруженных медиа-файлов. */
  get media(): ZMedia[] {
    return this.loader.data;
  }

  /** Метаданные пагинации. */
  get paginationMeta(): ZPaginationMeta | null {
    return this.loader.paginationMeta;
  }

  /** Ссылки пагинации. */
  get paginationLinks(): ZPaginationLinks | null {
    return this.loader.paginationLinks;
  }

  /** Флаг выполнения запроса загрузки. */
  get pending(): boolean {
    return this.loader.pending;
  }

  /** Флаг начальной загрузки данных. */
  get initialLoading(): boolean {
    return this.loader.initialLoading;
  }

  /** Текущие параметры фильтрации. */
  get filters(): ZMediaListParams {
    return this.loader.filters;
  }

  /** Универсальный загрузчик пагинированных данных. */
  get paginatedLoader(): PaginatedDataLoader<ZMedia, ZMediaListParams> {
    return this.loader;
  }

  /**
   * Загружает список медиа-файлов с текущими фильтрами.
   */
  async loadMedia(): Promise<void> {
    await this.loader.load();
  }

  /**
   * Устанавливает фильтры и перезагружает данные.
   * @param filters Новые параметры фильтрации.
   */
  async setFilters(filters: Partial<ZMediaListParams>): Promise<void> {
    await this.loader.setFilters(filters);
  }

  /**
   * Переходит на указанную страницу.
   * @param page Номер страницы.
   */
  async goToPage(page: number): Promise<void> {
    await this.loader.goToPage(page);
  }

  /**
   * Сбрасывает фильтры к значениям по умолчанию.
   */
  async resetFilters(): Promise<void> {
    const defaultFilters: ZMediaListParams = {
      page: 1,
      per_page: 20,
      sort: 'created_at',
      order: 'desc',
    };
    await this.loader.resetFilters(defaultFilters);
  }

  /**
   * Инициализирует загрузку данных при первом открытии страницы.
   */
  async initialize(): Promise<void> {
    await this.loader.initialize();
  }

  /**
   * Удаляет медиа-файл (мягкое удаление).
   * После удаления перезагружает список.
   * @param id Идентификатор медиа-файла для удаления.
   */
  async deleteMediaItem(id: string): Promise<void> {
    try {
      await deleteMedia(id);
      notification.success({
        message: 'Медиа-файл удалён',
        description: 'Файл успешно перемещён в корзину',
      });
      await this.loadMedia();
    } catch (error) {
      onError(error);
    }
  }

  /**
   * Восстанавливает ранее удалённый медиа-файл.
   * После восстановления перезагружает список.
   * @param id Идентификатор медиа-файла для восстановления.
   */
  async restoreMediaItem(id: string): Promise<void> {
    try {
      await restoreMedia(id);
      notification.success({
        message: 'Медиа-файл восстановлен',
        description: 'Файл успешно восстановлен из корзины',
      });
      await this.loadMedia();
    } catch (error) {
      onError(error);
    }
  }
}
