import { buildUrl, PageUrl } from '@/PageUrl';
import type { ZPostType } from '@/types/postTypes';
import { Button } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Пропсы компонента шапки редактора записи.
 */
export type PropsEntryEditorHeader = {
  /** Тип контента. Если не передан, ссылка на тип контента не отображается. */
  postType: ZPostType | null;
  /** Режим редактирования. `true` если редактируется существующая запись. */
  isEditMode: boolean;
  /** Экземпляр формы для вызова submit. */
  form: FormInstance;
  /** Флаг выполнения операции сохранения. */
  pending: boolean;
  /** Обработчик отмены. */
  onCancel: () => void;
};

/**
 * Шапка редактора записи с хлебными крошками и кнопками действий.
 */
export const EntryEditorHeader: React.FC<PropsEntryEditorHeader> = ({
  postType,
  isEditMode,
  form,
  pending,
  onCancel,
}) => {
  return (
    <div className="border-b bg-card w-full">
      <div className="px-6 py-4 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              to={PageUrl.ContentTypes}
              className="hover:text-foreground cursor-pointer transition-colors"
            >
              Типы контента
            </Link>
            {postType && (
              <>
                <span>/</span>
                <Link
                  to={buildUrl(PageUrl.EntriesByType, { postType: postType.slug })}
                  className="hover:text-foreground cursor-pointer transition-colors"
                >
                  {postType.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground font-medium">
              {isEditMode ? 'Редактирование' : 'Создание'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={onCancel}>Отмена</Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={pending}
              icon={<Check className="w-4 h-4" />}
            >
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
