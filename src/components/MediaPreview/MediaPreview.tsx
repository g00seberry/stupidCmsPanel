import { Button, Image } from 'antd';
import type { ZMedia, ZMediaImage, ZMediaVideo, ZMediaAudio } from '@/types/media';
import { getMediaIcon, getKindLabel } from '@/utils/mediaUtils';
import { joinClassNames } from '@/utils/joinClassNames';

/**
 * Пропсы компонента предпросмотра медиа-файла.
 */
export type PropsMediaPreview = {
  /** Медиа-файл для предпросмотра. */
  media: ZMedia;
  /** Размер варианта изображения для отображения. По умолчанию: 'medium'. */
  imageVariant?: 'thumbnail' | 'medium' | 'large';
  /** Показывать ли кнопку "Открыть файл" для не-изображений. По умолчанию: true. */
  showOpenButton?: boolean;
  /** Показывать ли информацию о файле. По умолчанию: false. */
  showInfo?: boolean;
  /** Дополнительный класс для контейнера. */
  className?: string;
  /** Автовоспроизведение для видео/аудио. По умолчанию: false. */
  autoPlay?: boolean;
  /** Показывать controls для видео/аудио. По умолчанию: true. */
  showControls?: boolean;
};

/**
 * Компонент предпросмотра медиа-файла.
 * Поддерживает отображение изображений, видео, аудио и документов с соответствующими элементами управления.
 */
export const MediaPreview: React.FC<PropsMediaPreview> = ({
  media,
  imageVariant = 'medium',
  showOpenButton = true,
  showInfo = false,
  className,
  autoPlay = false,
  showControls = true,
}) => {
  /**
   * Рендерит предпросмотр изображения.
   */
  const renderImage = (imageMedia: ZMediaImage) => {
    const getPreviewUrl = (variant: typeof imageVariant): string => {
      switch (variant) {
        case 'large':
          return imageMedia.preview_urls.large;
        case 'medium':
          return imageMedia.preview_urls.medium;
        case 'thumbnail':
          return imageMedia.preview_urls.thumbnail;
        default:
          return imageMedia.preview_urls.medium;
      }
    };

    const previewUrl = getPreviewUrl(imageVariant);
    const fullSizeUrl = imageMedia.preview_urls.large || imageMedia.url;

    return (
      <Image
        src={previewUrl}
        alt={imageMedia.alt || imageMedia.title || imageMedia.name}
        className="max-w-full h-auto rounded"
        loading="lazy"
        preview={{
          src: fullSizeUrl,
        }}
      />
    );
  };

  /**
   * Рендерит предпросмотр видео.
   */
  const renderVideo = (videoMedia: ZMediaVideo) => {
    return (
      <video
        src={videoMedia.url}
        controls={showControls}
        autoPlay={autoPlay}
        className="max-w-full h-auto rounded"
        style={{ maxHeight: '600px' }}
      >
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    );
  };

  /**
   * Рендерит предпросмотр аудио.
   */
  const renderAudio = (audioMedia: ZMediaAudio) => {
    return (
      <div className="w-full">
        <audio src={audioMedia.url} controls={showControls} autoPlay={autoPlay} className="w-full">
          Ваш браузер не поддерживает воспроизведение аудио.
        </audio>
      </div>
    );
  };

  /**
   * Рендерит предпросмотр документа.
   */
  const renderDocument = () => {
    return (
      <div className="flex flex-col items-center gap-4">
        {getMediaIcon(media.kind, 'w-16 h-16 text-muted-foreground')}
        <div className="text-center">
          <div className="font-medium">{media.name}</div>
          <div className="text-sm text-muted-foreground mt-1">{getKindLabel(media.kind)}</div>
        </div>
        {showOpenButton && (
          <Button type="link" href={media.url} target="_blank" rel="noopener noreferrer">
            Открыть файл
          </Button>
        )}
      </div>
    );
  };

  /**
   * Рендерит информацию о файле.
   */
  const renderInfo = () => {
    if (!showInfo) {
      return null;
    }

    return (
      <div className="mt-4 pt-4 border-t text-xs text-muted-foreground space-y-1">
        <div>Имя: {media.name}</div>
        <div>Тип: {media.mime}</div>
        {media.kind === 'image' && (
          <div>
            Разрешение: {(media as ZMediaImage).width} × {(media as ZMediaImage).height} px
          </div>
        )}
        {(media.kind === 'video' || media.kind === 'audio') && (
          <div>
            Длительность: {Math.round((media as ZMediaVideo | ZMediaAudio).duration_ms / 1000)} сек
          </div>
        )}
      </div>
    );
  };

  /**
   * Рендерит предпросмотр в зависимости от типа медиа.
   */
  const renderPreview = () => {
    if (media.kind === 'image' && (media as ZMediaImage).preview_urls) {
      return renderImage(media as ZMediaImage);
    }
    if (media.kind === 'video') {
      return renderVideo(media as ZMediaVideo);
    }
    if (media.kind === 'audio') {
      return renderAudio(media as ZMediaAudio);
    }
    return renderDocument();
  };

  return (
    <div
      className={joinClassNames(
        'flex flex-col items-center justify-center p-6 bg-muted rounded-lg',
        className
      )}
    >
      {renderPreview()}
      {renderInfo()}
    </div>
  );
};
