import type React from 'react';
import { OutdatedFieldIcon } from './OutdatedFieldIcon';

/**
 * Пропсы компонента FieldTitle.
 */
type PropsFieldTitle = {
  /** Текст заголовка. */
  label: string;
  /** Флаг наличия устаревших данных. */
  isOutdated?: boolean;
};

/**
 * Заголовок поля с иконкой предупреждения об устаревших данных.
 * Используется в JSON виджетах для отображения заголовка Card с предупреждением.
 * @param props Пропсы компонента.
 * @returns Заголовок с иконкой предупреждения.
 */
export const FieldTitle: React.FC<PropsFieldTitle> = ({ label, isOutdated }) => {
  return (
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <OutdatedFieldIcon isOutdated={isOutdated} />
    </div>
  );
};

