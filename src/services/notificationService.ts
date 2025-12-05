import { notification } from 'antd';
import type { NotificationArgsProps } from 'antd';
import type { NotificationInstance } from 'antd/es/notification/interface';

let currentApi: NotificationInstance | null = null;

/**
 * Сервис интеграции с уведомлениями Ant Design.
 */
export const notificationService = {
  /**
   * Сохраняет экземпляр API уведомлений для дальнейшего использования.
   * @param value Экземпляр API или `null`, если доступ нужно очистить.
   */
  setApi: (value: NotificationInstance | null): void => {
    currentApi = value;
  },
  /**
   * Показывает уведомление об ошибке, используя доступный API или глобальный fallback.
   * @param config Параметры уведомления.
   */
  showError: (config: NotificationArgsProps): void => {
    if (currentApi) {
      currentApi.error(config);
      return;
    }

    notification.error(config);
  },
  /**
   * Показывает уведомление об успешном завершении операции.
   * @param config Параметры уведомления.
   */
  showSuccess: (config: NotificationArgsProps): void => {
    if (currentApi) {
      currentApi.success(config);
      return;
    }

    notification.success(config);
  },
} as const;
