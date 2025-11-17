/**
 * Форматирует размер файла в человекочитаемый формат.
 * Преобразует байты в B, KB, MB или GB с двумя знаками после запятой.
 * @param bytes Размер файла в байтах.
 * @returns Отформатированная строка с размером файла.
 * @example
 * formatFileSize(0); // '0 B'
 * formatFileSize(1024); // '1.00 KB'
 * formatFileSize(2048576); // '2.00 MB'
 * formatFileSize(5368709120); // '5.00 GB'
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

/**
 * Форматирует длительность в миллисекундах в человекочитаемый формат.
 * @param milliseconds Длительность в миллисекундах.
 * @returns Отформатированная строка с длительностью.
 * @example
 * formatDuration(1000); // '1 сек'
 * formatDuration(65000); // '1 мин 5 сек'
 * formatDuration(3665000); // '1 ч 1 мин 5 сек'
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} ч`);
  }

  if (minutes % 60 > 0) {
    parts.push(`${minutes % 60} мин`);
  }

  if (seconds % 60 > 0 || parts.length === 0) {
    parts.push(`${seconds % 60} сек`);
  }

  return parts.join(' ');
};

