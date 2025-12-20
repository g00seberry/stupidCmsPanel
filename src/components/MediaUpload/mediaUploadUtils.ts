import type { UploadFile } from 'antd/es/upload';
import type { FileUploadStatus, FileUploadState } from '@/components/MediaUpload/types';

/**
 * Генерирует уникальный UUID для файла.
 * @returns UUID строка.
 */
export const generateFileUuid = (): string => {
  return crypto.randomUUID();
};

/**
 * Генерирует уникальный идентификатор файла на основе его свойств.
 * @param file Файл для генерации ID.
 * @returns Уникальный идентификатор файла.
 */
export const getFileId = (file: File): string => {
  return `${file.name}-${file.size}-${file.lastModified}`;
};

/**
 * Создает начальное состояние файла для загрузки.
 * @param file Файл для создания состояния.
 * @param status Статус загрузки файла.
 * @param error Опциональное сообщение об ошибке.
 * @returns Начальное состояние загрузки файла.
 */
export const createFileState = (
  file: File,
  status: FileUploadStatus,
  error?: string
): FileUploadState => {
  return {
    file,
    progress: 0,
    status,
    error,
  };
};

/**
 * Преобразует статус файла в статус для Upload компонента Ant Design.
 * @param status Статус загрузки файла.
 * @returns Статус для Upload компонента или undefined.
 */
export const mapStatusToUploadStatus = (status: FileUploadStatus): UploadFile['status'] => {
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
};
