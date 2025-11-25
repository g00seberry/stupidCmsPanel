import { Checkbox } from 'antd';
import type React from 'react';
import type { FieldRendererProps } from '../widgetRegistry';
import type { ZEditComponent } from '../componentDefs/ZComponent';

/**
 * Пропсы компонента CheckboxWidget.
 */
type PropsCheckboxWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: Extract<ZEditComponent, { name: 'checkbox' }>;
};

/**
 * Виджет для чекбокса (Checkbox).
 * Рендерит Checkbox с настройками из конфигурации компонента.
 * Примечание: label отображается в SchemaForm, поэтому здесь не дублируется.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Checkbox для булевых значений.
 */
export const CheckboxWidget: React.FC<PropsCheckboxWidget> = ({
  value,
  onChange,
  disabled,
  readOnly,
  componentConfig,
  namePath,
}) => {
  return (
    <Checkbox
      checked={value}
      onChange={e => onChange?.(e.target.checked)}
      disabled={disabled || readOnly}
    >
      {componentConfig?.props.label || namePath}
    </Checkbox>
  );
};
