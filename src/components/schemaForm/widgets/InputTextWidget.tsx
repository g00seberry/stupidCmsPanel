import { Input } from 'antd';
import type React from 'react';
import type { FieldRendererProps } from '../widgetRegistry';
import type { ZEditInputText } from '../componentDefs/ZComponent';

/**
 * Пропсы компонента InputTextWidget.
 */
type PropsInputTextWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditInputText;
};

/**
 * Виджет для текстового поля ввода (Input).
 * Рендерит Input с настройками из конфигурации компонента.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Input для ввода текста.
 */
export const InputTextWidget: React.FC<PropsInputTextWidget> = ({
  value,
  onChange,
  disabled,
  readOnly,
  componentConfig,
}) => {
  return (
    <Input
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={componentConfig?.props.placeholder}
      disabled={disabled}
      readOnly={readOnly}
      style={{ width: '100%' }}
    />
  );
};
