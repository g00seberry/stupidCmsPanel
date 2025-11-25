import { InputNumber } from 'antd';
import type React from 'react';
import { observer } from 'mobx-react-lite';
import type { FieldRendererProps } from '../types';
import type { ZEditInputNumber } from '../ZComponent';
import { getValueByPath } from '@/utils/pathUtils';

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
export const InputNumberWidget: React.FC<PropsInputNumberWidget> = observer(
  ({ model, namePath, componentConfig }) => {
    const value = getValueByPath(model.values, namePath);

    return (
      <InputNumber
        value={value}
        onChange={val => model.setValue(namePath, val)}
        placeholder={componentConfig?.props.placeholder}
        min={componentConfig?.props.min}
        max={componentConfig?.props.max}
        step={componentConfig?.props.step}
        style={{ width: '100%' }}
      />
    );
  }
);
