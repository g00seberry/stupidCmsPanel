import { PageUrl } from '@/PageUrl';
import { Button, Popconfirm } from 'antd';
import { AlertTriangle, Archive, RotateCcw, Trash2, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { MediaListStore } from './MediaListStore';
import { observer } from 'mobx-react-lite';

/**
 * Пропсы компонента хедера списка медиа-файлов.
 */
interface PropsMediaListHeader {
  /** Store для управления состоянием списка медиа-файлов. */
  store: MediaListStore;
  /** Флаг режима корзины. */
  isTrashMode: boolean;
  /** Общее количество медиа-файлов. */
  totalCount: number;
  /** Обработчик открытия модального окна загрузки. */
  onUploadClick: () => void;
  /** Обработчик массового удаления. */
  onBulkDelete: () => void;
  /** Обработчик массового восстановления. */
  onBulkRestore: () => void;
  /** Обработчик окончательного удаления выбранных. */
  onBulkForceDelete: () => void;
  /** Обработчик очистки корзины. */
  onClearTrash: () => void;
}

/**
 * Компонент хедера списка медиа-файлов.
 * Отображает breadcrumbs и кнопки действий в зависимости от режима (обычный/корзина).
 */
export const MediaListHeader: React.FC<PropsMediaListHeader> = observer(
  ({
    store,
    isTrashMode,
    totalCount,
    onUploadClick,
    onBulkDelete,
    onBulkRestore,
    onBulkForceDelete,
    onClearTrash,
  }) => {
    const navigate = useNavigate();

    return (
      <div className="border-b bg-card w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isTrashMode ? (
                <>
                  <span
                    className="hover:text-foreground cursor-pointer transition-colors"
                    onClick={() => navigate(PageUrl.Media)}
                  >
                    Медиа-файлы
                  </span>
                  <span>/</span>
                  <span className="text-foreground font-medium">Корзина</span>
                </>
              ) : (
                <span className="text-foreground font-medium">Медиа-файлы</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {isTrashMode ? (
                <>
                  {store.hasSelection && (
                    <>
                      <Button icon={<RotateCcw className="w-4 h-4" />} onClick={onBulkRestore}>
                        Восстановить выбранные ({store.selectedCount})
                      </Button>
                      <Popconfirm
                        title="Окончательно удалить выбранные?"
                        description={`Будет окончательно удалено ${store.selectedCount} медиа-файлов. Это действие нельзя отменить.`}
                        onConfirm={onBulkForceDelete}
                        okText="Удалить"
                        okType="danger"
                        cancelText="Отмена"
                        icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
                      >
                        <Button danger icon={<Trash2 className="w-4 h-4" />}>
                          Удалить окончательно ({store.selectedCount})
                        </Button>
                      </Popconfirm>
                    </>
                  )}
                  {totalCount > 0 && (
                    <Popconfirm
                      title="Очистить корзину?"
                      description={`Будет окончательно удалено ${totalCount} медиа-файлов. Это действие нельзя отменить.`}
                      onConfirm={onClearTrash}
                      okText="Очистить"
                      okType="danger"
                      cancelText="Отмена"
                      icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
                    >
                      <Button danger icon={<Trash2 className="w-4 h-4" />}>
                        Очистить корзину
                      </Button>
                    </Popconfirm>
                  )}
                </>
              ) : (
                <>
                  <Link to={PageUrl.MediaTrash}>
                    <Button icon={<Archive className="w-4 h-4" />}>Корзина</Button>
                  </Link>
                  <Button
                    type="primary"
                    icon={<Upload className="w-4 h-4" />}
                    onClick={onUploadClick}
                  >
                    Загрузить файлы
                  </Button>
                  {store.hasSelection && (
                    <Popconfirm
                      title="Удалить выбранные медиа-файлы?"
                      description={`Будет удалено ${store.selectedCount} медиа-файлов.`}
                      onConfirm={onBulkDelete}
                      okText="Удалить"
                      cancelText="Отмена"
                    >
                      <Button danger icon={<Trash2 className="w-4 h-4" />}>
                        Удалить выбранные ({store.selectedCount})
                      </Button>
                    </Popconfirm>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
