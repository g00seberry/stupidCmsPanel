import type React from 'react';

/**
 * Пропсы компонента FieldError.
 */
export type PropsFieldError = {
  /** Текст ошибки для отображения. */
  error?: string;
};

/**
 * Компонент для отображения ошибки валидации поля формы.
 * Использует Tailwind классы вместо inline-стилей для соответствия правилам проекта.
 * @param props Пропсы компонента.
 * @returns Элемент с текстом ошибки или null, если ошибки нет.
 */
export const FieldError: React.FC<PropsFieldError> = ({ error }) => {
  if (!error) {
    return null;
  }

  return <div className="text-red-500 text-sm mt-1">{error}</div>;
};

