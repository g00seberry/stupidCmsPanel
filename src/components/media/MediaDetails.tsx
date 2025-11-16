import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import {
  Button,
  Card,
  Descriptions,
  Space,
  Spin,
  Tag,
  Typography,
  Empty,
  Modal,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MediaPreview } from './MediaPreview';
import { mediaStore } from '@/stores/mediaStore';
import { formatFileSize, formatDuration } from '@/utils/media';
import { getMediaDownloadUrl } from '@/api/apiMedia';
import { normalizeMediaUrl } from '@/utils/media';
import { PageUrl, buildUrl } from '@/PageUrl';

const { Title, Text } = Typography;
const { confirm } = Modal;

/**
 * Пропсы компонента детального просмотра медиафайла.
 */
export type PropsMediaDetails = {
  /** Идентификатор медиафайла для отображения. */
  mediaId: string;
  /** Обработчик возврата назад. Если не передан, используется навигация. */
  onBack?: () => void;
  /** Обработчик редактирования медиафайла. */
  onEdit?: (mediaId: string) => void;
};

/**
 * Компонент детального просмотра медиафайла.
 * Отображает полное превью, все метаданные и действия для управления медиафайлом.
 * @example
 * <MediaDetails
 *   mediaId="01HQZ8X9VJQ4KJ5N7R8Y9T0W1X"
 *   onBack={() => navigate('/media')}
 *   onEdit={handleEdit}
 * />
 */
export const MediaDetails: React.FC<PropsMediaDetails> = observer(
  ({ mediaId, onBack, onEdit }) => {
    const navigate = useNavigate();
    const { currentMedia, currentMediaPending } = mediaStore;

    /**
     * Загружает детальную информацию о медиафайле.
     */
    useEffect(() => {
      void mediaStore.loadMedia(mediaId);
    }, [mediaId]);

    const handleBack = useCallback(() => {
      onBack ? onBack() : navigate(-1);
    }, [onBack, navigate]);

    const handleEdit = useCallback(() => {
      if (onEdit) {
        onEdit(mediaId);
      } else {
        navigate(buildUrl(PageUrl.MediaEdit, { id: mediaId }));
      }
    }, [mediaId, onEdit, navigate]);

    /**
     * Обработчик удаления медиафайла.
     */
    const handleDelete = useCallback(async () => {
      if (!currentMedia) return;

      confirm({
        title: 'Удалить медиафайл?',
        icon: <ExclamationCircleOutlined />,
        content: `Вы уверены, что хотите удалить "${currentMedia.title || currentMedia.name}"?`,
        okText: 'Удалить',
        okType: 'danger',
        cancelText: 'Отмена',
        onOk: async () => {
          try {
            await mediaStore.deleteMedia(mediaId);
            handleBack();
          } catch (error) {
            // Ошибка уже обработана в mediaStore.deleteMedia через onError
            // Если ошибка 409 (Media in use), она будет показана через notification
          }
        },
      });
    }, [currentMedia, mediaId, handleBack]);

    /**
     * Обработчик восстановления медиафайла.
     */
    const handleRestore = useCallback(async () => {
      try {
        await mediaStore.restoreMedia(mediaId);
      } catch (error) {
        // Ошибка уже обработана в mediaStore.restoreMedia через onError
      }
    }, [mediaId]);

    const handleDownload = useCallback(() => {
      if (!currentMedia) return;
      window.open(normalizeMediaUrl(getMediaDownloadUrl(currentMedia.id)), '_blank');
    }, [currentMedia]);

    if (currentMediaPending) {
      return (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      );
    }

    if (!currentMedia) {
      return (
        <Card>
          <Empty description="Медиафайл не найден" />
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Заголовок с кнопкой назад и действиями */}
        <div className="flex items-center justify-between">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Назад
            </Button>
            <Title level={2} className="!mb-0">
              {currentMedia.title || currentMedia.name}
            </Title>
            {currentMedia.deleted_at && (
              <Tag color="red">Удалено</Tag>
            )}
          </Space>
          <Space>
            {currentMedia.deleted_at ? (
              <Button icon={<UndoOutlined />} onClick={handleRestore}>
                Восстановить
              </Button>
            ) : (
              <>
                <Button icon={<EditOutlined />} onClick={handleEdit}>
                  Редактировать
                </Button>
                <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                  Скачать
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                >
                  Удалить
                </Button>
              </>
            )}
          </Space>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основное превью */}
          <div className="lg:col-span-2">
            <Card>
              <MediaPreview media={currentMedia} variant="medium" zoomable />
            </Card>
          </div>

          {/* Метаданные */}
          <div>
            <Card title="Информация о файле">
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Имя файла">
                  {currentMedia.name}
                </Descriptions.Item>
                <Descriptions.Item label="Тип">
                  <Tag color="blue">{currentMedia.kind}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="MIME-тип">
                  <Text code>{currentMedia.mime}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Расширение">
                  <Text code>{currentMedia.ext}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Размер">
                  {formatFileSize(currentMedia.size_bytes)}
                </Descriptions.Item>
                {currentMedia.width && currentMedia.height && (
                  <Descriptions.Item label="Размеры">
                    {currentMedia.width} × {currentMedia.height} пикселей
                  </Descriptions.Item>
                )}
                {currentMedia.duration_ms && (
                  <Descriptions.Item label="Длительность">
                    {formatDuration(currentMedia.duration_ms)}
                  </Descriptions.Item>
                )}
                {currentMedia.title && (
                  <Descriptions.Item label="Заголовок">
                    {currentMedia.title}
                  </Descriptions.Item>
                )}
                {currentMedia.alt && (
                  <Descriptions.Item label="Альтернативный текст">
                    {currentMedia.alt}
                  </Descriptions.Item>
                )}
                {currentMedia.collection && (
                  <Descriptions.Item label="Коллекция">
                    <Tag>{currentMedia.collection}</Tag>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Дата создания">
                  {new Date(currentMedia.created_at).toLocaleString('ru-RU')}
                </Descriptions.Item>
                <Descriptions.Item label="Дата обновления">
                  {new Date(currentMedia.updated_at).toLocaleString('ru-RU')}
                </Descriptions.Item>
                {currentMedia.deleted_at && (
                  <Descriptions.Item label="Дата удаления">
                    {new Date(currentMedia.deleted_at).toLocaleString('ru-RU')}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </div>
        </div>

        {/* Список связанных записей (TODO: реализовать когда будет API для получения связанных записей) */}
        {/* <Card title="Связанные записи">
          <List
            dataSource={[]}
            renderItem={(item) => (
              <List.Item>
                <Link to={`/entries/${item.id}`}>{item.title}</Link>
              </List.Item>
            )}
          />
        </Card> */}
      </div>
    );
  }
);

