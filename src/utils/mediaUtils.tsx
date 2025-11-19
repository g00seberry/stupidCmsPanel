import React from 'react';
import { FileAudio, FileImage, FileText, FileVideo } from 'lucide-react';
import type { ZMedia } from '@/types/media';
import { MediaKind, type MediaKindValue } from '@/types/media';

/**
 * Маппинг типов медиа на компоненты иконок.
 */
const MEDIA_ICON_MAP: Record<MediaKindValue, React.ComponentType<{ className?: string }>> = {
  [MediaKind.Image]: FileImage,
  [MediaKind.Video]: FileVideo,
  [MediaKind.Audio]: FileAudio,
  [MediaKind.Document]: FileText,
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
