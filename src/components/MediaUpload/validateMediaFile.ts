import { formatFileSize } from '@/utils/fileUtils';
import type { ZMediaConfig } from '@/types/media';

/**
 * Валидирует файл перед загрузкой согласно конфигурации.
 * @param file Файл для валидации.
 * @param config Конфигурация системы медиа-файлов.
 * @returns Сообщение об ошибке или null, если файл валиден.
 */
export const validateMediaFile = (file: File, config: ZMediaConfig | null): string | null => {
  if (!config) {
    return 'Конфигурация не загружена';
  }

  if (!config.allowed_mimes.includes(file.type)) {
    return `Тип файла ${file.type} не разрешен. Разрешенные типы: ${config.allowed_mimes.join(', ')}`;
  }

  const maxSizeBytes = config.max_upload_mb * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return `Размер файла ${formatFileSize(file.size)} превышает максимальный ${formatFileSize(maxSizeBytes)}`;
  }

  return null;
};
