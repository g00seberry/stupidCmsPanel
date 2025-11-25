import { Select } from 'antd';
import type React from 'react';
import type { FieldRendererProps } from '../widgetRegistry';
import type { ZEditComponent } from '../componentDefs/ZComponent';

/**
 * Пропсы компонента SelectMultipleWidget.
 */
type PropsSelectMultipleWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: Extract<ZEditComponent, { name: 'select' }>;
};

/**
 * Виджет для множественного выбора из списка (Select с mode="multiple").
 * Рендерит Select с поддержкой множественного выбора для полей с cardinality 'many'.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Select для множественного выбора из списка.
 */
export const SelectMultipleWidget: React.FC<PropsSelectMultipleWidget> = ({
  value,
  onChange,
  disabled,
  readOnly,
  componentConfig,
  schema,
}) => {
  // Значение должно быть массивом
  const arrayValue = Array.isArray(value) ? value : [];

  return (
    <Select
      mode="multiple"
      value={arrayValue}
      onChange={onChange}
      placeholder={componentConfig?.props.placeholder}
      showSearch={componentConfig?.props.showSearch}
      style={{ width: '100%' }}
      disabled={disabled || readOnly}
      options={[]}
    />
  );
};

