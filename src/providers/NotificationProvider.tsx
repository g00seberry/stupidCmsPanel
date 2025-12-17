import { notificationService } from '@/services/notificationService';
import { notification } from 'antd';
import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';

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
  const [api, contextHolder] = notification.useNotification({ placement: 'bottomRight' });

  useEffect(() => {
    notificationService.setApi(api);
    return () => {
      notificationService.setApi(null);
    };
  }, [api]);

  return (
    <>
      {children}
      {contextHolder}
    </>
  );
};
