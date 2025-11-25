import { getValueByPath, pathToString } from '@/utils/pathUtils';
import { Checkbox } from 'antd';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import type { FieldRendererProps } from '../types';
import type { ZEditCheckbox } from '../ZComponent';
import { FormField } from './common/FormField';

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
    const pathStr = pathToString(namePath);
    const error = model.errorFor(pathStr);
    const labelText = String(componentConfig?.props.label || namePath[namePath.length - 1]);
    return (
      <FormField label={labelText} error={error}>
        <Checkbox checked={value} onChange={e => model.setValue(namePath, e.target.checked)}>
          {labelText}
        </Checkbox>
      </FormField>
    );
  }
);
