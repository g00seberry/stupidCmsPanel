import type { NotificationArgsProps } from 'antd';
import type { NotificationInstance } from 'antd/es/notification/interface';

/**
 * Сервис интеграции с уведомлениями Ant Design.
 */
export class NotificationService {
  api: NotificationInstance | null = null;
  setApi(newApi: NotificationInstance | null) {
    this.api = newApi;
  }
  showError(config: NotificationArgsProps) {
    this.api?.error(config);
  }
  showSuccess(config: NotificationArgsProps) {
    this.api?.success(config);
  }
}

export const notificationService = new NotificationService();
