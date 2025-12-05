import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * Элемент хлебной крошки.
 */
export type BreadcrumbItem =
  | {
      /** Текст элемента. */
      label: string;
      /** URL для ссылки. Если не указан, элемент отображается как текст. */
      to?: string;
      /** Обработчик клика. Если указан, используется вместо `to`. */
      onClick?: () => void;
    }
  | string;

/**
 * Пропсы компонента заголовка страницы.
 */
export type PropsPageHeader = {
  /**
   * Массив элементов хлебных крошек.
   * Может содержать объекты с `label`, `to`/`onClick` или просто строки.
   */
  readonly breadcrumbs: ReadonlyArray<BreadcrumbItem>;
  /**
   * Дополнительные элементы справа (кнопки, действия и т.д.).
   */
  readonly extra?: ReactNode;
};

/**
 * Универсальный компонент заголовка страницы с хлебными крошками и дополнительными действиями.
 * Используется для единообразного отображения заголовков страниц по всему приложению.
 *
 * @example
 * <PageHeader
 *   breadcrumbs={[
 *     { label: 'Типы контента', to: PageUrl.ContentTypes },
 *     { label: 'Article', to: buildUrl(PageUrl.EntriesByType, { postTypeId: '1' }) },
 *     'Редактирование'
 *   ]}
 *   extra={
 *     <>
 *       <Button onClick={onCancel}>Отмена</Button>
 *       <Button type="primary" onClick={onSave}>Сохранить</Button>
 *     </>
 *   }
 * />
 */
export const PageHeader: React.FC<PropsPageHeader> = ({ breadcrumbs, extra }) => {
  return (
    <div className="border-b bg-card w-full sticky top-0 z-10">
      <div className="px-6 py-4 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const breadcrumb = typeof item === 'string' ? { label: item } : item;
              const { label, to, onClick } = breadcrumb;

              return (
                <span key={index} className="flex items-center gap-2">
                  {to ? (
                    <Link
                      to={to}
                      className="hover:text-foreground cursor-pointer transition-colors"
                    >
                      {label}
                    </Link>
                  ) : onClick ? (
                    <span
                      className="hover:text-foreground cursor-pointer transition-colors"
                      onClick={onClick}
                    >
                      {label}
                    </span>
                  ) : (
                    <span className={isLast ? 'text-foreground font-medium' : ''}>{label}</span>
                  )}
                  {!isLast && <span>/</span>}
                </span>
              );
            })}
          </div>
          {extra && <div className="flex items-center gap-3">{extra}</div>}
        </div>
      </div>
    </div>
  );
};
