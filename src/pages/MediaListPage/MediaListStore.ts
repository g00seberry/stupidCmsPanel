import {
  bulkDeleteMedia,
  bulkForceDeleteMedia,
  bulkRestoreMedia,
  getMediaConfig,
  listMedia,
} from '@/api/apiMedia';
import { FilterFormStore } from '@/components/FilterForm';
import { PaginatedTableStore } from '@/components/PaginatedTable/PaginatedTableStore';
import { PaginatedDataLoader } from '@/components/PaginatedTable/paginatedDataLoader';
import type { ZMedia, ZMediaListFilters, ZMediaConfig } from '@/types/media';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/**
 * Store для управления состоянием списка медиа-файлов.
 * Обеспечивает загрузку, фильтрацию, пагинацию и массовые операции с медиа.
 */
export class MediaListStore {
  /** Универсальный стор пагинированной таблицы. */
  readonly tableStore = new PaginatedTableStore<ZMedia, ZMediaListFilters>(
    new PaginatedDataLoader(listMedia, {
      filters: {},
      pagination: { page: 1, per_page: 15 },
    }),
    'id'
  );

  /** Конфигурация системы медиа-файлов. */
  config: ZMediaConfig | null = null;

  /** Флаг выполнения запроса загрузки конфигурации. */
  configPending = false;

  /** Store для управления формой фильтрации. */
  readonly filterStore = new FilterFormStore();

  constructor() {
    this.initialize();
    makeAutoObservable(this);
  }

  /** Количество выбранных медиа-файлов. */
  get selectedCount(): number {
    return this.tableStore.getSelectedCount();
  }

  /** Флаг наличия выбранных элементов. */
  get hasSelection(): boolean {
    return this.tableStore.hasSelection();
  }

  /**
   * Загружает список медиа-файлов с текущими фильтрами.
   */
  async loadMedia(): Promise<void> {
    await this.tableStore.loader.load();
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
    this.tableStore.selectRow(id);
  }

  /**
   * Снимает выбор с медиа-файла.
   * @param id ULID идентификатор медиа-файла.
   */
  deselectMedia(id: string): void {
    this.tableStore.deselectRow(id);
  }

  /**
   * Выбирает все медиа-файлы на текущей странице.
   */
  selectAll(): void {
    this.tableStore.selectAllOnCurrentPage();
  }

  /**
   * Снимает выбор со всех медиа-файлов.
   */
  deselectAll(): void {
    this.tableStore.clearSelection();
  }

  /**
   * Возвращает массив выбранных идентификаторов.
   * @returns Массив ULID идентификаторов выбранных медиа-файлов.
   */
  getSelectedIds(): string[] {
    return this.tableStore.getSelectedKeys() as string[];
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
