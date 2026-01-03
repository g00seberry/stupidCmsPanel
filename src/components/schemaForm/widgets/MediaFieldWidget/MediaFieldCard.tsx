import { MediaPreview } from '@/components/MediaPreview';
import type { ZMedia } from '@/types/media';
import type { ZId } from '@/types/ZId';
import { Button, Popconfirm, Tooltip } from 'antd';
import { Edit, Trash2 } from 'lucide-react';
import type React from 'react';
import { mediaFieldTexts } from './MediaFieldWidget.constants';

/**
 * Пропсы компонента MediaFieldCard.
 */
interface MediaFieldCardProps {
  /** Медиа-файл для отображения. */
  media: ZMedia;
  /** Обработчик удаления медиа-файла. */
  onRemoveMedia: (id: ZId) => void;
  /** Обработчик замены медиа-файла (опционально). */
  onReplace?: () => void;
}

/**
 * Компонент карточки медиа-файла с превью и кнопками управления.
 * Поддерживает контекстное управление: клик по карточке для замены, кнопка удаления с подтверждением.
 */
export const MediaFieldCard: React.FC<MediaFieldCardProps> = ({
  media,
  onRemoveMedia,
  onReplace,
}) => {
  const handleCardClick = () => {
    if (onReplace) {
      onReplace();
    }
  };

  return (
    <div
      className={`relative w-full group ${onReplace ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
      role={onReplace ? 'button' : undefined}
      tabIndex={onReplace ? 0 : undefined}
      onKeyDown={e => {
        if (onReplace && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={onReplace ? mediaFieldTexts.clickToReplaceHint : undefined}
    >
      <div className="relative">
        <MediaPreview media={media} showInfo={true} imageVariant="medium" />
        {onReplace && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Tooltip title={mediaFieldTexts.replaceButtonText}>
              <Button
                type="primary"
                icon={<Edit className="w-4 h-4" />}
                size="large"
                onClick={e => {
                  e.stopPropagation();
                  onReplace();
                }}
                aria-label={mediaFieldTexts.replaceButtonText}
              >
                {mediaFieldTexts.replaceButtonText}
              </Button>
            </Tooltip>
          </div>
        )}
      </div>

      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Popconfirm
          title={mediaFieldTexts.deleteConfirmTitle}
          description={mediaFieldTexts.deleteConfirmDescription}
          onConfirm={e => {
            e?.stopPropagation();
            onRemoveMedia(media.id);
          }}
          onCancel={e => e?.stopPropagation()}
          okText="Удалить"
          cancelText="Отмена"
          okType="danger"
        >
          <Button
            type="primary"
            danger
            icon={<Trash2 className="w-4 h-4" />}
            size="small"
            onClick={e => e.stopPropagation()}
            aria-label={mediaFieldTexts.removeButtonText}
          />
        </Popconfirm>
      </div>
    </div>
  );
};
