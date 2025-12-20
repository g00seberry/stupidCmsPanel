import { useMemo, useEffect, useCallback } from 'react';
import { Upload, Button, App } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadChangeParam, UploadProps } from 'antd/es/upload';
import { formatFileSize } from '@/utils/fileUtils';
import type { ZMedia, ZMediaConfig } from '@/types/media';
import { observer } from 'mobx-react-lite';
import { MediaUploadStore } from './MediaUploadStore';
import { FileCard } from './FileCard';

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
  /** Обработчик завершения всех загрузок. */
  onAllComplete?: () => void;
  /** Обработчик изменения состояния загрузки. */
  onUploadingChange?: (isUploading: boolean) => void;
  /** Флаг отключения компонента. */
  disabled?: boolean;
  /** Режим отображения: 'button' (кнопка) или 'dragger' (drag-and-drop). По умолчанию: 'dragger'. */
  mode?: 'button' | 'dragger';
};

/**
 * Компонент загрузки медиа-файлов.
 * Поддерживает выбор файлов и загрузку по кнопке.
 */
export const MediaUpload = observer<PropsMediaUpload>(
  ({
    config,
    onSuccess,
    onError: onErrorCallback,
    onAllComplete,
    onUploadingChange,
    disabled = false,
    mode = 'dragger',
  }) => {
    const { message } = App.useApp();

    const store = useMemo(() => new MediaUploadStore(config), []);

    // Обновляем конфигурацию в store при изменении
    useEffect(() => {
      store.setConfig(config);
    }, [store, config]);

    // Обновляем колбэки при изменении
    useEffect(() => {
      store.setCallbacks({
        onSuccess: media => {
          onSuccess?.(media);
        },
        onError: (error, file) => {
          message.error(`${file.name}: ${error.message}`);
          onErrorCallback?.(error, file);
        },
        onAllComplete: () => {
          onAllComplete?.();
        },
        onUploadingChange: isUploading => {
          onUploadingChange?.(isUploading);
        },
        onBatchSuccess: count => {
          message.success(`Загружено файлов: ${count}`);
        },
      });
    }, [store, onSuccess, onErrorCallback, onAllComplete, onUploadingChange, message]);

    const handleChange = useCallback(
      (info: UploadChangeParam) => {
        if (info.file.status === 'removed') {
          const fileId = info.file.uid;
          store.removeFile(fileId);
        }
      },
      [store]
    );

    const beforeUpload = useCallback(
      (file: File): boolean => {
        store.addFile(file);
        return false;
      },
      [store]
    );

    const handleStartUpload = useCallback(() => {
      void store.startUpload();
    }, [store]);

    const handleRemoveFile = useCallback(
      (fileId: string) => {
        store.removeFile(fileId);
      },
      [store]
    );

    const uploadProps: UploadProps = useMemo(
      () => ({
        multiple: true,
        beforeUpload,
        onChange: handleChange as UploadProps['onChange'],
        fileList: store.fileList,
        disabled,
        accept: config?.allowed_mimes?.join(',') || undefined,
        showUploadList: false,
      }),
      [beforeUpload, handleChange, store.fileList, disabled, config]
    );

    const maxFileSizeText = config
      ? formatFileSize(config.max_upload_mb * 1024 * 1024)
      : 'неизвестного размера';

    return (
      <div className="space-y-4">
        {/* Компонент выбора файлов */}
        {mode === 'dragger' ? (
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Нажмите или перетащите файлы для выбора</p>
            <p className="ant-upload-hint">Поддерживаются файлы до {maxFileSizeText}</p>
          </Dragger>
        ) : (
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} disabled={disabled}>
              Выбрать файлы
            </Button>
          </Upload>
        )}

        {/* Кнопка загрузки */}
        {store.hasPendingFiles && (
          <Button
            type="primary"
            onClick={handleStartUpload}
            disabled={disabled || store.isUploading}
            loading={store.isUploading}
            block
          >
            {store.isUploading ? 'Загрузка...' : 'Загрузить'}
          </Button>
        )}

        {/* Список выбранных файлов с прогрессом */}
        {store.uploadStates.size > 0 && (
          <div className="space-y-2">
            {store.uploadStatesEntries.map(([fileId, state]) => (
              <FileCard key={fileId} fileId={fileId} state={state} onRemove={handleRemoveFile} />
            ))}
          </div>
        )}
      </div>
    );
  }
);
