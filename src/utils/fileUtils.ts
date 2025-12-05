/**
 * Форматирует размер файла в читаемый формат.
 * @param bytes Размер в байтах.
 * @returns Отформатированная строка размера (например, "1.5 MB").
 * @example
 * formatFileSize(1024); // '1 KB'
 * formatFileSize(1048576); // '1 MB'
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0 B';
  }
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};
