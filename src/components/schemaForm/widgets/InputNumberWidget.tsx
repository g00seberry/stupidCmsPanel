import { InputNumber } from 'antd';
import type React from 'react';
import type { FieldRendererProps } from '../widgetRegistry';
import type { ZEditInputNumber } from '../componentDefs/ZComponent';

/**
 * Пропсы компонента InputNumberWidget.
 */
type PropsInputNumberWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditInputNumber;
};

/**
 * Виджет для числового поля ввода (InputNumber).
 * Рендерит InputNumber с настройками из конфигурации компонента.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент InputNumber для ввода числа.
 */
export const InputNumberWidget: React.FC<PropsInputNumberWidget> = ({
  value,
  onChange,
  componentConfig,
}) => {
  return (
    <InputNumber
      value={value}
      onChange={onChange}
      placeholder={componentConfig?.props.placeholder}
      min={componentConfig?.props.min}
      max={componentConfig?.props.max}
      step={componentConfig?.props.step}
      style={{ width: '100%' }}
    />
  );
};
