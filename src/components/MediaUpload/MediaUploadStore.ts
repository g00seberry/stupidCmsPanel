import { bulkUploadMedia } from '@/api/apiMedia';
import {
  createFileState,
  generateFileUuid,
  mapStatusToUploadStatus,
} from '@/components/MediaUpload/mediaUploadUtils';
import type { ZMedia, ZMediaConfig } from '@/types/media';
import { onError } from '@/utils/onError';
import type { UploadFile } from 'antd/es/upload';
import { makeAutoObservable } from 'mobx';
import type { FileUploadState } from './types';
import { validateMediaFile } from './validateMediaFile';

export type { FileUploadState, FileUploadStatus } from './types';

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
  readonly uploadStates = new Map<string, FileUploadState>();

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
   * Добавляет файл в список загрузки.
   * Валидирует файл сразу после добавления.
   * Присваивает файлу уникальный UUID.
   */
  addFile(file: File): void {
    const fileId = generateFileUuid();

    const validationError = validateMediaFile(file, this.config);

    if (validationError) {
      const state = createFileState(file, 'error', validationError);
      this.uploadStates.set(fileId, state);
      this.callbacks.onError?.(new Error(validationError), file);
    } else {
      const state = createFileState(file, 'pending');
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
   * Получает список файлов со статусом pending с их UUID.
   * @returns Массив объектов с fileId и file.
   */
  get pendingFiles(): Array<{ fileId: string; file: File }> {
    return Array.from(this.uploadStates.entries())
      .filter(([_fileId, state]) => state.status === 'pending')
      .map(([fileId, state]) => ({ fileId, file: state.file }));
  }

  /**
   * Устанавливает статус uploading для указанных файлов по их UUID.
   */
  private setUploadingStatus(fileIds: string[]): void {
    fileIds.forEach(fileId => {
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
   * Обрабатывает успешную загрузку файла.
   */
  private handleFileSuccess(fileId: string, media: ZMedia): void {
    const existingState = this.uploadStates.get(fileId);
    if (!existingState) {
      return;
    }
    this.uploadStates.set(fileId, {
      ...existingState,
      progress: 100,
      status: 'success',
      media,
    });
    this.callbacks.onSuccess?.(media);
  }

  /**
   * Обрабатывает ошибку загрузки файла.
   */
  private handleFileError(fileId: string, error: Error): void {
    const existingState = this.uploadStates.get(fileId);
    if (!existingState) {
      return;
    }
    this.uploadStates.set(fileId, {
      ...existingState,
      progress: 0,
      status: 'error',
      error: error.message,
    });
    this.callbacks.onError?.(error, existingState.file);
  }

  /**
   * Обрабатывает успешно загруженный батч файлов.
   * Использует индекс для сопоставления файлов с результатами (порядок сохранен API).
   */
  private processBatchResults(
    batch: Array<{ fileId: string; file: File }>,
    mediaArray: ZMedia[]
  ): void {
    batch.forEach(({ fileId }, index) => {
      const media = mediaArray[index];

      if (media) {
        this.handleFileSuccess(fileId, media);
      } else {
        const error = new Error('Файл не был загружен');
        this.handleFileError(fileId, error);
      }
    });

    this.callbacks.onBatchSuccess?.(batch.length);
  }

  /**
   * Обрабатывает ошибку загрузки батча.
   */
  private processBatchError(batch: Array<{ fileId: string; file: File }>, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки файлов';
    const err = error instanceof Error ? error : new Error(errorMessage);

    batch.forEach(({ fileId }) => {
      this.handleFileError(fileId, err);
    });

    onError(error);
  }

  /**
   * Загружает один батч файлов.
   */
  private async uploadBatch(batch: Array<{ fileId: string; file: File }>): Promise<void> {
    try {
      const files = batch.map(item => item.file);
      const mediaArray = await bulkUploadMedia(files);
      this.processBatchResults(batch, mediaArray);
    } catch (error) {
      this.processBatchError(batch, error);
    }
  }

  /**
   * Загружает все файлы со статусом pending.
   */
  async startUpload(): Promise<void> {
    const pendingFiles = this.pendingFiles;

    if (pendingFiles.length === 0) {
      return;
    }

    this.isUploading = true;
    this.callbacks.onUploadingChange?.(true);
    const fileIds = pendingFiles.map(item => item.fileId);
    this.setUploadingStatus(fileIds);

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
   * Возвращает список файлов для Upload компонента.
   */
  get fileList(): UploadFile[] {
    return Array.from(this.uploadStates.entries()).map(([fileId, state]) => ({
      uid: fileId,
      name: state.file.name,
      status: mapStatusToUploadStatus(state.status),
      percent: state.progress,
      error: state.error,
    }));
  }

  /**
   * Возвращает массив пар [fileId, state] для всех файлов.
   * @returns Массив записей состояний файлов.
   */
  get uploadStatesEntries(): Array<[string, FileUploadState]> {
    return Array.from(this.uploadStates.entries());
  }
}
