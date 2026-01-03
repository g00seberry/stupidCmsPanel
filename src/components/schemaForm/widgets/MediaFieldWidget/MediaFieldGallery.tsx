import type { ZMedia } from '@/types/media';
import type { ZId } from '@/types/ZId';
import { Badge, Button } from 'antd';
import { ImagePlus } from 'lucide-react';
import type React from 'react';
import { MediaFieldCard } from './MediaFieldCard';
import { mediaFieldTexts } from './MediaFieldWidget.constants';

/**
 * Пропсы компонента MediaFieldGallery.
 */
interface MediaFieldGalleryProps {
  /** Список медиа-файлов для отображения. */
  mediaList: ZMedia[];
  /** Обработчик удаления медиа-файла. */
  onRemoveMedia: (id: ZId) => void;
  /** Обработчик открытия селектора. */
  onOpenSelector: () => void;
}

/**
 * Компонент для отображения списка медиа-файлов в виде галереи.
 * Показывает кнопку добавления с счетчиком выбранных файлов и сетку с карточками медиа-файлов.
 * Поддерживает пустое состояние с подсказками.
 */
export const MediaFieldGallery: React.FC<MediaFieldGalleryProps> = ({
  mediaList,
  onRemoveMedia,
  onOpenSelector,
}) => {
  const hasMedia = mediaList.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            type="primary"
            size="large"
            icon={<ImagePlus className="w-4 h-4" />}
            onClick={onOpenSelector}
          >
            {mediaFieldTexts.addButtonText}
          </Button>
          {hasMedia && (
            <span className="text-sm text-muted-foreground">
              Выбрано: {mediaList.length} {mediaList.length === 1 ? 'файл' : 'файлов'}
            </span>
          )}
        </div>
      </div>

      {!hasMedia ? (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center bg-muted/30">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ImagePlus className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{mediaFieldTexts.emptyGalleryStateTitle}</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {mediaFieldTexts.emptyGalleryStateDescription}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {mediaList.map(media => (
            <MediaFieldCard key={media.id} media={media} onRemoveMedia={onRemoveMedia} />
          ))}
        </div>
      )}
    </div>
  );
};
