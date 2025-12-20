import { Button, Progress } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { formatFileSize } from '@/utils/fileUtils';
import { joinClassNames } from '@/utils/joinClassNames';
import type { FileUploadState } from './types';

/** Классы CSS для различных статусов файла. */
const STATUS_CLASSES: Record<FileUploadState['status'], string> = {
  error: 'border-red-500 bg-red-50',
  success: 'border-green-500 bg-green-50',
  pending: 'border-gray-300 bg-gray-50',
  uploading: 'border-blue-300 bg-blue-50',
} as const;

/**
 * Пропсы компонента карточки файла в списке загрузки.
 */
export interface FileCardProps {
  /** Идентификатор файла. */
  fileId: string;
  /** Состояние загрузки файла. */
  state: FileUploadState;
  /** Обработчик удаления файла. */
  onRemove: (fileId: string) => void;
}

/**
 * Компонент карточки файла в списке загрузки.
 * Отображает информацию о файле, его статус и действия.
 */
export const FileCard = ({ fileId, state, onRemove }: FileCardProps) => {
  const canRemove = state.status === 'pending' || state.status === 'error';

  return (
    <div className={joinClassNames('p-3 border rounded', STATUS_CLASSES[state.status])}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-medium truncate">{state.file.name}</span>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {formatFileSize(state.file.size)}
          </span>
        </div>
        {canRemove && (
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={() => onRemove(fileId)}
            className="flex-shrink-0"
            danger={state.status === 'error'}
          />
        )}
      </div>

      {state.status === 'uploading' && <Progress percent={state.progress} status="active" />}

      {state.status === 'success' && (
        <div className="text-sm text-green-600">Загружено успешно</div>
      )}

      {state.status === 'error' && state.error && (
        <div className="text-sm text-red-600">{state.error}</div>
      )}

      {state.status === 'pending' && <div className="text-sm text-gray-500">Ожидает загрузки</div>}
    </div>
  );
};
