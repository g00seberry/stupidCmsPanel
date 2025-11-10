import { notification } from 'antd';
import { isHttpError } from '@/utils/http-error';

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
  const { message = 'Ошибка' } = options;

  let description: string | undefined;

  if (isHttpError(error)) {
    description = error.problem?.detail ?? error.problem?.title ?? error.raw ?? undefined;
  } else if (error instanceof Error) {
    description = error.message;
  } else if (typeof error === 'string') {
    description = error;
  }

  notification.error({
    message,
    description,
  });
};
