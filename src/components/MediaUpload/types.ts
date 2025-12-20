import type { ZMedia } from '@/types/media';

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
