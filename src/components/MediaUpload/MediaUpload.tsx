import { useState, useMemo, useEffect, useRef } from 'react';
import { Upload, Button, Progress, App } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload';
import { uploadMedia } from '@/api/apiMedia';
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
  status: 'uploading' | 'success' | 'error';
  media?: ZMedia;
  error?: string;
};

/**
 * Компонент загрузки медиа-файлов.
 * Поддерживает drag-and-drop, множественную загрузку, валидацию и отображение прогресса.
 */
export const MediaUpload: React.FC<PropsMediaUpload> = ({
  config,
  onSuccess,
  onError: onErrorCallback,
  onAllComplete,
  disabled = false,
  mode = 'dragger',
}) => {
  const { message } = App.useApp();
  const [uploadStates, setUploadStates] = useState<Map<string, FileUploadState>>(new Map());
  const allCompleteCalledRef = useRef(false);

  /**
   * Валидирует файл перед загрузкой.
   */
  const validateFile = (file: File): string | null => {
    if (!config) {
      return 'Конфигурация не загружена';
    }

    // Проверка типа файла
    if (!config.allowed_mimes.includes(file.type)) {
      return `Тип файла ${file.type} не разрешен. Разрешенные типы: ${config.allowed_mimes.join(', ')}`;
    }

    // Проверка размера (конвертируем MB в байты)
    const maxSizeBytes = config.max_upload_mb * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `Размер файла ${formatFileSize(file.size)} превышает максимальный ${formatFileSize(maxSizeBytes)}`;
    }

    return null;
  };

  /**
   * Обрабатывает загрузку файла.
   */
  const handleUpload = async (file: File): Promise<void> => {
    const fileId = `${file.name}-${file.size}-${file.lastModified}`;

    // Валидация
    const validationError = validateFile(file);
    if (validationError) {
      setUploadStates(prev => {
        const next = new Map(prev);
        next.set(fileId, {
          file,
          progress: 0,
          status: 'error',
          error: validationError,
        });
        return next;
      });
      message.error(validationError);
      onErrorCallback?.(new Error(validationError), file);
      return;
    }

    // Начало загрузки
    setUploadStates(prev => {
      const next = new Map(prev);
      next.set(fileId, {
        file,
        progress: 0,
        status: 'uploading',
      });
      return next;
    });

    try {
      const media = await uploadMedia(file, {});

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

      message.success(`Файл ${file.name} успешно загружен`);
      onSuccess?.(media);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки файла';
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
      onError(error);
      onErrorCallback?.(error instanceof Error ? error : new Error(errorMessage), file);
    }
  };

  /**
   * Отслеживает завершение всех загрузок и вызывает onAllComplete, когда все файлы завершены.
   */
  useEffect(() => {
    if (uploadStates.size === 0) {
      allCompleteCalledRef.current = false;
      return;
    }

    const hasActiveUploads = Array.from(uploadStates.values()).some(
      state => state.status === 'uploading'
    );

    if (!hasActiveUploads && !allCompleteCalledRef.current) {
      // Все загрузки завершены (успешно или с ошибкой)
      allCompleteCalledRef.current = true;
      onAllComplete?.();
    } else if (hasActiveUploads) {
      // Есть активные загрузки, сбрасываем флаг
      allCompleteCalledRef.current = false;
    }
  }, [uploadStates, onAllComplete]);

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
   * Обработчик перед загрузкой - обрабатывает файлы вручную и предотвращает автоматическую загрузку.
   */
  const beforeUpload = (file: File): boolean => {
    void handleUpload(file);
    return false; // Предотвращаем автоматическую загрузку
  };

  /**
   * Список файлов для отображения в Upload компоненте.
   */
  const fileList: UploadFile[] = useMemo(() => {
    return Array.from(uploadStates.values()).map(state => ({
      uid: `${state.file.name}-${state.file.size}-${state.file.lastModified}`,
      name: state.file.name,
      status:
        state.status === 'uploading' ? 'uploading' : state.status === 'success' ? 'done' : 'error',
      percent: state.progress,
      error: state.error,
    }));
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
      {/* Компонент загрузки */}
      {mode === 'dragger' ? (
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Нажмите или перетащите файлы для загрузки</p>
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

      {/* Список загружаемых файлов с прогрессом */}
      {uploadStates.size > 0 && (
        <div className="space-y-2">
          {Array.from(uploadStates.entries()).map(([fileId, state]) => (
            <div
              key={fileId}
              className={joinClassNames(
                'p-3 border rounded',
                state.status === 'error' && 'border-red-500 bg-red-50',
                state.status === 'success' && 'border-green-500 bg-green-50'
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
