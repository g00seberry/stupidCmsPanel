import { Select } from 'antd';
import type React from 'react';
import { observer } from 'mobx-react-lite';
import type { FieldRendererProps } from '../types';
import type { ZEditSelect } from '../ZComponent';
import { getValueByPath } from '@/utils/pathUtils';
import { FormField } from './common/FormField';

/**
 * Пропсы компонента SelectWidget.
 */
type PropsSelectWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditSelect;
};

/**
 * Виджет для выбора из списка (Select).
 * Рендерит Select с настройками из конфигурации компонента.
 * Примечание: опции должны быть предоставлены через schema или другой механизм.
 * Для ref полей используется RefFieldWidget из widgetRegistry.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Select для выбора из списка.
 */
export const SelectWidget: React.FC<PropsSelectWidget> = observer(
  ({ model, namePath, componentConfig }) => {
    const value = getValueByPath(model.values, namePath);

    // Опции должны быть предоставлены через другой механизм (например, через schema или расширенную конфигурацию)
    // Пока оставляем пустой массив - виджет используется для ref полей через RefFieldWidget
    const options: Array<{ label: string; value: string | number }> = [];

    return (
      <FormField model={model} namePath={namePath} componentConfig={componentConfig}>
        <Select
          value={value}
          onChange={val => model.setValue(namePath, val)}
          placeholder={componentConfig?.props.placeholder}
          showSearch={componentConfig?.props.showSearch}
          className="w-full"
          options={options}
          notFoundContent={options.length === 0 ? 'Опции не загружены' : undefined}
        />
      </FormField>
    );
  }
);
