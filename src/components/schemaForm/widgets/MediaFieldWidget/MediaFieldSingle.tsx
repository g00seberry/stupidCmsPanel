import type { ZMedia } from '@/types/media';
import type { ZId } from '@/types/ZId';
import { Button } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import type React from 'react';
import { MediaFieldCard } from './MediaFieldCard';
import { mediaFieldTexts } from './MediaFieldWidget.constants';

/**
 * Пропсы компонента MediaFieldSingle.
 */
interface MediaFieldSingleProps {
  /** Медиа-файл для отображения (может быть undefined). */
  media?: ZMedia;
  /** Обработчик удаления медиа-файла. */
  onRemoveMedia: (id: ZId) => void;
  /** Обработчик открытия селектора. */
  onOpenSelector: () => void;
}

/**
 * Компонент для отображения одного медиа-файла.
 * Показывает пустое состояние с подсказками, если файл не выбран,
 * или карточку с превью и возможностью замены, если выбран.
 */
export const MediaFieldSingle: React.FC<MediaFieldSingleProps> = ({
  media,
  onRemoveMedia,
  onOpenSelector,
}) => {
  if (!media) {
    return (
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <PictureOutlined className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{mediaFieldTexts.emptySingleStateTitle}</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {mediaFieldTexts.emptySingleStateDescription}
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PictureOutlined />}
            onClick={onOpenSelector}
          >
            {mediaFieldTexts.selectButtonText}
          </Button>
        </div>
      </div>
    );
  }

  return <MediaFieldCard media={media} onRemoveMedia={onRemoveMedia} onReplace={onOpenSelector} />;
};
