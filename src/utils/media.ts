import {
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  VideoCameraOutlined,
  AudioOutlined,
} from '@ant-design/icons';
import type { MediaKind, ZMedia } from '@/types/media';

/**
 * Возвращает список разрешённых MIME-типов для загрузки медиафайлов.
 * Соответствует конфигурации бэкенда `config/media.php`.
 * @returns Массив строк с MIME-типами.
 * @example
 * const allowedTypes = getAllowedMimeTypes();
 * console.log(allowedTypes); // ['image/jpeg', 'image/png', 'image/webp', ...]
 */
export const getAllowedMimeTypes = (): string[] => {
  return [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'audio/mpeg',
    'application/pdf',
  ];
};

/**
 * Максимальный размер файла для загрузки в байтах.
 * Соответствует настройке `MEDIA_MAX_UPLOAD_MB` из конфигурации бэкенда (по умолчанию 25 МБ).
 */
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 МБ

/**
 * Форматирует размер файла в байтах в читаемый формат.
 * @param bytes Размер файла в байтах.
 * @returns Отформатированная строка с единицами измерения (B, KB, MB, GB).
 * @example
 * formatFileSize(1024); // '1.0 KB'
 * formatFileSize(2356789); // '2.2 MB'
 * formatFileSize(1073741824); // '1.0 GB'
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0 B';
  }

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

/**
 * Форматирует длительность в миллисекундах в формат mm:ss.
 * @param ms Длительность в миллисекундах. Может быть `null`.
 * @returns Отформатированная строка в формате mm:ss или `null`, если длительность не указана.
 * @example
 * formatDuration(125000); // '2:05'
 * formatDuration(5000); // '0:05'
 * formatDuration(null); // null
 */
export const formatDuration = (ms: number | null): string | null => {
  if (ms === null || ms === undefined) {
    return null;
  }

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Возвращает иконку для типа медиафайла.
 * Использует имя иконки из библиотеки иконок Ant Design (если используется) или простую строку.
 * @param kind Тип медиафайла: image, video, audio, document.
 * @param mime Опциональный MIME-тип для более точного определения (например, 'application/pdf').
 * @returns Строка с именем иконки или типом медиа.
 * @example
 * getMediaIcon('image'); // 'FileImageOutlined'
 * getMediaIcon('document', 'application/pdf'); // 'FilePdfOutlined'
 * getMediaIcon('video'); // 'VideoCameraOutlined'
 */
export const getMediaIcon = (kind: MediaKind, mime?: string): string => {
  if (mime === 'application/pdf') {
    return 'FilePdfOutlined';
  }

  switch (kind) {
    case 'image':
      return 'FileImageOutlined';
    case 'video':
      return 'VideoCameraOutlined';
    case 'audio':
      return 'AudioOutlined';
    case 'document':
      return 'FileOutlined';
    default:
      return 'FileOutlined';
  }
};

/**
 * Возвращает компонент иконки для типа медиафайла.
 * @param kind Тип медиафайла: image, video, audio, document.
 * @param mime Опциональный MIME-тип для более точного определения (например, 'application/pdf').
 * @returns React-компонент иконки.
 * @example
 * const Icon = getMediaIconComponent('image');
 * <Icon className="text-4xl" />
 */
export const getMediaIconComponent = (
  kind: MediaKind,
  mime?: string
): typeof FileImageOutlined => {
  const iconName = getMediaIcon(kind, mime);
  const iconMap = {
    FileImageOutlined,
    FilePdfOutlined,
    VideoCameraOutlined,
    AudioOutlined,
    FileOutlined,
  } as const;
  return iconMap[iconName as keyof typeof iconMap] || FileOutlined;
};

/**
 * Валидирует файл перед загрузкой.
 * Проверяет MIME-тип и размер файла (максимум 25 МБ).
 * @param file Файл для валидации.
 * @returns Объект с результатом валидации: `{ valid: boolean; error?: string }`.
 * @example
 * const result = validateMediaFile(file);
 * if (!result.valid) {
 *   console.error(result.error); // 'Неподдерживаемый тип файла' или 'Размер файла превышает 25 МБ'
 * }
 */
export const validateMediaFile = (file: File): { valid: boolean; error?: string } => {
  const allowedMimes = getAllowedMimeTypes();

  if (!allowedMimes.includes(file.type)) {
    return {
      valid: false,
      error: 'Неподдерживаемый тип файла. Разрешены: JPEG, PNG, WebP, GIF, MP4, MP3, PDF.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const maxSizeMB = MAX_FILE_SIZE_BYTES / (1024 * 1024);
    return {
      valid: false,
      error: `Размер файла превышает ${maxSizeMB} МБ. Максимальный размер: ${formatFileSize(MAX_FILE_SIZE_BYTES)}.`,
    };
  }

  return { valid: true };
};

/**
 * Преобразует абсолютный URL в относительный для использования через прокси Vite.
 * Если URL содержит `/api`, возвращает относительный путь для прокси.
 * @param url Абсолютный или относительный URL.
 * @returns Относительный URL для использования через прокси или оригинальный URL.
 * @example
 * normalizeMediaUrl('https://api.stupidcms.dev/api/v1/admin/media/123/preview')
 * // '/api/v1/admin/media/123/preview'
 * normalizeMediaUrl('/api/v1/admin/media/123/preview')
 * // '/api/v1/admin/media/123/preview'
 */
export const normalizeMediaUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // Если это абсолютный URL и содержит /api, возвращаем относительный путь
    if (urlObj.pathname.startsWith('/api')) {
      return urlObj.pathname + urlObj.search;
    }
    // Если это уже относительный URL, возвращаем как есть
    return url;
  } catch {
    // Если это не валидный URL, возвращаем как есть (вероятно, уже относительный)
    return url;
  }
};

/**
 * Возвращает URL превью из объекта медиафайла для указанного варианта.
 * Преобразует абсолютные URL в относительные для использования через прокси Vite.
 * Если вариант не указан, возвращает URL для 'thumbnail' (если доступен).
 * @param media Объект медиафайла с полем `preview_urls`.
 * @param variant Вариант превью: 'thumbnail' или 'medium'. По умолчанию: 'thumbnail'.
 * @returns URL превью из `preview_urls` (нормализованный) или `null`, если вариант недоступен.
 * @example
 * const media = { preview_urls: { thumbnail: 'https://api.stupidcms.dev/api/v1/admin/media/123/preview?variant=thumbnail' } };
 * getPreviewUrl(media); // '/api/v1/admin/media/123/preview?variant=thumbnail'
 * getPreviewUrl(media, 'medium'); // null (если medium недоступен)
 */
export const getPreviewUrl = (media: ZMedia, variant: string = 'thumbnail'): string | null => {
  if (!media.preview_urls || Object.keys(media.preview_urls).length === 0) {
    return null;
  }

  const url = media.preview_urls[variant];
  if (!url) {
    return null;
  }

  return normalizeMediaUrl(url);
};
