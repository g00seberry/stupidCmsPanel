import type { HeaderLink } from '@/layouts/layoutNavigation';
import { joinClassNames } from '@/utils/joinClassNames';
import { ChevronDown, LogOut, Menu, Sliders } from 'lucide-react';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * Пропсы компонента верхнего меню.
 */
export interface PropsMainHeader {
  /**
   * Ссылки для навигации.
   */
  readonly links: ReadonlyArray<HeaderLink>;
  /**
   * Коллбэк переключения состояния сайдбара.
   */
  readonly onToggleSidebar?: () => void;
  /**
   * Коллбэк выхода из приложения.
   */
  readonly onLogout: () => void;
  /**
   * Имя пользователя.
   */
  readonly userName?: string;
  /**
   * Email пользователя.
   */
  readonly userEmail?: string;
}

/**
 * Верхняя панель управления с навигацией и меню пользователя.
 * @param props Свойства компонента.
 * @returns Разметку шапки страницы.
 */
export const MainHeader: FC<PropsMainHeader> = props => {
  const { links, onLogout, onToggleSidebar, userEmail, userName } = props;
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const headerNavLinkBaseClass =
    'px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-primary-foreground/10';

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  const handleToggleProfileMenu = () => {
    setIsProfileMenuOpen(previous => !previous);
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
      <div className="flex h-14 items-center px-4 gap-4">
        {onToggleSidebar ? (
          <button
            type="button"
            className="text-primary-foreground hover:bg-primary-foreground/10 flex h-9 w-9 items-center justify-center rounded-md"
            onClick={onToggleSidebar}
            aria-label="Переключить сайдбар"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        ) : null}

        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5" aria-hidden />
          <span className="font-semibold text-lg">CMS</span>
        </div>

        <nav className="flex items-center gap-1 ml-8">
          {links.map(link => (
            <NavLink
              key={link.url}
              to={link.url}
              end={link.exact}
              className={({ isActive }) =>
                joinClassNames(headerNavLinkBaseClass, isActive ? 'bg-primary-foreground/20' : '')
              }
            >
              {link.title}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto relative" ref={profileMenuRef}>
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
            onClick={handleToggleProfileMenu}
            aria-haspopup="menu"
            aria-expanded={isProfileMenuOpen}
          >
            <span className="text-sm font-medium">{userName ?? 'Administrator'}</span>
            <ChevronDown className="h-4 w-4" aria-hidden />
          </button>
          {isProfileMenuOpen ? (
            <div
              className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-card p-2 shadow-lg"
              role="menu"
            >
              <div className="px-3 py-2">
                <p className="text-sm font-semibold">{userName ?? 'Администратор'}</p>
                {userEmail ? <p className="text-xs text-muted-foreground">{userEmail}</p> : null}
              </div>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition"
                onClick={handleLogout}
                role="menuitem"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Выйти
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
