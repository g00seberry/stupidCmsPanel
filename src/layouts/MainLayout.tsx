import { useCallback, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { headerLinks, sidebarLinks, systemSidebarLinks } from '@/layouts/layoutNavigation';
import { MainHeader } from '@/layouts/components/MainHeader';
import { MainSidebar } from '@/layouts/components/MainSidebar';

/**
 * Пропсы основного лэйаута приложения.
 */
export interface PropsMainLayout {
  /**
   * Содержимое текущей страницы.
   */
  readonly children: ReactNode;
  /**
   * Имя текущего пользователя, отображаемое в шапке.
   */
  readonly userName?: string;
  /**
   * Email пользователя для дополнительной информации.
   */
  readonly userEmail?: string;
  /**
   * Обработчик выхода из учетной записи.
   */
  readonly onLogout: () => Promise<void>;
}

/**
 * Основной лэйаут приложения со структурой из шаблона easy-forge.
 * @param props Свойства компонента.
 * @returns Разметку базового фрейма интерфейса.
 */
export const MainLayout: FC<PropsMainLayout> = props => {
  const { children, onLogout, userEmail, userName } = props;
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isActivePath = useCallback(
    (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname]
  );

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(previous => !previous);
  };

  const handleLogout = () => {
    void onLogout();
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <MainSidebar
        isActivePath={isActivePath}
        isCollapsed={isSidebarCollapsed}
        links={sidebarLinks}
        systemLinks={systemSidebarLinks}
        onLogout={handleLogout}
        onToggle={handleToggleSidebar}
      />

      <div className="flex flex-1 flex-col">
        <MainHeader
          links={headerLinks}
          onLogout={handleLogout}
          onToggleSidebar={handleToggleSidebar}
          userEmail={userEmail}
          userName={userName}
        />

        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
};
