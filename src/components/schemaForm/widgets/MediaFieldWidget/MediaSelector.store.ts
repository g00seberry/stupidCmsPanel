import { makeAutoObservable } from 'mobx';
import { FilterFormStore } from '@/components/FilterForm';
import { PaginatedTableStore } from '@/components/PaginatedTable/PaginatedTableStore';
import { PaginatedDataLoader } from '@/components/PaginatedTable/paginatedDataLoader';
import { getMediaConfig, listMedia } from '@/api/apiMedia';
import { onError } from '@/utils/onError';
import { notificationService } from '@/services/notificationService';
import type { ZMedia, ZMediaListFilters, ZMediaConfig } from '@/types/media';
import type { ZPathMediaConstraints } from '@/types/path/pathConstraints';
import { mediaFieldPerPage } from './MediaFieldWidget.constants';
import type { MediaSelectorStoreOptions } from './MediaFieldWidget.types';

/**
 * Store для управления состоянием MediaSelector.
 * Управляет выбором медиа-файлов, фильтрацией и загрузкой.
 */
export class MediaSelectorStore {
  /** Constraints для фильтрации по MIME типам. */
  readonly constraints?: ZPathMediaConstraints | null;
  /** Режим выбора: 'single' или 'multiple'. */
  readonly selectionMode: 'single' | 'multiple';
  /** Store для пагинированной таблицы. */
  readonly tableStore: PaginatedTableStore<ZMedia, ZMediaListFilters>;
  /** Store для фильтров. */
  readonly filterStore: FilterFormStore<ZMediaListFilters>;
  /** Конфигурация медиа-системы. */
  config: ZMediaConfig | null = null;
  /** Флаг загрузки конфигурации. */
  configLoading = false;
  /** Флаг видимости загрузки файлов. */
  uploadVisible = false;
  /** Множество выбранных ID. */
  selectedIds = new Set<string>();

  /**
   * Создаёт экземпляр store для MediaSelector.
   * @param options Опции для создания store.
   */
  constructor(options: MediaSelectorStoreOptions) {
    this.constraints = options.constraints;
    this.selectionMode = options.selectionMode ?? 'single';
    this.tableStore = this.createTableStore();
    this.filterStore = new FilterFormStore<ZMediaListFilters>();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * Создаёт store для пагинированной таблицы.
   * @returns Экземпляр PaginatedTableStore.
   */
  private createTableStore(): PaginatedTableStore<ZMedia, ZMediaListFilters> {
    const filters: ZMediaListFilters = {};

    // Фильтруем по allowed_mimes из constraints, если они есть
    if (this.constraints?.allowed_mimes && this.constraints.allowed_mimes.length > 0) {
      // Используем первый MIME тип как префикс для фильтрации
      // (API поддерживает фильтрацию по префиксу MIME типа)
      const firstMime = this.constraints.allowed_mimes[0];
      const mimePrefix = firstMime.split('/')[0];
      filters.mime = mimePrefix;
    }

    const loader = new PaginatedDataLoader<ZMedia, ZMediaListFilters>(listMedia, {
      filters,
      pagination: { page: 1, per_page: mediaFieldPerPage },
    });

    return new PaginatedTableStore<ZMedia, ZMediaListFilters>(loader, 'id');
  }

  /**
   * Инициализирует селектор.
   * Загружает конфигурацию и данные, предвыбирает файлы.
   * @param preselectedIds Предвыбранные ID.
   */
  async initialize(preselectedIds: string[] = []): Promise<void> {
    await this.loadConfig();
    void this.tableStore.loader.initialize();
    this.selectedIds = new Set(preselectedIds);
  }

  /**
   * Загружает конфигурацию медиа-системы.
   */
  async loadConfig(): Promise<void> {
    this.configLoading = true;
    try {
      const mediaConfig = await getMediaConfig();
      this.config = mediaConfig;
    } catch (error) {
      onError(error);
    } finally {
      this.configLoading = false;
    }
  }

  /**
   * Обновляет фильтры в таблице на основе значений из filterStore.
   */
  updateFilters(): void {
    const filterValues = this.filterStore.values;
    void this.tableStore.loader.setFilters(filterValues as ZMediaListFilters);
  }

  /**
   * Переключает выбранность медиа-файла.
   * @param id ID медиа-файла.
   * @param selected Выбран ли файл.
   */
  toggleSelection(id: string, selected: boolean): void {
    const newSelectedIds = new Set(this.selectedIds);
    if (selected) {
      if (this.selectionMode === 'single') {
        // Для одиночного выбора очищаем предыдущий выбор
        newSelectedIds.clear();
      }
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    this.selectedIds = newSelectedIds;
  }

  /**
   * Проверяет, разрешён ли MIME тип медиа-файла по constraints.
   * @param media Медиа-файл для проверки.
   * @returns `true`, если MIME тип разрешён.
   */
  validateMediaMime(media: ZMedia): boolean {
    if (!this.constraints?.allowed_mimes || this.constraints.allowed_mimes.length === 0) {
      return true;
    }
    return this.constraints.allowed_mimes.includes(media.mime);
  }

  /**
   * Проверяет, разрешён ли MIME тип файла по constraints.
   * @param mime MIME тип для проверки.
   * @returns `true`, если MIME тип разрешён.
   */
  isMimeAllowed(mime: string): boolean {
    if (!this.constraints?.allowed_mimes || this.constraints.allowed_mimes.length === 0) {
      return true;
    }
    return this.constraints.allowed_mimes.includes(mime);
  }

  /**
   * Получает отфильтрованные медиа-файлы по allowed_mimes.
   * @returns Массив отфильтрованных медиа-файлов.
   */
  getFilteredMedia(): ZMedia[] {
    const allMedia = this.tableStore.loader.resp?.data || [];
    if (!this.constraints?.allowed_mimes || this.constraints.allowed_mimes.length === 0) {
      return allMedia;
    }
    return allMedia.filter(media => this.isMimeAllowed(media.mime));
  }

  /**
   * Получает медиа-файл по ID из загруженных данных.
   * @param id ID медиа-файла.
   * @returns Медиа-файл или null, если не найден.
   */
  getMediaById(id: string): ZMedia | null {
    const allMedia = this.tableStore.loader.resp?.data || [];
    return allMedia.find(m => m.id === id) || null;
  }

  /**
   * Валидирует выбранные файлы по MIME-типам и возвращает валидные ID.
   * Показывает уведомления о невалидных файлах.
   * @returns Массив валидных ID.
   */
  validateAndGetValidIds(): string[] {
    const idsArray = Array.from(this.selectedIds);
    const filteredMedia = this.getFilteredMedia();
    const invalidFiles: ZMedia[] = [];
    const validIds: string[] = [];

    for (const id of idsArray) {
      const media = filteredMedia.find(m => m.id === id);
      if (media) {
        if (this.validateMediaMime(media)) {
          validIds.push(id);
        } else {
          invalidFiles.push(media);
        }
      } else {
        // Если файл не найден в текущем списке, всё равно добавляем
        // (может быть загружен на другой странице)
        validIds.push(id);
      }
    }

    // Если есть невалидные файлы, показываем предупреждение
    if (invalidFiles.length > 0) {
      const invalidMimes = invalidFiles.map(m => `${m.name} (${m.mime})`).join(', ');
      notificationService.showError({
        message: 'Некоторые файлы не соответствуют ограничениям',
        description: `Следующие файлы не соответствуют разрешённым MIME-типам: ${invalidMimes}. Они не будут добавлены.`,
        duration: 5,
      });
    }

    return validIds;
  }

  /**
   * Обрабатывает успешную загрузку файла.
   * Обновляет список медиа-файлов.
   */
  async handleUploadSuccess(): Promise<void> {
    await this.tableStore.loader.load();
  }

  /**
   * Открывает Drawer загрузки файлов.
   */
  openUpload(): void {
    this.uploadVisible = true;
  }

  /**
   * Закрывает Drawer загрузки файлов.
   */
  closeUpload(): void {
    this.uploadVisible = false;
  }

  /**
   * Сбрасывает выбранные ID.
   */
  clearSelection(): void {
    this.selectedIds.clear();
  }

  /**
   * Устанавливает предвыбранные ID.
   * @param ids Массив ID для предвыбора.
   */
  setPreselectedIds(ids: string[]): void {
    this.selectedIds = new Set(ids);
  }
}
