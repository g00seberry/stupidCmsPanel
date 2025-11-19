import React from 'react';
import type { ZMedia } from '@/types/media';
import { Card, Checkbox, Image, Tag, Tooltip } from 'antd';
import { Trash2, RotateCcw } from 'lucide-react';
import { joinClassNames } from '@/utils/joinClassNames';
import { formatFileSize } from '@/utils/fileUtils';
import { getMediaIcon, getKindTagColor, getKindLabel } from '@/utils/mediaUtils';

/**
 * Пропсы компонента карточки медиа-файла.
 */
export type PropsMediaCard = {
  /** Медиа-файл для отображения. */
  media: ZMedia;
  /** Флаг возможности выбора карточки. */
  selectable?: boolean;
  /** Флаг выбранности карточки. */
  selected?: boolean;
  /** Обработчик изменения выбранности. */
  onSelectChange?: (id: string, selected: boolean) => void;
  /** Обработчик клика по карточке. */
  onClick?: (media: ZMedia) => void;
  /** Обработчик удаления. */
  onDelete?: (id: string) => void;
  /** Обработчик восстановления (для удаленных файлов). */
  onRestore?: (id: string) => void;
};

/**
 * Форматирует дату в короткий формат.
 * @param dateString Строка даты в формате ISO 8601.
 * @returns Отформатированная дата.
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Компонент карточки медиа-файла.
 * Отображает превью, метаданные и действия для медиа-файла.
 */
export const MediaCard: React.FC<PropsMediaCard> = ({
  media,
  selectable = false,
  selected = false,
  onSelectChange,
  onClick,
  onDelete,
  onRestore,
}) => {
  /**
   * Обрабатывает клик по карточке.
   */
  const handleClick = () => {
    onClick?.(media);
  };

  /**
   * Обрабатывает изменение выбранности.
   */
  const handleSelectChange = (checked: boolean) => {
    onSelectChange?.(media.id, checked);
  };

  /**
   * Обрабатывает клик по кнопке удаления.
   */
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(media.id);
  };

  /**
   * Обрабатывает клик по чекбоксу.
   */
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const displayTitle = media.title || media.name;
  const isDeleted = media.deleted_at !== null;

  return (
    <Card
      hoverable
      className={joinClassNames(
        'relative group',
        isDeleted && 'opacity-60',
        onClick && 'cursor-pointer'
      )}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Открыть ${displayTitle}` : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
      cover={
        <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          {media.kind === 'image' ? (
            <Image
              src={media.preview_urls.thumbnail}
              alt={media.alt || displayTitle}
              className="w-full h-full object-cover"
              preview={false}
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
              {getMediaIcon(media.kind, 'w-8 h-8 text-gray-400')}
            </div>
          )}
          {selectable && (
            <div
              className="absolute top-2 left-2 z-10"
              onClick={handleCheckboxClick}
              role="checkbox"
              aria-checked={selected}
              aria-label={`Выбрать ${displayTitle}`}
            >
              <Checkbox checked={selected} onChange={e => handleSelectChange(e.target.checked)} />
            </div>
          )}
          {isDeleted && (
            <div className="absolute top-2 right-2 z-10">
              <Tag color="red">Удалено</Tag>
            </div>
          )}
          {onDelete && !isDeleted && (
            <div
              className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleDelete}
              role="button"
              aria-label={`Удалить ${displayTitle}`}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete?.(media.id);
                }
              }}
            >
              <Tooltip title="Удалить">
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
                  <Trash2 className="w-4 h-4 text-white" />
                </div>
              </Tooltip>
            </div>
          )}
          {onRestore && isDeleted && (
            <div
              className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={e => {
                e.stopPropagation();
                onRestore(media.id);
              }}
              role="button"
              aria-label={`Восстановить ${displayTitle}`}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onRestore(media.id);
                }
              }}
            >
              <Tooltip title="Восстановить">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors">
                  <RotateCcw className="w-4 h-4 text-white" />
                </div>
              </Tooltip>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Tooltip title={displayTitle}>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{displayTitle}</div>
            </div>
          </Tooltip>
          <Tag color={getKindTagColor(media.kind)} className="text-xs flex-shrink-0">
            {getKindLabel(media.kind)}
          </Tag>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatFileSize(media.size_bytes)}</span>
          <span>{formatDate(media.created_at)}</span>
        </div>
        {media.collection && (
          <div className="text-xs text-gray-400 truncate">Коллекция: {media.collection}</div>
        )}
      </div>
    </Card>
  );
};

// Мемоизация компонента для оптимизации рендеринга
export const MediaCardMemo = React.memo(MediaCard);
