import { notification } from 'antd';
import axios from 'axios';

/**
 * Дополнительные параметры уведомления об ошибке.
 */
type OnErrorOptions = {
  message?: string;
};

/**
 * Показывает уведомление об ошибке и извлекает описание из разных источников.
 * @param error Ошибка, которую необходимо отобразить.
 * @param options Настройки отображения уведомления.
 */
export const onError = (error: unknown, options: OnErrorOptions = {}): void => {
  const { message: fallbackMessage = 'Ошибка' } = options;

  let description: string | undefined;
  let notificationMessage: string | null = fallbackMessage;

  if (axios.isAxiosError(error)) {
    description = error.response?.data?.detail ?? error.message;
  } else if (typeof error === 'string') {
    description = error;
  }

  if (notificationMessage) {
    notification.error({
      message: notificationMessage,
      description,
    });
  }
};
