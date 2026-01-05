import { authStore } from '@/AuthStore';
import { DownOutlined, LogoutOutlined, SlidersOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Верхняя панель управления с навигацией и меню пользователя.
 * @param props Свойства компонента.
 * @returns Разметку шапки страницы.
 */
export const MainHeader = observer(() => {
  const { name: userName, email: userEmail } = authStore.user ?? {};

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

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
    authStore.logout();
  };

  return (
    <header className="z-50 w-full border-b bg-primary text-primary-foreground">
      <div className="flex h-14 items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          <SlidersOutlined className="h-5 w-5" aria-hidden />
          <span className="font-semibold text-lg">CMS</span>
        </div>

        <div className="ml-auto relative" ref={profileMenuRef}>
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
            onClick={handleToggleProfileMenu}
            aria-haspopup="menu"
            aria-expanded={isProfileMenuOpen}
          >
            <span className="text-sm font-medium">{userName ?? 'Administrator'}</span>
            <DownOutlined className="h-4 w-4" aria-hidden />
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
                <LogoutOutlined className="h-4 w-4" aria-hidden />
                Выйти
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
});
