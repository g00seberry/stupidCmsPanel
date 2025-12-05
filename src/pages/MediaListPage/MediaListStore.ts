import {
  bulkDeleteMedia,
  bulkForceDeleteMedia,
  bulkRestoreMedia,
  getMediaConfig,
  listMedia,
} from '@/api/apiMedia';
import type { ZMediaConfig, ZMediaListParams } from '@/types/media';
import { onError } from '@/utils/onError';
import { PaginatedDataLoader } from '@/utils/paginatedDataLoader';
import { FilterFormStore } from '@/components/FilterForm';
import { makeAutoObservable, observable } from 'mobx';

const defaultFilters: ZMediaListParams = {
  page: 1,
  per_page: 15,
  sort: 'created_at',
  order: 'desc',
};

/**
 * Store для управления состоянием списка медиа-файлов.
 * Обеспечивает загрузку, фильтрацию, пагинацию и массовые операции с медиа.
 */
export class MediaListStore {
  /** Универсальный загрузчик пагинированных данных. */
  readonly loader = new PaginatedDataLoader(listMedia, defaultFilters);

  /** Конфигурация системы медиа-файлов. */
  config: ZMediaConfig | null = null;

  /** Флаг выполнения запроса загрузки конфигурации. */
  configPending = false;

  /** Множество выбранных идентификаторов медиа-файлов. */
  selectedIds = observable.set<string>();

  /** Store для управления формой фильтрации. */
  readonly filterStore = new FilterFormStore();

  constructor() {
    this.initialize();
    makeAutoObservable(this);
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
   * Инициализирует загрузку данных при первом открытии страницы.
   */
  async initialize(): Promise<void> {
    try {
      await this.loadConfig();
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
   * Выбирает все медиа-файлы на текущей странице.
   */
  selectAll(): void {
    this.loader.data.forEach(item => {
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
