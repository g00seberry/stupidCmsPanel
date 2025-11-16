import { DeleteOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Image, Space, Tag, Tooltip } from 'antd';
import type { ZMedia } from '@/types/media';
import { formatFileSize, getMediaIconComponent, getPreviewUrl } from '@/utils/media';

/**
 * Пропсы компонента карточки медиафайла.
 */
export type PropsMediaCard = {
  /** Данные медиафайла. */
  media: ZMedia;
  /** Возможность выбора медиафайла через checkbox. */
  selectable?: boolean;
  /** Состояние выбора медиафайла. */
  selected?: boolean;
  /** Показывать действия (редактировать, удалить, скачать). */
  showActions?: boolean;
  /** Обработчик клика по карточке. */
  onClick?: (media: ZMedia) => void;
  /** Обработчик изменения состояния выбора. */
  onSelect?: (media: ZMedia, selected: boolean) => void;
  /** Обработчик редактирования медиафайла. */
  onEdit?: (media: ZMedia) => void;
  /** Обработчик удаления медиафайла. */
  onDelete?: (media: ZMedia) => void;
  /** Обработчик скачивания медиафайла. */
  onDownload?: (media: ZMedia) => void;
};

/**
 * Компонент карточки медиафайла для отображения в списке.
 * Отображает превью, название, метаданные и действия для управления медиафайлом.
 * @example
 * <MediaCard
 *   media={media}
 *   selectable
 *   selected={selectedIds.includes(media.id)}
 *   showActions
 *   onSelect={(media, selected) => handleSelect(media.id, selected)}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onDownload={handleDownload}
 * />
 */
export const MediaCard: React.FC<PropsMediaCard> = ({
  media,
  selectable = false,
  selected = false,
  showActions = true,
  onClick,
  onSelect,
  onEdit,
  onDelete,
  onDownload,
}) => {
  const previewUrl = getPreviewUrl(media, 'thumbnail');
  const IconComponent = getMediaIconComponent(media.kind, media.mime);

  const handleCardClick = () => onClick?.(media);
  const handleCheckboxChange = (e: { target: { checked: boolean } }) =>
    onSelect?.(media, e.target.checked);
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(media);
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(media);
  };
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.(media);
  };

  return (
    <Card
      hoverable
      className="relative h-full"
      onClick={handleCardClick}
      cover={
        <div className="relative bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
          {previewUrl && media.kind === 'image' ? (
            <Image
              src={previewUrl}
              alt={media.alt || media.name}
              className="w-full h-full object-cover"
              preview={false}
              fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='14'%3EOшибка%3C/text%3E%3C/svg%3E"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <IconComponent className="text-5xl mb-2" />
              <span className="text-xs uppercase font-medium">{media.ext}</span>
            </div>
          )}
          {media.deleted_at && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Tag color="red">Удалено</Tag>
            </div>
          )}
        </div>
      }
      actions={
        showActions
          ? [
              <Tooltip key="edit" title="Редактировать">
                <Button type="text" icon={<EditOutlined />} onClick={handleEdit} />
              </Tooltip>,
              <Tooltip key="download" title="Скачать">
                <Button type="text" icon={<DownloadOutlined />} onClick={handleDownload} />
              </Tooltip>,
              <Tooltip key="delete" title="Удалить">
                <Button type="text" danger icon={<DeleteOutlined />} onClick={handleDelete} />
              </Tooltip>,
            ]
          : undefined
      }
    >
      {selectable && (
        <div className="absolute top-2 left-2 z-10" onClick={e => e.stopPropagation()}>
          <Checkbox checked={selected} onChange={handleCheckboxChange} />
        </div>
      )}
      <Card.Meta
        title={
          <Tooltip title={media.title || media.name}>
            <div className="truncate">{media.title || media.name}</div>
          </Tooltip>
        }
        description={
          <Space direction="vertical" size={4} className="w-full">
            <div className="flex items-center gap-2">
              <Tag color="blue">{media.kind}</Tag>
              {media.collection && <Tag color="default">{media.collection}</Tag>}
            </div>
            <div className="text-xs text-gray-500">
              {formatFileSize(media.size_bytes)}
              {media.width && media.height && (
                <span className="ml-2">
                  {media.width}×{media.height}
                </span>
              )}
            </div>
          </Space>
        }
      />
    </Card>
  );
};
