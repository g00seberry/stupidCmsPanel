import { Select } from 'antd';
import type React from 'react';
import { observer } from 'mobx-react-lite';
import type { FieldRendererProps } from '../types';
import type { ZEditSelect } from '../ZComponent';
import { getValueByPath } from '@/utils/pathUtils';

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
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Select для выбора из списка.
 */
export const SelectWidget: React.FC<PropsSelectWidget> = observer(
  ({ model, namePath, componentConfig }) => {
    const value = getValueByPath(model.values, namePath);

    // Для ref полей используется RefFieldWidget из widgetRegistry
    // Этот компонент используется для других случаев, когда нужен Select
    // Опции должны быть предоставлены через другой механизм (например, через schema)
    return (
      <Select
        value={value}
        onChange={val => model.setValue(namePath, val)}
        placeholder={componentConfig?.props.placeholder}
        showSearch={componentConfig?.props.showSearch}
        style={{ width: '100%' }}
        options={[]}
      />
    );
  }
);
