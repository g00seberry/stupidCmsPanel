import { Input } from 'antd';
import type React from 'react';
import type { FieldRendererProps } from '../widgetRegistry';
import type { ZEditComponent } from '../componentDefs/ZComponent';

/**
 * Пропсы компонента TextareaWidget.
 */
type PropsTextareaWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: Extract<ZEditComponent, { name: 'textarea' }>;
};

/**
 * Виджет для многострочного текстового поля (TextArea).
 * Рендерит TextArea с настройками из конфигурации компонента.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент TextArea для ввода многострочного текста.
 */
export const TextareaWidget: React.FC<PropsTextareaWidget> = ({
  value,
  onChange,
  disabled,
  readOnly,
  componentConfig,
}) => {
  return (
    <Input.TextArea
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={componentConfig?.props.placeholder}
      rows={componentConfig?.props.rows}
      autoSize={!componentConfig?.props.rows}
      disabled={disabled}
      readOnly={readOnly}
      style={{ width: '100%' }}
    />
  );
};

