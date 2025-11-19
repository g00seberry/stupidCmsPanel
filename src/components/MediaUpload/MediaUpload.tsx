import { useState, useMemo, useEffect } from 'react';
import { Upload, Button, Progress, App } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload';
import { bulkUploadMedia } from '@/api/apiMedia';
import { onError } from '@/utils/onError';
import { formatFileSize } from '@/utils/fileUtils';
import type { ZMedia, ZMediaConfig } from '@/types/media';
import { joinClassNames } from '@/utils/joinClassNames';

const { Dragger } = Upload;

/**
 * Пропсы компонента загрузки медиа-файлов.
 */
export type PropsMediaUpload = {
  /** Конфигурация системы медиа-файлов. */
  config: ZMediaConfig | null;
  /** Обработчик успешной загрузки файла. */
  onSuccess?: (media: ZMedia) => void;
  /** Обработчик ошибки загрузки. */
  onError?: (error: Error, file: File) => void;
  /** Обработчик завершения всех загрузок (когда все файлы завершены - успешно или с ошибкой). */
  onAllComplete?: () => void;
  /** Обработчик изменения состояния загрузки. Вызывается при начале/завершении загрузки. */
  onUploadingChange?: (isUploading: boolean) => void;
  /** Флаг отключения компонента. */
  disabled?: boolean;
  /** Режим отображения: 'button' (кнопка) или 'dragger' (drag-and-drop). По умолчанию: 'dragger'. */
  mode?: 'button' | 'dragger';
};

/**
 * Состояние загрузки одного файла.
 */
type FileUploadState = {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  media?: ZMedia;
  error?: string;
};

/**
 * Компонент загрузки медиа-файлов.
 * Поддерживает выбор файлов и загрузку по кнопке.
 */
export const MediaUpload: React.FC<PropsMediaUpload> = ({
  config,
  onSuccess,
  onError: onErrorCallback,
  onAllComplete,
  onUploadingChange,
  disabled = false,
  mode = 'dragger',
}) => {
  const { message } = App.useApp();
  const [uploadStates, setUploadStates] = useState<Map<string, FileUploadState>>(new Map());
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Валидирует файл перед загрузкой.
   */
  const validateFile = (file: File): string | null => {
    if (!config) {
      return 'Конфигурация не загружена';
    }

    if (!config.allowed_mimes.includes(file.type)) {
      return `Тип файла ${file.type} не разрешен. Разрешенные типы: ${config.allowed_mimes.join(', ')}`;
    }

    const maxSizeBytes = config.max_upload_mb * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `Размер файла ${formatFileSize(file.size)} превышает максимальный ${formatFileSize(maxSizeBytes)}`;
    }

    return null;
  };

  /**
   * Загружает все выбранные файлы.
   */
  const handleStartUpload = async (): Promise<void> => {
    const pendingFiles = Array.from(uploadStates.values())
      .filter(state => state.status === 'pending')
      .map(state => state.file);

    if (pendingFiles.length === 0) {
      return;
    }

    setIsUploading(true);
    onUploadingChange?.(true);

    // Разделяем файлы на валидные и невалидные
    const validFiles: File[] = [];
    const invalidFiles: Array<{ file: File; error: string }> = [];

    pendingFiles.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        invalidFiles.push({ file, error: validationError });
      } else {
        validFiles.push(file);
      }
    });

    // Обрабатываем невалидные файлы
    invalidFiles.forEach(({ file, error }) => {
      const fileId = `${file.name}-${file.size}-${file.lastModified}`;
      setUploadStates(prev => {
        const next = new Map(prev);
        next.set(fileId, {
          file,
          progress: 0,
          status: 'error',
          error,
        });
        return next;
      });
      message.error(`${file.name}: ${error}`);
      onErrorCallback?.(new Error(error), file);
    });

    if (validFiles.length === 0) {
      setIsUploading(false);
      onUploadingChange?.(false);
      onAllComplete?.();
      return;
    }

    // Устанавливаем статус uploading для всех валидных файлов
    validFiles.forEach(file => {
      const fileId = `${file.name}-${file.size}-${file.lastModified}`;
      setUploadStates(prev => {
        const next = new Map(prev);
        const existingState = next.get(fileId);
        if (existingState) {
          next.set(fileId, {
            ...existingState,
            status: 'uploading',
          });
        }
        return next;
      });
    });

    // Загружаем файлы батчами по 50
    const batchSize = 50;
    for (let i = 0; i < validFiles.length; i += batchSize) {
      const batch = validFiles.slice(i, i + batchSize);
      try {
        const mediaArray = await bulkUploadMedia(batch);

        batch.forEach((file, index) => {
          const fileId = `${file.name}-${file.size}-${file.lastModified}`;
          let media: ZMedia | undefined;

          if (index < mediaArray.length) {
            const mediaByIndex = mediaArray[index];
            if (mediaByIndex.name === file.name) {
              media = mediaByIndex;
            }
          }

          if (!media) {
            media = mediaArray.find(m => m.name === file.name);
          }

          if (media) {
            setUploadStates(prev => {
              const next = new Map(prev);
              next.set(fileId, {
                file,
                progress: 100,
                status: 'success',
                media,
              });
              return next;
            });
            onSuccess?.(media);
          } else {
            setUploadStates(prev => {
              const next = new Map(prev);
              next.set(fileId, {
                file,
                progress: 0,
                status: 'error',
                error: 'Файл не был загружен',
              });
              return next;
            });
            onErrorCallback?.(new Error('Файл не был загружен'), file);
          }
        });

        message.success(`Загружено файлов: ${batch.length}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки файлов';
        batch.forEach(file => {
          const fileId = `${file.name}-${file.size}-${file.lastModified}`;
          setUploadStates(prev => {
            const next = new Map(prev);
            next.set(fileId, {
              file,
              progress: 0,
              status: 'error',
              error: errorMessage,
            });
            return next;
          });
          onErrorCallback?.(error instanceof Error ? error : new Error(errorMessage), file);
        });
        onError(error);
      }
    }

    setIsUploading(false);
    onUploadingChange?.(false);
    onAllComplete?.();
  };

  /**
   * Обрабатывает добавление файла в список.
   */
  const handleFileAdd = (file: File): void => {
    const fileId = `${file.name}-${file.size}-${file.lastModified}`;

    setUploadStates(prev => {
      const next = new Map(prev);
      if (!next.has(fileId)) {
        next.set(fileId, {
          file,
          progress: 0,
          status: 'pending',
        });
      }
      return next;
    });
  };

  /**
   * Отслеживает завершение всех загрузок.
   */
  useEffect(() => {
    if (uploadStates.size === 0) {
      onUploadingChange?.(false);
      return;
    }

    const hasActiveUploads = Array.from(uploadStates.values()).some(
      state => state.status === 'uploading'
    );

    onUploadingChange?.(hasActiveUploads);
  }, [uploadStates, onUploadingChange]);

  /**
   * Обработчик изменения файлов в Upload компоненте.
   */
  const handleChange: UploadProps['onChange'] = info => {
    if (info.file.status === 'removed') {
      setUploadStates(prev => {
        const next = new Map(prev);
        const fileId = `${info.file.name}-${info.file.size || 0}-${info.file.uid}`;
        next.delete(fileId);
        return next;
      });
      return;
    }
  };

  /**
   * Обработчик перед загрузкой - добавляет файлы в список и предотвращает автоматическую загрузку.
   */
  const beforeUpload = (file: File): boolean => {
    handleFileAdd(file);
    return false;
  };

  /**
   * Список файлов для отображения в Upload компоненте.
   */
  const fileList: UploadFile[] = useMemo(() => {
    return Array.from(uploadStates.values()).map(state => ({
      uid: `${state.file.name}-${state.file.size}-${state.file.lastModified}`,
      name: state.file.name,
      status:
        state.status === 'uploading'
          ? 'uploading'
          : state.status === 'success'
            ? 'done'
            : state.status === 'error'
              ? 'error'
              : undefined,
      percent: state.progress,
      error: state.error,
    }));
  }, [uploadStates]);

  /**
   * Проверяет наличие файлов в статусе pending.
   */
  const hasPendingFiles = useMemo(() => {
    return Array.from(uploadStates.values()).some(state => state.status === 'pending');
  }, [uploadStates]);

  const uploadProps: UploadProps = {
    multiple: true,
    beforeUpload,
    onChange: handleChange,
    fileList,
    disabled,
    accept: config?.allowed_mimes?.join(',') || undefined,
    showUploadList: false, // Скрываем стандартный список, используем свой
  };

  return (
    <div className="space-y-4">
      {/* Компонент выбора файлов */}
      {mode === 'dragger' ? (
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Нажмите или перетащите файлы для выбора</p>
          <p className="ant-upload-hint">
            Поддерживаются файлы до{' '}
            {config ? formatFileSize(config.max_upload_mb * 1024 * 1024) : 'неизвестного размера'}
          </p>
        </Dragger>
      ) : (
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} disabled={disabled}>
            Выбрать файлы
          </Button>
        </Upload>
      )}

      {/* Кнопка загрузки */}
      {hasPendingFiles && (
        <Button
          type="primary"
          onClick={handleStartUpload}
          disabled={disabled || isUploading}
          loading={isUploading}
          block
        >
          {isUploading ? 'Загрузка...' : 'Загрузить'}
        </Button>
      )}

      {/* Список выбранных файлов с прогрессом */}
      {uploadStates.size > 0 && (
        <div className="space-y-2">
          {Array.from(uploadStates.entries()).map(([fileId, state]) => (
            <div
              key={fileId}
              className={joinClassNames(
                'p-3 border rounded',
                state.status === 'error' && 'border-red-500 bg-red-50',
                state.status === 'success' && 'border-green-500 bg-green-50',
                state.status === 'pending' && 'border-gray-300 bg-gray-50'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{state.file.name}</span>
                <span className="text-xs text-gray-500">{formatFileSize(state.file.size)}</span>
              </div>
              {state.status === 'uploading' && (
                <Progress percent={state.progress} status="active" />
              )}
              {state.status === 'success' && (
                <div className="text-sm text-green-600">Загружено успешно</div>
              )}
              {state.status === 'error' && state.error && (
                <div className="text-sm text-red-600">{state.error}</div>
              )}
              {state.status === 'pending' && (
                <div className="text-sm text-gray-500">Ожидает загрузки</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
