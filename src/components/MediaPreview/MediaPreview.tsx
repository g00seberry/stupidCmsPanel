import { useState } from 'react';
import { Image, FileText, Film, Music, File, ImageOff } from 'lucide-react';
import { getMediaPreviewUrl } from '@/api/apiMedia';
import { formatFileSize } from '@/utils/formatters';
import type { ZMedia } from '@/types/media';

/**
 * Пропсы компонента MediaPreview.
 */
export type PropsMediaPreview = {
  /** Медиа-файл для отображения. */
  media: ZMedia;
  /** Размер превью. По умолчанию: 'medium'. */
  size?: 'small' | 'medium' | 'large';
  /** Отображать информацию о файле под превью. По умолчанию: false. */
  showInfo?: boolean;
  /** Обработчик клика по превью. */
  onClick?: () => void;
  /** Дополнительные CSS классы. */
  className?: string;
};

/**
 * Возвращает иконку для типа медиа-файла.
 * @param kind Тип медиа-файла.
 * @returns JSX элемент с иконкой.
 */
const getMediaIcon = (kind: string) => {
  const iconProps = { className: 'w-12 h-12 text-muted-foreground' };

  switch (kind) {
    case 'image':
      return <Image {...iconProps} />;
    case 'video':
      return <Film {...iconProps} />;
    case 'audio':
      return <Music {...iconProps} />;
    case 'document':
      return <FileText {...iconProps} />;
    default:
      return <File {...iconProps} />;
  }
};

/**
 * Компонент для отображения превью медиа-файла.
 * Отображает изображения через img тег, для других типов показывает иконки.
 */
export const MediaPreview: React.FC<PropsMediaPreview> = ({
  media,
  size = 'medium',
  showInfo = false,
  onClick,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-48 h-48',
    large: 'w-64 h-64',
  };

  const containerClasses = `
    ${sizeClasses[size]} 
    flex items-center justify-center 
    bg-muted 
    rounded-lg 
    overflow-hidden
    ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
    ${className}
  `.trim();

  const renderPreview = () => {
    if (media.kind === 'image' && !imageError) {
      // Определяем вариант в зависимости от размера
      // Используем доступные варианты: thumbnail, medium (large не настроен на сервере)
      const variantMap: Record<typeof size, string> = {
        small: 'thumbnail',
        medium: 'medium',
        large: 'medium', // fallback на medium, так как large не настроен
      };
      const variant = variantMap[size];

      // Всегда используем публичный API через getMediaPreviewUrl
      // Это гарантирует использование правильного эндпоинта без аутентификации
      const previewUrl = getMediaPreviewUrl(media.id, variant);

      return (
        <img
          src={previewUrl}
          alt={media.alt || media.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      );
    }

    // Показываем иконку для не-изображений или если изображение не загрузилось
    return (
      <div className="flex items-center justify-center w-full h-full">
        {imageError ? (
          <ImageOff className="w-12 h-12 text-muted-foreground" />
        ) : (
          getMediaIcon(media.kind)
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className={containerClasses} onClick={onClick}>
        {renderPreview()}
      </div>

      {showInfo && (
        <div className="text-xs text-muted-foreground">
          <div className="font-medium truncate" title={media.name}>
            {media.title || media.name}
          </div>
          <div className="flex items-center gap-2">
            <span>{formatFileSize(media.size_bytes)}</span>
            {media.width && media.height && (
              <span>
                {media.width}×{media.height}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
