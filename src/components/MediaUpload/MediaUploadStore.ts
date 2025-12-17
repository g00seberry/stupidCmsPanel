import { bulkUploadMedia } from '@/api/apiMedia';
import { onError } from '@/utils/onError';
import { formatFileSize } from '@/utils/fileUtils';
import type { ZMedia, ZMediaConfig } from '@/types/media';
import { makeAutoObservable, observable } from 'mobx';
import type { UploadFile } from 'antd/es/upload';

/** Статус загрузки файла. */
export type FileUploadStatus = 'pending' | 'uploading' | 'success' | 'error';

/** Состояние загрузки одного файла. */
export type FileUploadState = {
  file: File;
  progress: number;
  status: FileUploadStatus;
  media?: ZMedia;
  error?: string;
};

/** Интерфейс колбэков для MediaUploadStore. */
export interface MediaUploadStoreCallbacks {
  /** Колбэк успешной загрузки файла. */
  onSuccess?: (media: ZMedia) => void;
  /** Колбэк ошибки загрузки. */
  onError?: (error: Error, file: File) => void;
  /** Колбэк завершения всех загрузок. */
  onAllComplete?: () => void;
  /** Колбэк изменения состояния загрузки. */
  onUploadingChange?: (isUploading: boolean) => void;
  /** Колбэк успешной загрузки батча. */
  onBatchSuccess?: (count: number) => void;
}

/** Размер батча для загрузки файлов. */
const BATCH_SIZE = 50;

/**
 * Store для управления состоянием загрузки медиа-файлов.
 */
export class MediaUploadStore {
  /** Карта состояний загрузки файлов (fileId -> FileUploadState). */
  readonly uploadStates = observable.map<string, FileUploadState>();

  /** Флаг выполнения загрузки. */
  isUploading = false;

  /** Конфигурация системы медиа-файлов. */
  config: ZMediaConfig | null = null;

  /** Колбэки для обработки событий. */
  private callbacks: MediaUploadStoreCallbacks = {};

  constructor(config: ZMediaConfig | null = null) {
    this.config = config;
    makeAutoObservable(this);
  }

  /**
   * Устанавливает конфигурацию системы медиа-файлов.
   */
  setConfig(config: ZMediaConfig | null): void {
    this.config = config;
  }

  /**
   * Устанавливает колбэки.
   */
  setCallbacks(callbacks: MediaUploadStoreCallbacks): void {
    this.callbacks = callbacks;
  }

  /**
   * Генерирует уникальный идентификатор файла.
   */
  private getFileId(file: File): string {
    return `${file.name}-${file.size}-${file.lastModified}`;
  }

  /**
   * Валидирует файл перед загрузкой.
   * @returns Сообщение об ошибке или null, если файл валиден.
   */
  validateFile(file: File): string | null {
    if (!this.config) {
      return 'Конфигурация не загружена';
    }

    if (!this.config.allowed_mimes.includes(file.type)) {
      return `Тип файла ${file.type} не разрешен. Разрешенные типы: ${this.config.allowed_mimes.join(', ')}`;
    }

    const maxSizeBytes = this.config.max_upload_mb * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      return `Размер файла ${formatFileSize(file.size)} превышает максимальный ${formatFileSize(maxSizeBytes)}`;
    }

    return null;
  }

  /**
   * Создает начальное состояние файла.
   */
  private createFileState(file: File, status: FileUploadStatus, error?: string): FileUploadState {
    return {
      file,
      progress: 0,
      status,
      error,
    };
  }

  /**
   * Добавляет файл в список загрузки.
   * Валидирует файл сразу после добавления.
   */
  addFile(file: File): void {
    const fileId = this.getFileId(file);

    if (this.uploadStates.has(fileId)) {
      return;
    }

    const validationError = this.validateFile(file);

    if (validationError) {
      const state = this.createFileState(file, 'error', validationError);
      this.uploadStates.set(fileId, state);
      this.callbacks.onError?.(new Error(validationError), file);
    } else {
      const state = this.createFileState(file, 'pending');
      this.uploadStates.set(fileId, state);
    }
  }

  /**
   * Удаляет файл из списка загрузки.
   */
  removeFile(fileId: string): void {
    this.uploadStates.delete(fileId);
  }

  /**
   * Удаляет файл по объекту File.
   */
  removeFileByFile(file: File): void {
    const fileId = this.getFileId(file);
    this.removeFile(fileId);
  }

  /**
   * Получает список файлов со статусом pending.
   */
  private getPendingFiles(): File[] {
    return Array.from(this.uploadStates.values())
      .filter(state => state.status === 'pending')
      .map(state => state.file);
  }

  /**
   * Устанавливает статус uploading для указанных файлов.
   */
  private setUploadingStatus(files: File[]): void {
    files.forEach(file => {
      const fileId = this.getFileId(file);
      const existingState = this.uploadStates.get(fileId);
      if (existingState) {
        this.uploadStates.set(fileId, {
          ...existingState,
          status: 'uploading',
        });
      }
    });
  }

  /**
   * Находит медиа-файл по имени файла в массиве результатов.
   */
  private findMediaByFileName(
    mediaArray: ZMedia[],
    fileName: string,
    index: number
  ): ZMedia | undefined {
    // Сначала пытаемся найти по индексу (если порядок сохранен)
    if (index < mediaArray.length) {
      const mediaByIndex = mediaArray[index];
      if (mediaByIndex.name === fileName) {
        return mediaByIndex;
      }
    }

    // Если не нашли по индексу, ищем по имени
    return mediaArray.find(m => m.name === fileName);
  }

  /**
   * Обрабатывает успешную загрузку файла.
   */
  private handleFileSuccess(file: File, media: ZMedia): void {
    const fileId = this.getFileId(file);
    this.uploadStates.set(fileId, {
      file,
      progress: 100,
      status: 'success',
      media,
    });
    this.callbacks.onSuccess?.(media);
  }

  /**
   * Обрабатывает ошибку загрузки файла.
   */
  private handleFileError(file: File, error: Error): void {
    const fileId = this.getFileId(file);
    this.uploadStates.set(fileId, {
      file,
      progress: 0,
      status: 'error',
      error: error.message,
    });
    this.callbacks.onError?.(error, file);
  }

  /**
   * Обрабатывает успешно загруженный батч файлов.
   */
  private processBatchResults(batch: File[], mediaArray: ZMedia[]): void {
    batch.forEach((file, index) => {
      const media = this.findMediaByFileName(mediaArray, file.name, index);

      if (media) {
        this.handleFileSuccess(file, media);
      } else {
        const error = new Error('Файл не был загружен');
        this.handleFileError(file, error);
      }
    });

    this.callbacks.onBatchSuccess?.(batch.length);
  }

  /**
   * Обрабатывает ошибку загрузки батча.
   */
  private processBatchError(batch: File[], error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки файлов';
    const err = error instanceof Error ? error : new Error(errorMessage);

    batch.forEach(file => {
      this.handleFileError(file, err);
    });

    onError(error);
  }

  /**
   * Загружает один батч файлов.
   */
  private async uploadBatch(batch: File[]): Promise<void> {
    try {
      const mediaArray = await bulkUploadMedia(batch);
      this.processBatchResults(batch, mediaArray);
    } catch (error) {
      this.processBatchError(batch, error);
    }
  }

  /**
   * Загружает все файлы со статусом pending.
   */
  async startUpload(): Promise<void> {
    const pendingFiles = this.getPendingFiles();

    if (pendingFiles.length === 0) {
      return;
    }

    this.isUploading = true;
    this.callbacks.onUploadingChange?.(true);
    this.setUploadingStatus(pendingFiles);

    try {
      // Загружаем файлы батчами
      for (let i = 0; i < pendingFiles.length; i += BATCH_SIZE) {
        const batch = pendingFiles.slice(i, i + BATCH_SIZE);
        await this.uploadBatch(batch);
      }
    } finally {
      this.isUploading = false;
      this.callbacks.onUploadingChange?.(false);
      this.callbacks.onAllComplete?.();
    }
  }

  /**
   * Проверяет наличие валидных файлов в статусе pending.
   */
  get hasPendingFiles(): boolean {
    return Array.from(this.uploadStates.values()).some(
      state => state.status === 'pending' && !state.error
    );
  }

  /**
   * Проверяет наличие активных загрузок.
   */
  get hasActiveUploads(): boolean {
    return Array.from(this.uploadStates.values()).some(state => state.status === 'uploading');
  }

  /**
   * Преобразует статус файла в статус для Upload компонента.
   */
  private mapStatusToUploadStatus(status: FileUploadStatus): UploadFile['status'] {
    switch (status) {
      case 'uploading':
        return 'uploading';
      case 'success':
        return 'done';
      case 'error':
        return 'error';
      default:
        return undefined;
    }
  }

  /**
   * Возвращает список файлов для Upload компонента.
   */
  get fileList(): UploadFile[] {
    return Array.from(this.uploadStates.values()).map(state => ({
      uid: this.getFileId(state.file),
      name: state.file.name,
      status: this.mapStatusToUploadStatus(state.status),
      percent: state.progress,
      error: state.error,
    }));
  }

  /**
   * Получает состояние файла по его ID.
   */
  getFileState(fileId: string): FileUploadState | undefined {
    return this.uploadStates.get(fileId);
  }

  /**
   * Очищает все состояния загрузки.
   */
  clear(): void {
    this.uploadStates.clear();
    this.isUploading = false;
  }
}
