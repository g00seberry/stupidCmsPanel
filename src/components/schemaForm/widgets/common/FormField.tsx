import type React from 'react';
import { FieldError } from '../../FieldError';

/**
 * Пропсы компонента FormField.
 */
type PropsFormField = {
  /** Текст label для поля. */
  label: string;
  /** Дочерние элементы (поле ввода и т.д.). */
  children: React.ReactNode;
  /** Текст ошибки валидации (опционально). */
  error?: string;
};

/**
 * Обёртка для поля формы, которая добавляет label и отображение ошибки.
 * Используется для единообразного оформления полей во всех виджетах.
 * @param props Пропсы компонента.
 * @returns Обёрнутое поле с label и ошибкой.
 */
export const FormField: React.FC<PropsFormField> = ({ label, children, error }) => {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      {children}
      <FieldError error={error} />
    </div>
  );
};
