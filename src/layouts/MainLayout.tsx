import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { Button, Menu, Typography, theme, type MenuProps } from 'antd';
import { useState } from 'react';
import type { CSSProperties, FC, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './mainLayout.module.less';

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
 * Основной лэйаут приложения на CSS grid с заголовком и сайдбаром.
 * @param props Свойства компонента.
 * @returns Разметка базового фрейма интерфейса.
 */
export const MainLayout: FC<PropsMainLayout> = props => {
  const { children, onLogout, userEmail, userName } = props;
  const { token } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const themeVariables = {
    '--layout-bg': token.colorBgLayout,
    '--sidebar-bg': token.colorBgContainer,
    '--header-bg': token.colorBgContainer,
    '--border-color': token.colorBorder,
    '--heading-color': token.colorTextHeading,
    '--text-color': token.colorText,
    '--muted-color': token.colorTextSecondary,
  } as CSSProperties;

  const menuItems: MenuProps['items'] = [
    {
      key: '/entries',
      icon: <ReadOutlined />,
      label: 'Материалы',
    },
  ];

  const selectedKeys = location.pathname.startsWith('/entries')
    ? ['/entries']
    : [location.pathname];

  const handleToggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key.toString());
  };

  const handleLogout = () => {
    void onLogout();
  };

  return (
    <div className={styles.layout} data-collapsed={collapsed} style={themeVariables}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Typography.Title level={5} className={styles.brandTitle}>
            CMS Admin
          </Typography.Title>
          <Typography.Text type="secondary" className={styles.brandSubtitle}>
            Управление контентом
          </Typography.Text>
        </div>

        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          className={styles.menu}
          items={menuItems}
          selectedKeys={selectedKeys}
          onClick={handleMenuClick}
        />
      </aside>

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleToggleSidebar}
            aria-label={collapsed ? 'Открыть меню' : 'Скрыть меню'}
            className={styles.menuTrigger}
          />
          <Typography.Title level={4} className={styles.headerTitle}>
            Панель управления
          </Typography.Title>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.userBlock}>
            {userName ? (
              <Typography.Text strong className={styles.userName}>
                {userName}
              </Typography.Text>
            ) : null}
            {userEmail ? (
              <Typography.Text type="secondary" className={styles.userEmail}>
                {userEmail}
              </Typography.Text>
            ) : null}
          </div>
          <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.contentInner}>{children}</div>
      </main>
    </div>
  );
};
