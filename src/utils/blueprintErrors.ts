import type { AxiosError } from 'axios';
import { zProblemJson } from '@/types/ZProblemJson';

/**
 * Извлечь сообщение об ошибке из Problem JSON или стандартного ответа.
 * @param error Ошибка Axios с ответом от API.
 * @returns Сообщение об ошибке или `undefined`, если не найдено.
 */
const extractErrorMessage = (error: AxiosError): string | undefined => {
  const problemResult = zProblemJson.safeParse(error.response?.data);

  if (problemResult.success) {
    const problem = problemResult.data;
    if (problem.detail) {
      return problem.detail;
    }
    if (problem.title) {
      return problem.title;
    }
  }

  // Проверка на стандартные сообщения об ошибке
  const responseData = error.response?.data as { message?: string } | undefined;
  const errorMessage = error.message || responseData?.message;
  if (errorMessage && typeof errorMessage === 'string') {
    return errorMessage;
  }

  return undefined;
};

/**
 * Обработчик ошибки циклической зависимости.
 * Извлекает информацию о циклической зависимости из ответа API.
 * @param error Ошибка Axios с ответом от API.
 * @returns Сообщение об ошибке для отображения пользователю.
 */
export const handleCyclicDependencyError = (error: AxiosError): string => {
  const errorMessage = extractErrorMessage(error);
  if (errorMessage) {
    const lowerMessage = errorMessage.toLowerCase();
    if (lowerMessage.includes('cyclic') || lowerMessage.includes('цикл')) {
      return errorMessage;
    }
  }

  return 'Обнаружена циклическая зависимость между Blueprint. Встраивание невозможно.';
};

/**
 * Обработчик ошибки конфликта путей.
 * Извлекает информацию о конфликте путей из ответа API.
 * @param error Ошибка Axios с ответом от API.
 * @returns Сообщение об ошибке для отображения пользователю.
 */
export const handlePathConflictError = (error: AxiosError): string => {
  const errorMessage = extractErrorMessage(error);
  if (errorMessage) {
    const lowerMessage = errorMessage.toLowerCase();
    if (
      lowerMessage.includes('conflict') ||
      lowerMessage.includes('конфликт') ||
      lowerMessage.includes('уже существует')
    ) {
      return errorMessage;
    }
  }

  return 'Конфликт путей: поле с таким именем уже существует на этом уровне.';
};

/**
 * Обработчик ошибки редактирования readonly поля.
 * Извлекает информацию о попытке редактирования readonly поля из ответа API.
 * @param error Ошибка Axios с ответом от API.
 * @returns Сообщение об ошибке для отображения пользователю.
 */
export const handleReadonlyFieldError = (error: AxiosError): string => {
  const errorMessage = extractErrorMessage(error);
  if (errorMessage) {
    const lowerMessage = errorMessage.toLowerCase();
    if (
      lowerMessage.includes('readonly') ||
      lowerMessage.includes('read-only') ||
      lowerMessage.includes('только для чтения')
    ) {
      return errorMessage;
    }
  }

  return 'Это поле доступно только для чтения. Измените исходный Blueprint для изменения структуры.';
};
