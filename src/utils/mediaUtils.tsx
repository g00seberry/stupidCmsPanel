import React from 'react';
import { SoundOutlined, PictureOutlined, FileTextOutlined, VideoCameraOutlined } from '@ant-design/icons';
import type { ZMedia } from '@/types/media';
import { MediaKind, type MediaKindValue } from '@/types/media';

/**
 * Маппинг типов медиа на компоненты иконок.
 */
const MEDIA_ICON_MAP: Record<MediaKindValue, React.ComponentType<{ className?: string }>> = {
  [MediaKind.Image]: PictureOutlined,
  [MediaKind.Video]: VideoCameraOutlined,
  [MediaKind.Audio]: SoundOutlined,
  [MediaKind.Document]: FileTextOutlined,
};

/**
 * Получает иконку для типа медиа-файла.
 * @param kind Тип медиа-файла.
 * @param className CSS классы для иконки. По умолчанию: 'w-8 h-8'.
 * @returns Компонент иконки.
 * @example
 * getMediaIcon('image', 'w-16 h-16 text-blue-500')
 */
export const getMediaIcon = (kind: ZMedia['kind'], className = 'w-8 h-8'): React.ReactElement => {
  const IconComponent = MEDIA_ICON_MAP[kind as MediaKindValue];
  return <IconComponent className={className} />;
};

/**
 * Маппинг типов медиа на цвета тегов.
 */
const MEDIA_TAG_COLOR_MAP: Record<MediaKindValue, string> = {
  [MediaKind.Image]: 'blue',
  [MediaKind.Video]: 'purple',
  [MediaKind.Audio]: 'green',
  [MediaKind.Document]: 'default',
};

/**
 * Получает цвет тега для типа медиа.
 * @param kind Тип медиа-файла.
 * @returns Цвет тега для Ant Design Tag компонента.
 * @example
 * getKindTagColor('image') // 'blue'
 */
export const getKindTagColor = (kind: ZMedia['kind']): string => {
  return MEDIA_TAG_COLOR_MAP[kind as MediaKindValue];
};

/**
 * Маппинг типов медиа на русские названия.
 */
const MEDIA_LABEL_MAP: Record<MediaKindValue, string> = {
  [MediaKind.Image]: 'Изображение',
  [MediaKind.Video]: 'Видео',
  [MediaKind.Audio]: 'Аудио',
  [MediaKind.Document]: 'Документ',
};

/**
 * Получает русское название типа медиа.
 * @param kind Тип медиа-файла.
 * @returns Название типа на русском языке.
 * @example
 * getKindLabel('image') // 'Изображение'
 */
export const getKindLabel = (kind: ZMedia['kind']): string => {
  return MEDIA_LABEL_MAP[kind as MediaKindValue];
};

/**
 * Преобразует абсолютный URL медиа в относительный путь через прокси Vite.
 * Это необходимо для того, чтобы запросы шли через прокси и передавались куки.
 * @param url Абсолютный или относительный URL медиа-файла.
 * @returns Относительный путь через прокси Vite.
 * @example
 * normalizeMediaUrl('http://127.0.0.1:8000/api/v1/media/123?variant=thumbnail')
 * // '/api/v1/media/123?variant=thumbnail'
 * normalizeMediaUrl('http://localhost:8000/api/v1/media/123')
 * // '/api/v1/media/123'
 * normalizeMediaUrl('/api/v1/media/123') // '/api/v1/media/123'
 */
export const normalizeMediaUrl = (url: string): string => {
  // Если URL уже относительный, возвращаем как есть
  if (url.startsWith('/')) {
    return url;
  }

  try {
    const urlObj = new URL(url);
    // Если URL указывает на бэкенд (127.0.0.1:8000 или localhost:8000), преобразуем в относительный путь
    const isBackendHost = urlObj.hostname === '127.0.0.1' || urlObj.hostname === 'localhost';
    // Проверяем явный порт 8000
    const isBackendPort = urlObj.port === '8000';

    if (isBackendHost && isBackendPort) {
      return urlObj.pathname + urlObj.search;
    }
    // Если URL указывает на другой домен, возвращаем как есть
    return url;
  } catch {
    // Если URL невалидный (например, относительный без протокола), возвращаем как есть
    return url;
  }
};
