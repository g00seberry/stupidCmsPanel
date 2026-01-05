import type { SidebarLink } from '@/layouts/layoutNavigation';
import { joinClassNames } from '@/utils/joinClassNames';
import { LeftOutlined } from '@ant-design/icons';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

/**
 * Пропсы компонента бокового меню.
 */
export interface PropsMainSidebar {
  /**
   * Ссылки раздела «Управление контентом».
   */
  readonly links: ReadonlyArray<SidebarLink>;
  /**
   * Ссылки системного раздела.
   */
  readonly systemLinks: ReadonlyArray<SidebarLink>;
  /**
   * Флаг свёрнутого состояния сайдбара.
   */
  readonly isCollapsed: boolean;
  /**
   * Коллбэк переключения ширины сайдбара.
   */
  readonly onToggle: () => void;
  /**
   * Проверяет, активен ли указанный путь.
   * @param path Проверяемый путь.
   * @returns Признак активности.
   */
  readonly isActivePath: (path: string) => boolean;
}

/**
 * Боковая панель навигации административной панели.
 * @param props Свойства компонента.
 * @returns Разметку сайдбара.
 */
export const MainSidebar: FC<PropsMainSidebar> = props => {
  const { isActivePath, isCollapsed, links, onToggle, systemLinks } = props;

  const containerClassName = joinClassNames(
    'border-r bg-card transition-all duration-300 flex flex-col h-full overflow-hidden',
    isCollapsed ? 'w-16' : 'w-64'
  );

  const linkClassName = joinClassNames(
    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-foreground hover:bg-muted'
  );

  return (
    <aside className={containerClassName}>
      <div className="p-4 flex justify-end">
        <button
          type="button"
          className="hover:bg-muted flex h-9 w-9 items-center justify-center rounded-md border"
          onClick={onToggle}
          aria-label={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
          aria-pressed={isCollapsed}
        >
          <LeftOutlined
            className={joinClassNames(
              'h-5 w-5 transition-transform text-foreground',
              isCollapsed && 'rotate-180'
            )}
            aria-hidden
          />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <div className="mb-4">
          {isCollapsed ? null : (
            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
              Управление контентом
            </p>
          )}
        </div>

        {links.map(link => {
          const Icon = link.icon;
          const active = isActivePath(link.url);

          return (
            <Link
              key={link.url}
              to={link.url}
              className={joinClassNames(
                linkClassName,
                active && 'bg-primary text-primary-foreground font-medium hover:bg-primary',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? link.title : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" aria-hidden />
              {isCollapsed ? null : <span className="text-sm">{link.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t space-y-1">
        {isCollapsed ? null : (
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Система</p>
        )}

        {systemLinks.map(link => {
          const Icon = link.icon;
          const active = isActivePath(link.url);

          return (
            <Link
              key={link.url}
              to={link.url}
              className={joinClassNames(
                linkClassName,
                active && 'bg-primary text-primary-foreground font-medium hover:bg-primary',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? link.title : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" aria-hidden />
              {isCollapsed ? null : <span className="text-sm">{link.title}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
