import { Checkbox } from 'antd';
import type React from 'react';
import { observer } from 'mobx-react-lite';
import type { FieldRendererProps } from '../types';
import type { ZEditCheckbox } from '../ZComponent';
import { getValueByPath } from '@/utils/pathUtils';

/**
 * Пропсы компонента CheckboxWidget.
 */
type PropsCheckboxWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditCheckbox;
};

/**
 * Виджет для чекбокса (Checkbox).
 * Рендерит Checkbox с настройками из конфигурации компонента.
 * Примечание: label отображается в SchemaForm, поэтому здесь не дублируется.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Checkbox для булевых значений.
 */
export const CheckboxWidget: React.FC<PropsCheckboxWidget> = observer(
  ({ model, namePath, componentConfig }) => {
    const value = getValueByPath(model.values, namePath);

    return (
      <Checkbox checked={value} onChange={e => model.setValue(namePath, e.target.checked)}>
        {componentConfig?.props.label || namePath[namePath.length - 1]}
      </Checkbox>
    );
  }
);
