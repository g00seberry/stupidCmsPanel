import {
  bulkDeleteMedia,
  bulkForceDeleteMedia,
  bulkRestoreMedia,
  getMediaConfig,
  listMedia,
} from '@/api/apiMedia';
import type { ZMedia, ZMediaConfig, ZMediaListParams } from '@/types/media';
import type { ZPaginationMeta } from '@/types/pagination';
import { onError } from '@/utils/onError';
import { PaginatedDataLoader } from '@/utils/paginatedDataLoader';
import { makeAutoObservable } from 'mobx';

/**
 * Store для управления состоянием списка медиа-файлов.
 * Обеспечивает загрузку, фильтрацию, пагинацию и массовые операции с медиа.
 */
export class MediaListStore {
  /** Универсальный загрузчик пагинированных данных. */
  private readonly loader: PaginatedDataLoader<ZMedia, ZMediaListParams>;

  /** Конфигурация системы медиа-файлов. */
  config: ZMediaConfig | null = null;

  /** Флаг выполнения запроса загрузки конфигурации. */
  configPending = false;

  /** Множество выбранных идентификаторов медиа-файлов. */
  selectedIds = new Set<string>();

  constructor() {
    const defaultFilters: ZMediaListParams = {
      page: 1,
      per_page: 15,
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

  /** Флаг выполнения запроса загрузки. */
  get pending(): boolean {
    return this.loader.pending;
  }

  /** Флаг начальной загрузки данных. */
  get initialLoading(): boolean {
    return this.loader.initialLoading;
  }

  /** Количество выбранных медиа-файлов. */
  get selectedCount(): number {
    return this.selectedIds.size;
  }

  /** Флаг наличия выбранных элементов. */
  get hasSelection(): boolean {
    return this.selectedIds.size > 0;
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
      per_page: 15,
      sort: 'created_at',
      order: 'desc',
    };
    await this.loader.resetFilters(defaultFilters);
  }

  /**
   * Инициализирует загрузку данных при первом открытии страницы.
   */
  async initialize(): Promise<void> {
    try {
      await Promise.all([this.loadConfig(), this.loader.initialize()]);
    } catch (error) {
      onError(error);
    }
  }

  /**
   * Устанавливает конфигурацию системы медиа-файлов.
   * @param config Конфигурация системы медиа-файлов.
   */
  setConfig(config: ZMediaConfig | null): void {
    this.config = config;
  }

  /**
   * Устанавливает флаг выполнения запроса загрузки конфигурации.
   * @param pending Значение флага.
   */
  setConfigPending(pending: boolean): void {
    this.configPending = pending;
  }

  /**
   * Загружает конфигурацию системы медиа-файлов.
   */
  async loadConfig(): Promise<void> {
    if (this.configPending || this.config !== null) {
      return;
    }

    this.setConfigPending(true);
    try {
      const config = await getMediaConfig();
      this.setConfig(config);
    } catch (error) {
      onError(error);
    } finally {
      this.setConfigPending(false);
    }
  }

  /**
   * Выбирает медиа-файл.
   * @param id ULID идентификатор медиа-файла.
   */
  selectMedia(id: string): void {
    this.selectedIds.add(id);
  }

  /**
   * Снимает выбор с медиа-файла.
   * @param id ULID идентификатор медиа-файла.
   */
  deselectMedia(id: string): void {
    this.selectedIds.delete(id);
  }

  /**
   * Переключает выбор медиа-файла.
   * @param id ULID идентификатор медиа-файла.
   */
  toggleSelection(id: string): void {
    if (this.selectedIds.has(id)) {
      this.deselectMedia(id);
    } else {
      this.selectMedia(id);
    }
  }

  /**
   * Выбирает все медиа-файлы на текущей странице.
   */
  selectAll(): void {
    this.media.forEach(item => {
      this.selectedIds.add(item.id);
    });
  }

  /**
   * Снимает выбор со всех медиа-файлов.
   */
  deselectAll(): void {
    this.selectedIds.clear();
  }

  /**
   * Возвращает массив выбранных идентификаторов.
   * @returns Массив ULID идентификаторов выбранных медиа-файлов.
   */
  getSelectedIds(): string[] {
    return Array.from(this.selectedIds);
  }

  /**
   * Проверяет, выбран ли медиа-файл.
   * @param id ULID идентификатор медиа-файла.
   * @returns `true`, если медиа-файл выбран.
   */
  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  /**
   * Выполняет массовое мягкое удаление медиа-файлов.
   * @param ids Массив ULID идентификаторов медиа-файлов для удаления.
   */
  async bulkDelete(ids: string[]): Promise<void> {
    await bulkDeleteMedia(ids);
  }

  /**
   * Выполняет массовое восстановление мягко удаленных медиа-файлов.
   * @param ids Массив ULID идентификаторов медиа-файлов для восстановления.
   */
  async bulkRestore(ids: string[]): Promise<void> {
    await bulkRestoreMedia(ids);
  }

  /**
   * Выполняет окончательное удаление медиа-файлов.
   * @param ids Массив ULID идентификаторов медиа-файлов для окончательного удаления.
   */
  async bulkForceDelete(ids: string[]): Promise<void> {
    await bulkForceDeleteMedia(ids);
  }
}
