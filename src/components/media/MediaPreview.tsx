import { useState } from 'react';
import { Image, Space, Typography } from 'antd';
import { AudioOutlined, ZoomInOutlined } from '@ant-design/icons';
import type { ZMedia } from '@/types/media';
import {
  getMediaIconComponent,
  getPreviewUrl,
  formatFileSize,
  formatDuration,
  normalizeMediaUrl,
} from '@/utils/media';
import { getMediaDownloadUrl } from '@/api/apiMedia';

const { Text } = Typography;

/**
 * Пропсы компонента превью медиафайла.
 */
export type PropsMediaPreview = {
  /** Данные медиафайла. */
  media: ZMedia;
  /** Вариант превью для изображений: 'thumbnail' (max 320px) или 'medium' (max 1024px). По умолчанию: 'thumbnail'. */
  variant?: string;
  /** Возможность увеличения изображений через zoom. По умолчанию: true. */
  zoomable?: boolean;
};

/**
 * Компонент превью медиафайла.
 * Отображает превью в зависимости от типа медиафайла: изображения, видео, аудио или документы.
 * @example
 * <MediaPreview
 *   media={media}
 *   variant="medium"
 *   zoomable
 * />
 */
export const MediaPreview: React.FC<PropsMediaPreview> = ({
  media,
  variant = 'thumbnail',
  zoomable = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const previewUrl = getPreviewUrl(media, variant);
  const downloadUrl = normalizeMediaUrl(getMediaDownloadUrl(media.id));
  const IconComponent = getMediaIconComponent(media.kind, media.mime);

  // Изображения
  if (media.kind === 'image') {
    if (previewUrl && !imageError) {
      return (
        <div className="relative w-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={previewUrl}
            alt={media.alt || media.name}
            className="max-w-full max-h-[600px] object-contain"
            preview={zoomable ? { mask: <ZoomInOutlined /> } : false}
            fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='14'%3EOшибка загрузки%3C/text%3E%3C/svg%3E"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      );
    }
    // Fallback если превью недоступно
    return (
      <div className="relative w-full flex flex-col items-center justify-center bg-gray-100 rounded-lg p-8 min-h-[300px]">
        <IconComponent className="text-6xl text-gray-400 mb-4" />
        <Text type="secondary" className="text-sm">
          Превью недоступно
        </Text>
        {media.width && media.height && (
          <Text type="secondary" className="text-xs mt-2">
            {media.width}×{media.height} пикселей
          </Text>
        )}
      </div>
    );
  }

  // Видео
  if (media.kind === 'video') {
    return (
      <div className="w-full">
        <video
          src={downloadUrl}
          controls
          className="w-full max-h-[600px] rounded-lg"
          preload="metadata"
        >
          Ваш браузер не поддерживает воспроизведение видео.
        </video>
        {media.duration_ms && (
          <div className="mt-2 text-sm text-gray-500">
            Длительность: {formatDuration(media.duration_ms)}
          </div>
        )}
      </div>
    );
  }

  // Аудио
  if (media.kind === 'audio') {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-8 mb-4">
          <AudioOutlined className="text-6xl text-gray-400 mb-4" />
          <Text strong>{media.title || media.name}</Text>
        </div>
        <audio src={downloadUrl} controls className="w-full" preload="metadata">
          Ваш браузер не поддерживает воспроизведение аудио.
        </audio>
        {media.duration_ms && (
          <div className="mt-2 text-sm text-gray-500 text-center">
            Длительность: {formatDuration(media.duration_ms)}
          </div>
        )}
      </div>
    );
  }

  // Документы (PDF и другие)
  if (media.kind === 'document') {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-8 min-h-[400px]">
          <IconComponent className="text-8xl text-gray-400 mb-4" />
          <Space direction="vertical" align="center" size="small">
            <Text strong className="text-lg">
              {media.title || media.name}
            </Text>
            <Text type="secondary">{media.ext.toUpperCase()}</Text>
            <Text type="secondary">{formatFileSize(media.size_bytes)}</Text>
            {media.mime === 'application/pdf' && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                Открыть в новой вкладке
              </a>
            )}
          </Space>
        </div>
      </div>
    );
  }

  // Неизвестный тип медиафайла
  return (
    <div className="relative w-full flex flex-col items-center justify-center bg-gray-100 rounded-lg p-8 min-h-[300px]">
      <IconComponent className="text-6xl text-gray-400 mb-4" />
      <Text type="secondary" className="text-sm">
        {media.name}
      </Text>
      <Text type="secondary" className="text-xs mt-2">
        {formatFileSize(media.size_bytes)}
      </Text>
    </div>
  );
};
