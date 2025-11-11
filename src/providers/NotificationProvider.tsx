import { App } from 'antd';
import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import { notificationService } from '@/services/notificationService';

/**
 * Пропсы провайдера уведомлений Ant Design.
 */
export interface PropsNotificationProvider {
  /**
   * Дочерние элементы, имеющие доступ к API уведомлений.
   */
  readonly children: ReactNode;
}

/**
 * Передаёт экземпляр API уведомлений Ant Design в сервис для использования вне React-дерева.
 * @param props Свойства компонента.
 * @returns Дочерние элементы.
 */
export const NotificationProvider: FC<PropsNotificationProvider> = props => {
  const { children } = props;
  const { notification } = App.useApp();

  useEffect(() => {
    notificationService.setApi(notification);
    return () => {
      notificationService.setApi(null);
    };
  }, [notification]);

  return <>{children}</>;
};
