import { getValueByPath, pathToString } from '@/utils/pathUtils';
import { Select } from 'antd';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import type { ZEditSelectMultiple } from '../ZComponent';
import type { FieldRendererProps } from '../types';
import { FieldError } from '../FieldError';

/**
 * Пропсы компонента SelectMultipleWidget.
 */
type PropsSelectMultipleWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditSelectMultiple;
};

/**
 * Виджет для множественного выбора из списка (Select с mode="multiple").
 * Рендерит Select с поддержкой множественного выбора для полей с cardinality 'many'.
 * Примечание: опции должны быть предоставлены через schema или другой механизм.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Select для множественного выбора из списка.
 */
export const SelectMultipleWidget: React.FC<PropsSelectMultipleWidget> = observer(
  ({ model, namePath, componentConfig }) => {
    const value = getValueByPath(model.values, namePath);
    const pathStr = pathToString(namePath);
    const error = model.errorFor(pathStr);
    // Значение должно быть массивом
    const arrayValue = Array.isArray(value) ? value : [];

    // Опции должны быть предоставлены через другой механизм (например, через schema или расширенную конфигурацию)
    const options: Array<{ label: string; value: string | number }> = [];

    return (
      <>
        <Select
          mode="multiple"
          value={arrayValue}
          onChange={val => model.setValue(namePath, val)}
          placeholder={componentConfig?.props.placeholder}
          showSearch={componentConfig?.props.showSearch}
          className="w-full"
          options={options}
          notFoundContent={options.length === 0 ? 'Опции не загружены' : undefined}
        />
        <FieldError error={error} />
      </>
    );
  }
);
