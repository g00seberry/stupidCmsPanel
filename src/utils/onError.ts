import { notification } from 'antd';
import axios from 'axios';
import { zProblemJson, type ZProblemJson } from '@/types/ProblemJson';

/**
 * Дополнительные параметры уведомления об ошибке.
 */
type OnErrorOptions = {
  message?: string;
};

/**
 * Возвращает строку с ошибками валидации из структуры Problem JSON.
 * @param problem Объект ошибки API.
 * @returns Строка с ошибками или `undefined`, если ошибок нет.
 */
const getValidationErrors = (problem: ZProblemJson): string | undefined => {
  const metaErrors = problem.meta?.errors;

  if (!metaErrors) {
    return undefined;
  }

  const messages = Object.entries(metaErrors)
    .map(([field, issues]) => {
      if (!Array.isArray(issues) || issues.length === 0) {
        return undefined;
      }

      return `${field}: ${issues.join(', ')}`;
    })
    .filter((message): message is string => Boolean(message));

  if (messages.length === 0) {
    return undefined;
  }

  return messages.join('\n');
};

/**
 * Формирует описание ошибки на основе структуры Problem JSON.
 * @param problem Объект ошибки API.
 * @returns Подробное описание ошибки.
 */
const buildProblemDescription = (problem: ZProblemJson): string | undefined => {
  const details: string[] = [];

  if (problem.detail) {
    details.push(problem.detail);
  }

  const validationErrors = getValidationErrors(problem);

  if (validationErrors) {
    details.push(validationErrors);
  }

  if (problem.meta?.request_id) {
    details.push(`Request ID: ${problem.meta.request_id}`);
  }

  if (problem.meta?.retry_after) {
    details.push(`Повторите попытку через ${problem.meta.retry_after} сек.`);
  }

  if (problem.trace_id) {
    details.push(`Trace ID: ${problem.trace_id}`);
  }

  if (details.length === 0) {
    return undefined;
  }

  return details.join('\n');
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
    const problemResult = zProblemJson.safeParse(error.response?.data);

    if (problemResult.success) {
      const problem = problemResult.data;
      notificationMessage = options.message ?? problem.title ?? problem.code ?? fallbackMessage;
      description = buildProblemDescription(problem) ?? error.message;
    } else {
      const responseDetail = (error.response?.data as { detail?: string } | undefined)?.detail;
      description = responseDetail ?? error.message;
    }
  } else if (typeof error === 'string') {
    description = error;
  } else if (error instanceof Error) {
    description = error.message;
  }

  if (notificationMessage) {
    notification.error({
      message: notificationMessage,
      description,
    });
  }
};
