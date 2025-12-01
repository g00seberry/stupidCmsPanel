import { getValueByPath } from '@/utils/pathUtils';
import { Checkbox } from 'antd';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import type { FieldRendererProps } from '../types';
import type { ZEditCheckbox } from '../ZComponent';
import { FormField } from './common/FormField';
import { getFieldLabel } from './common/getFieldLabel';

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
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Checkbox для булевых значений.
 */
export const CheckboxWidget: React.FC<PropsCheckboxWidget> = observer(
  ({ model, namePath, componentConfig }) => {
    const value = getValueByPath(model.values, namePath);
    const labelText = getFieldLabel(componentConfig, namePath);
    return (
      <FormField model={model} namePath={namePath} componentConfig={componentConfig}>
        <Checkbox checked={value} onChange={e => model.setValue(namePath, e.target.checked)}>
          {labelText}
        </Checkbox>
      </FormField>
    );
  }
);
