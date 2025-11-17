import { Card, Button, Dropdown, Spin, Empty, Modal } from 'antd';
import { MoreVertical, Eye, Edit, Download, Trash2, RotateCcw } from 'lucide-react';
import { MediaPreview } from '@/components/MediaPreview';
import { downloadMedia } from '@/api/apiMedia';
import { onError } from '@/utils/onError';
import type { ZMedia } from '@/types/media';
import type { MenuProps } from 'antd';

/**
 * Пропсы компонента MediaGrid.
 */
export type PropsMediaGrid = {
  /** Массив медиа-файлов для отображения. */
  media: ZMedia[];
  /** Флаг загрузки данных. */
  loading?: boolean;
  /** Обработчик клика по медиа-файлу для просмотра. */
  onView?: (media: ZMedia) => void;
  /** Обработчик клика по медиа-файлу для редактирования. */
  onEdit?: (media: ZMedia) => void;
  /** Обработчик удаления медиа-файла. */
  onDelete?: (id: string) => void;
  /** Обработчик восстановления медиа-файла. */
  onRestore?: (id: string) => void;
  /** Текст для пустого состояния. По умолчанию: 'Нет медиа-файлов'. */
  emptyText?: string;
};

/**
 * Компонент сетки медиа-файлов с карточками и действиями.
 * Отображает медиа-файлы в виде сетки с превью и меню действий.
 */
export const MediaGrid: React.FC<PropsMediaGrid> = ({
  media,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onRestore,
  emptyText = 'Нет медиа-файлов',
}) => {
  /**
   * Обрабатывает удаление медиа-файла с подтверждением.
   * @param mediaItem Медиа-файл для удаления.
   */
  const handleDelete = (mediaItem: ZMedia) => {
    Modal.confirm({
      title: 'Удалить файл?',
      content: `Вы уверены, что хотите удалить "${mediaItem.title || mediaItem.name}"? Файл можно будет восстановить из корзины.`,
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: () => {
        if (onDelete) {
          onDelete(mediaItem.id);
        }
      },
    });
  };

  /**
   * Обрабатывает восстановление медиа-файла с подтверждением.
   * @param mediaItem Медиа-файл для восстановления.
   */
  const handleRestore = (mediaItem: ZMedia) => {
    Modal.confirm({
      title: 'Восстановить файл?',
      content: `Вы уверены, что хотите восстановить "${mediaItem.title || mediaItem.name}"?`,
      okText: 'Восстановить',
      cancelText: 'Отмена',
      onOk: () => {
        if (onRestore) {
          onRestore(mediaItem.id);
        }
      },
    });
  };

  /**
   * Обрабатывает скачивание медиа-файла.
   * @param mediaItem Медиа-файл для скачивания.
   */
  const handleDownload = async (mediaItem: ZMedia) => {
    try {
      await downloadMedia(mediaItem.id, mediaItem.name);
    } catch (error) {
      onError(error);
    }
  };

  /**
   * Создаёт меню действий для медиа-файла.
   * @param mediaItem Медиа-файл для которого создаётся меню.
   * @returns Элементы меню.
   */
  const getMenuItems = (mediaItem: ZMedia): MenuProps['items'] => {
    const items: MenuProps['items'] = [];

    if (onView) {
      items.push({
        key: 'view',
        label: 'Просмотр',
        icon: <Eye className="w-4 h-4" />,
        onClick: () => onView(mediaItem),
      });
    }

    if (onEdit) {
      items.push({
        key: 'edit',
        label: 'Редактировать',
        icon: <Edit className="w-4 h-4" />,
        onClick: () => onEdit(mediaItem),
      });
    }

    items.push({
      key: 'download',
      label: 'Скачать',
      icon: <Download className="w-4 h-4" />,
      onClick: () => handleDownload(mediaItem),
    });

    if (mediaItem.deleted_at) {
      // Для удалённых файлов показываем восстановление
      if (onRestore) {
        items.push({
          key: 'restore',
          label: 'Восстановить',
          icon: <RotateCcw className="w-4 h-4" />,
          onClick: () => handleRestore(mediaItem),
        });
      }
    } else {
      // Для активных файлов показываем удаление
      if (onDelete) {
        items.push({
          type: 'divider',
        });
        items.push({
          key: 'delete',
          label: 'Удалить',
          icon: <Trash2 className="w-4 h-4" />,
          danger: true,
          onClick: () => handleDelete(mediaItem),
        });
      }
    }

    return items;
  };

  if (loading && media.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  if (media.length === 0) {
    return <Empty description={emptyText} className="py-12" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {media.map(mediaItem => (
        <Card
          key={mediaItem.id}
          className={`overflow-hidden ${mediaItem.deleted_at ? 'opacity-60' : ''}`}
          styles={{ body: { padding: 0 } }}
          hoverable
        >
          <div className="relative">
            <MediaPreview
              media={mediaItem}
              size="medium"
              onClick={() => onView && onView(mediaItem)}
              className="w-full h-48"
            />

            {/* Меню действий */}
            <div className="absolute top-2 right-2">
              <Dropdown menu={{ items: getMenuItems(mediaItem) }} trigger={['click']}>
                <Button
                  type="text"
                  icon={<MoreVertical className="w-4 h-4" />}
                  className="bg-white/80 hover:bg-white"
                  size="small"
                />
              </Dropdown>
            </div>

            {/* Метка удалённого файла */}
            {mediaItem.deleted_at && (
              <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                Удалено
              </div>
            )}
          </div>

          {/* Информация о файле */}
          <div className="p-3">
            <div className="text-sm font-medium truncate" title={mediaItem.title || mediaItem.name}>
              {mediaItem.title || mediaItem.name}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{mediaItem.mime}</div>
            {mediaItem.collection && (
              <div className="text-xs text-muted-foreground mt-1">
                <span className="bg-muted px-1.5 py-0.5 rounded">{mediaItem.collection}</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
