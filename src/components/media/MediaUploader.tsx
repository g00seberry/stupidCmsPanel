import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Upload,
  Button,
  Card,
  Input,
  Space,
  Progress,
  Typography,
  Tag,
  message,
  Image,
  Collapse,
} from 'antd';
import {
  InboxOutlined,
  UploadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { ZMedia } from '@/types/media';
import {
  validateMediaFile,
  formatFileSize,
  getMediaIconComponent,
  getAllowedMimeTypes,
} from '@/utils/media';
import { mediaStore } from '@/stores/mediaStore';

const { Dragger } = Upload;
const { Text } = Typography;
const { Panel } = Collapse;

/**
 * Тип файла в очереди загрузки.
 */
type FileQueueItem = {
  /** Уникальный ID файла в очереди. */
  id: string;
  /** Файл для загрузки. */
  file: File;
  /** Состояние загрузки: pending, uploading, success, error. */
  status: 'pending' | 'uploading' | 'success' | 'error';
  /** Прогресс загрузки (0-100). */
  progress: number;
  /** Ошибка загрузки (если есть). */
  error?: string;
  /** Результат загрузки (если успешно). */
  result?: ZMedia;
  /** Метаданные для загрузки. */
  metadata: {
    title?: string;
    alt?: string;
    collection?: string;
  };
  /** Превью для изображений. */
  preview?: string;
};

/**
 * Пропсы компонента загрузки медиафайлов.
 */
export type PropsMediaUploader = {
  /** Возможность множественной загрузки. По умолчанию: true. */
  multiple?: boolean;
  /** Допустимые типы файлов (MIME-типы). По умолчанию: все разрешённые типы. */
  accept?: string;
  /** Максимальный размер файла в байтах. По умолчанию: 25 МБ. */
  maxSize?: number;
  /** Коллекция по умолчанию для всех загружаемых файлов. */
  collection?: string;
  /** Автоматически начинать загрузку после добавления файлов. По умолчанию: false. */
  autoUpload?: boolean;
  /** Обработчик успешной загрузки файла. */
  onUploadSuccess?: (media: ZMedia) => void;
  /** Обработчик ошибки загрузки файла. */
  onUploadError?: (error: Error, file: File) => void;
};

/**
 * Компонент загрузки медиафайлов с поддержкой drag & drop, множественной загрузки и валидации.
 * Отображает очередь файлов с прогрессом загрузки, превью и возможностью редактирования метаданных.
 * @example
 * <MediaUploader
 *   multiple
 *   autoUpload
 *   collection="uploads"
 *   onUploadSuccess={(media) => console.log('Uploaded:', media)}
 *   onUploadError={(error, file) => console.error('Error:', error)}
 * />
 */
export const MediaUploader: React.FC<PropsMediaUploader> = ({
  multiple = true,
  accept,
  maxSize = 25 * 1024 * 1024, // 25 МБ по умолчанию
  collection: defaultCollection,
  autoUpload = false,
  onUploadSuccess,
  onUploadError,
}) => {
  const [fileQueue, setFileQueue] = useState<FileQueueItem[]>([]);
  const [collection, setCollection] = useState<string | undefined>(defaultCollection);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Создает превью для изображений.
   */
  const createPreview = useCallback((file: File): Promise<string | undefined> => {
    return new Promise(resolve => {
      if (!file.type.startsWith('image/')) {
        resolve(undefined);
        return;
      }
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result as string);
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(file);
    });
  }, []);

  /**
   * Валидирует файл перед добавлением в очередь.
   */
  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      const validation = validateMediaFile(file);
      if (!validation.valid) return validation;
      if (file.size > maxSize) {
        return {
          valid: false,
          error: `Размер файла превышает ${formatFileSize(maxSize)}`,
        };
      }
      if (accept && !accept.split(',').some(type => file.type.match(type.trim()))) {
        return {
          valid: false,
          error: 'Недопустимый тип файла.',
        };
      }
      return { valid: true };
    },
    [maxSize, accept]
  );
  /**
   * Добавляет файлы в очередь после валидации.
   */
  const handleFileAdd = useCallback(
    async (files: File[]): Promise<void> => {
      const newFiles: FileQueueItem[] = [];

      for (const file of files) {
        const validation = validateFile(file);
        if (!validation.valid) {
          message.error(`Файл "${file.name}": ${validation.error}`);
          onUploadError?.(new Error(validation.error || 'Ошибка валидации'), file);
          continue;
        }

        const preview = await createPreview(file);
        newFiles.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          status: 'pending',
          progress: 0,
          metadata: { collection },
          preview,
        });
      }

      if (newFiles.length > 0) {
        setFileQueue(prev => [...prev, ...newFiles]);
      }
    },
    [validateFile, collection, createPreview, onUploadError]
  );

  /**
   * Обновляет файл в очереди.
   */
  const updateQueueItem = useCallback((id: string, updates: Partial<FileQueueItem>) => {
    setFileQueue(prev => prev.map(i => (i.id === id ? { ...i, ...updates } : i)));
  }, []);

  /**
   * Загружает файл на сервер.
   */
  const uploadFile = useCallback(
    async (item: FileQueueItem): Promise<void> => {
      updateQueueItem(item.id, { status: 'uploading', progress: 50 });

      try {
        const result = await mediaStore.uploadMedia(item.file, item.metadata);
        if (result) {
          updateQueueItem(item.id, { status: 'success', progress: 100, result });
          onUploadSuccess?.(result);
        } else {
          throw new Error('Ошибка загрузки файла');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка загрузки';
        updateQueueItem(item.id, { status: 'error', error: errorMessage });
        onUploadError?.(error instanceof Error ? error : new Error(errorMessage), item.file);
      }
    },
    [onUploadSuccess, onUploadError, updateQueueItem]
  );

  /**
   * Начинает загрузку файлов из очереди (параллельно).
   */
  const startUpload = useCallback(
    async (ids?: string[]) => {
      const filesToUpload = fileQueue.filter(
        item => item.status === 'pending' && (!ids || ids.includes(item.id))
      );

      if (filesToUpload.length === 0) {
        message.warning('Нет файлов для загрузки');
        return;
      }

      setIsUploading(true);
      try {
        await Promise.all(filesToUpload.map(item => uploadFile(item)));
      } finally {
        setIsUploading(false);
      }
    },
    [fileQueue, uploadFile]
  );

  // Автоматическая загрузка при добавлении файлов
  useEffect(() => {
    if (autoUpload && fileQueue.length > 0) {
      const pendingFiles = fileQueue.filter(item => item.status === 'pending');
      if (pendingFiles.length > 0) {
        const timeoutId = setTimeout(() => {
          void startUpload(pendingFiles.map(f => f.id));
        }, 100);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [autoUpload, fileQueue, startUpload]);

  /**
   * Повторная загрузка файла с ошибкой.
   */
  const retryUpload = useCallback(
    async (id: string) => {
      const item = fileQueue.find(i => i.id === id);
      if (item) {
        updateQueueItem(id, { status: 'pending', error: undefined });
        await uploadFile(item);
      }
    },
    [fileQueue, uploadFile, updateQueueItem]
  );

  /**
   * Удаляет файл из очереди.
   */
  const removeFile = useCallback((id: string) => {
    setFileQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  /**
   * Очищает успешно загруженные файлы.
   */
  const clearSuccess = useCallback(() => {
    setFileQueue(prev => prev.filter(item => item.status !== 'success'));
  }, []);

  /**
   * Обновляет метаданные файла в очереди.
   */
  const updateFileMetadata = useCallback(
    (id: string, metadata: Partial<FileQueueItem['metadata']>) => {
      setFileQueue(prev =>
        prev.map(item =>
          item.id === id ? { ...item, metadata: { ...item.metadata, ...metadata } } : item
        )
      );
    },
    []
  );

  /**
   * Компонент превью файла (изображение или иконка).
   */
  const FilePreview: React.FC<{
    item: FileQueueItem;
    size?: number;
    bgColor?: string;
    iconColor?: string;
    imageClassName?: string;
  }> = ({
    item,
    size = 60,
    bgColor = 'bg-gray-100',
    iconColor = 'text-gray-400',
    imageClassName = '',
  }) => {
    const IconComponent = getFileIcon(item.file);
    const isImage = item.file.type.startsWith('image/');

    if (isImage && item.preview) {
      return (
        <Image
          src={item.preview}
          alt={item.file.name}
          width={size}
          height={size}
          className={`object-cover rounded ${imageClassName}`}
          preview={false}
        />
      );
    }

    const sizeStyle = size !== 60 ? { width: `${size}px`, height: `${size}px` } : undefined;
    return (
      <div
        className={`w-[60px] h-[60px] flex items-center justify-center ${bgColor} rounded`}
        style={sizeStyle}
      >
        <IconComponent className={`text-xl ${iconColor}`} />
      </div>
    );
  };

  /**
   * Обработчик выбора файлов через стандартный input.
   */
  const handleFileSelect: UploadProps['beforeUpload'] = useCallback(
    (file: RcFile, fileList: RcFile[]) => {
      if (!multiple && fileList.length > 1) {
        message.warning('Разрешена загрузка только одного файла');
        return false;
      }
      void handleFileAdd([file]);
      return false;
    },
    [multiple, handleFileAdd]
  );

  /**
   * Обработчик drop файлов.
   */
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      void handleFileAdd(files);
    },
    [handleFileAdd]
  );

  /**
   * Обработчик изменения коллекции.
   */
  const handleCollectionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim() || undefined;
    setCollection(value);
    // Обновляем коллекцию для всех pending файлов
    setFileQueue(prev =>
      prev.map(item =>
        item.status === 'pending'
          ? { ...item, metadata: { ...item.metadata, collection: value } }
          : item
      )
    );
  }, []);

  const allowedMimes = accept || getAllowedMimeTypes().join(',');

  const getMediaKind = (mime: string): 'image' | 'video' | 'audio' | 'document' => {
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    if (mime.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const getFileIcon = (file: File) => getMediaIconComponent(getMediaKind(file.type), file.type);

  // Группировка файлов по статусам
  const { pending, uploadingFiles, success, error } = useMemo(
    () => ({
      pending: fileQueue.filter(item => item.status === 'pending'),
      uploadingFiles: fileQueue.filter(item => item.status === 'uploading'),
      success: fileQueue.filter(item => item.status === 'success'),
      error: fileQueue.filter(item => item.status === 'error'),
    }),
    [fileQueue]
  );

  const pendingCount = pending.length;
  const successCount = success.length;
  const errorCount = error.length;

  return (
    <div className="space-y-4">
      {/* Drag & Drop зона */}
      <Card>
        <Dragger
          multiple={multiple}
          accept={allowedMimes}
          beforeUpload={handleFileSelect}
          onDrop={handleDrop}
          showUploadList={false}
          className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined className="text-4xl text-gray-400" />
          </p>
          <p className="ant-upload-text">Нажмите или перетащите файлы для загрузки</p>
          <p className="ant-upload-hint">
            Поддерживаются: JPEG, PNG, WebP, GIF, MP4, MP3, PDF. Максимальный размер:{' '}
            {formatFileSize(maxSize)}
          </p>
        </Dragger>
      </Card>

      {/* Настройки загрузки */}
      <Card title="Настройки загрузки" size="small">
        <Space direction="vertical" className="w-full" size="small">
          <div>
            <label className="block mb-1 text-sm font-medium">Коллекция (опционально)</label>
            <Input
              value={collection || ''}
              onChange={handleCollectionChange}
              placeholder="Например: uploads"
              maxLength={64}
              className="max-w-md"
            />
            <Text type="secondary" className="text-xs">
              Только латинские буквы, цифры, дефисы, точки и подчёркивания. Максимум 64 символа.
            </Text>
          </div>
          {!autoUpload && pendingCount > 0 && (
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => startUpload()}
              loading={isUploading}
              block
            >
              Начать загрузку ({pendingCount})
            </Button>
          )}
        </Space>
      </Card>

      {/* Очередь файлов */}
      {fileQueue.length > 0 && (
        <Card
          title={
            <Space>
              <span>Очередь загрузки</span>
              {pendingCount > 0 && (
                <Tag icon={<ClockCircleOutlined />} color="default">
                  {pendingCount}
                </Tag>
              )}
              {uploadingFiles.length > 0 && (
                <Tag icon={<UploadOutlined />} color="processing">
                  {uploadingFiles.length}
                </Tag>
              )}
              {successCount > 0 && (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  {successCount}
                </Tag>
              )}
              {errorCount > 0 && (
                <Tag icon={<CloseCircleOutlined />} color="error">
                  {errorCount}
                </Tag>
              )}
            </Space>
          }
          extra={
            successCount > 0 && (
              <Button size="small" onClick={clearSuccess}>
                Очистить успешные
              </Button>
            )
          }
        >
          <Collapse ghost>
            {pending.length > 0 && (
              <Panel header={`В ожидании (${pending.length})`} key="pending" className="border-b">
                <div className="space-y-3">
                  {pending.map(item => {
                    const isImage = item.file.type.startsWith('image/');
                    return (
                      <Card key={item.id} size="small" className="bg-gray-50">
                        <div className="flex gap-3">
                          <FilePreview item={item} size={80} />
                          <div className="flex-1 min-w-0">
                            <Text strong className="block truncate">
                              {item.file.name}
                            </Text>
                            <Text type="secondary" className="text-xs">
                              {formatFileSize(item.file.size)}
                            </Text>
                            <div className="mt-2 space-y-1">
                              <Input
                                size="small"
                                placeholder="Заголовок (опционально)"
                                value={item.metadata.title || ''}
                                onChange={e =>
                                  updateFileMetadata(item.id, {
                                    title: e.target.value || undefined,
                                  })
                                }
                                maxLength={255}
                              />
                              {isImage && (
                                <Input
                                  size="small"
                                  placeholder="Alt текст (опционально)"
                                  value={item.metadata.alt || ''}
                                  onChange={e =>
                                    updateFileMetadata(item.id, {
                                      alt: e.target.value || undefined,
                                    })
                                  }
                                  maxLength={255}
                                />
                              )}
                            </div>
                          </div>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeFile(item.id)}
                          />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </Panel>
            )}

            {uploadingFiles.length > 0 && (
              <Panel header={`Загружается (${uploadingFiles.length})`} key="uploading">
                <div className="space-y-3">
                  {uploadingFiles.map(item => (
                    <Card key={item.id} size="small">
                      <div className="flex items-center gap-3">
                        <FilePreview item={item} size={60} />
                        <div className="flex-1 min-w-0">
                          <Text strong className="block truncate">
                            {item.file.name}
                          </Text>
                          <Progress percent={item.progress} status="active" size="small" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Panel>
            )}

            {success.length > 0 && (
              <Panel
                header={`Успешно загружено (${success.length})`}
                key="success"
                className="bg-green-50"
              >
                <div className="space-y-2">
                  {success.map(item => (
                    <Card key={item.id} size="small" className="bg-green-50">
                      <div className="flex items-center gap-3">
                        <FilePreview
                          item={item}
                          size={60}
                          bgColor={
                            item.file.type.startsWith('image/') ? 'bg-gray-100' : 'bg-green-100'
                          }
                          iconColor="text-green-600"
                        />
                        <div className="flex-1 min-w-0">
                          <Text strong className="block text-green-700">
                            {item.result?.name || item.file.name}
                          </Text>
                          <Text type="success" className="text-xs">
                            Загрузка завершена
                          </Text>
                        </div>
                        <Button
                          type="text"
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => removeFile(item.id)}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </Panel>
            )}

            {error.length > 0 && (
              <Panel header={`Ошибки (${error.length})`} key="error" className="bg-red-50">
                <div className="space-y-2">
                  {error.map(item => (
                    <Card key={item.id} size="small" className="bg-red-50">
                      <div className="flex items-center gap-3">
                        <FilePreview
                          item={item}
                          size={60}
                          bgColor={
                            item.file.type.startsWith('image/') ? 'bg-gray-100' : 'bg-red-100'
                          }
                          iconColor="text-red-600"
                          imageClassName="opacity-50"
                        />
                        <div className="flex-1 min-w-0">
                          <Text strong className="block text-red-700">
                            {item.file.name}
                          </Text>
                          <Text type="danger" className="text-xs">
                            {item.error}
                          </Text>
                        </div>
                        <Space>
                          <Button
                            type="text"
                            size="small"
                            icon={<ReloadOutlined />}
                            onClick={() => retryUpload(item.id)}
                          />
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => removeFile(item.id)}
                          />
                        </Space>
                      </div>
                    </Card>
                  ))}
                </div>
              </Panel>
            )}
          </Collapse>
        </Card>
      )}
    </div>
  );
};
