import type { AxiosError } from 'axios';
import { message } from 'antd';
import {
  handleCyclicDependencyError,
  handlePathConflictError,
  handleReadonlyFieldError,
} from '@/utils/blueprintErrors';
import { onError } from '@/utils/onError';

/**
 * Обработать ошибку при сохранении узла Blueprint.
 * Определяет тип ошибки и показывает соответствующее сообщение пользователю.
 * @param error Ошибка, возникшая при сохранении узла.
 * @example
 * try {
 *   await pathStore.createPath(dto);
 * } catch (error) {
 *   handleBlueprintNodeError(error);
 * }
 */
export const handleBlueprintNodeError = (error: unknown): void => {
  if (!error || typeof error !== 'object' || !('response' in error)) {
    onError(error);
    return;
  }

  const axiosError = error as AxiosError;
  const responseData = (error as { response?: { data?: { message?: string } } }).response?.data;
  const errorMessage = responseData?.message || '';
  const lowerMessage = String(errorMessage).toLowerCase();

  if (lowerMessage.includes('readonly') || lowerMessage.includes('скопированное')) {
    message.error(handleReadonlyFieldError(axiosError));
  } else if (lowerMessage.includes('конфликт') || lowerMessage.includes('уже существует')) {
    message.error(handlePathConflictError(axiosError));
  } else if (lowerMessage.includes('цикл') || lowerMessage.includes('cyclic')) {
    message.error(handleCyclicDependencyError(axiosError));
  } else {
    onError(error);
  }
};
