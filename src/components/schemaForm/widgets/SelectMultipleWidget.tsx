import { Select } from 'antd';
import type React from 'react';
import { observer } from 'mobx-react-lite';
import type { FieldRendererProps } from '../types/FieldRendererProps';
import type { ZEditSelect } from '../componentDefs/ZComponent';
import { getValueByPath } from '@/utils/pathUtils';

/**
 * Пропсы компонента SelectMultipleWidget.
 */
type PropsSelectMultipleWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditSelect;
};

/**
 * Виджет для множественного выбора из списка (Select с mode="multiple").
 * Рендерит Select с поддержкой множественного выбора для полей с cardinality 'many'.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Select для множественного выбора из списка.
 */
export const SelectMultipleWidget: React.FC<PropsSelectMultipleWidget> = observer(
  ({ model, namePath, componentConfig }) => {
    const value = getValueByPath(model.values, namePath);
    // Значение должно быть массивом
    const arrayValue = Array.isArray(value) ? value : [];

    return (
      <Select
        mode="multiple"
        value={arrayValue}
        onChange={val => model.setValue(namePath, val)}
        placeholder={componentConfig?.props.placeholder}
        showSearch={componentConfig?.props.showSearch}
        style={{ width: '100%' }}
        options={[]}
      />
    );
  }
);
