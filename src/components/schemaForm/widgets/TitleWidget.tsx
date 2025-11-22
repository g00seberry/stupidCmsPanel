import { Input } from 'antd';
import type React from 'react';
import type { FieldRendererProps } from '../widgetRegistry';

/**
 * Виджет для полей заголовка (title).
 * Рендерит Input с ограничением максимальной длины (200 символов).
 * @param props Пропсы рендерера поля.
 * @returns Компонент Input для ввода заголовка.
 */
export const TitleWidget: React.FC<FieldRendererProps> = ({
  schema,
  value,
  onChange,
  disabled,
  readOnly,
}) => (
  <Input
    value={value}
    onChange={e => onChange?.(e.target.value)}
    maxLength={200}
    placeholder={schema.placeholder}
    disabled={disabled}
    readOnly={readOnly}
    {...schema.uiProps}
  />
);

