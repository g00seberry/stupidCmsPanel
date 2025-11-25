import { Select } from 'antd';
import type React from 'react';
import type { FieldRendererProps } from '../widgetRegistry';
import type { ZEditComponent } from '../componentDefs/ZComponent';

/**
 * Пропсы компонента SelectWidget.
 */
type PropsSelectWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: Extract<ZEditComponent, { name: 'select' }>;
};

/**
 * Виджет для выбора из списка (Select).
 * Рендерит Select с настройками из конфигурации компонента.
 * Примечание: опции должны быть предоставлены через schema или другой механизм.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Select для выбора из списка.
 */
export const SelectWidget: React.FC<PropsSelectWidget> = ({
  value,
  onChange,
  disabled,
  readOnly,
  componentConfig,
}) => {
  // Для ref полей используется RefFieldWidget из widgetRegistry
  // Этот компонент используется для других случаев, когда нужен Select
  // Опции должны быть предоставлены через другой механизм (например, через schema)
  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={componentConfig?.props.placeholder}
      showSearch={componentConfig?.props.showSearch}
      style={{ width: '100%' }}
      disabled={disabled || readOnly}
      options={[]}
    />
  );
};
