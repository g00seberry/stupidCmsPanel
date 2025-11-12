import { MainHeader } from '@/layouts/components/MainHeader';
import { MainSidebar } from '@/layouts/components/MainSidebar';
import { headerLinks, sidebarLinks, systemSidebarLinks } from '@/layouts/layoutNavigation';
import type { FC, ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Пропсы основного лэйаута приложения.
 */
export interface PropsMainLayout {
  /**
   * Содержимое текущей страницы.
   */
  readonly children: ReactNode;
}

/**
 * Основной лэйаут приложения со структурой из шаблона easy-forge.
 * @param props Свойства компонента.
 * @returns Разметку базового фрейма интерфейса.
 */
export const MainLayout: FC<PropsMainLayout> = props => {
  const { children } = props;
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isActivePath = useCallback(
    (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname]
  );

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(previous => !previous);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <MainSidebar
        isActivePath={isActivePath}
        isCollapsed={isSidebarCollapsed}
        links={sidebarLinks}
        systemLinks={systemSidebarLinks}
        onToggle={handleToggleSidebar}
      />
      <div className="flex flex-1 flex-col">
        <MainHeader links={headerLinks} />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
};
