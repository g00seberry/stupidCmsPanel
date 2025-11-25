import { Checkbox } from 'antd';
import type React from 'react';
import type { FieldRendererProps } from '../widgetRegistry';
import type { ZEditComponent } from '../componentDefs/ZComponent';

/**
 * Пропсы компонента CheckboxGroupWidget.
 */
type PropsCheckboxGroupWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: Extract<ZEditComponent, { name: 'checkbox' }>;
};

/**
 * Виджет для множественного выбора чекбоксов (Checkbox.Group).
 * Рендерит группу чекбоксов для полей с cardinality 'many'.
 * Примечание: для bool полей с many обычно используется массив булевых значений или массив объектов.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Checkbox.Group для множественного выбора.
 */
export const CheckboxGroupWidget: React.FC<PropsCheckboxGroupWidget> = ({
  value,
  onChange,
  disabled,
  readOnly,
  componentConfig,
}) => {
  // Значение должно быть массивом
  const arrayValue = Array.isArray(value) ? value : [];

  // Для Checkbox.Group нужны опции, но их нет в конфигурации
  // Используем простой подход: массив булевых значений
  // В реальном сценарии может потребоваться передача опций через schema
  return (
    <Checkbox.Group
      value={arrayValue}
      onChange={onChange}
      disabled={disabled || readOnly}
    >
      {/* Опции должны быть предоставлены через другой механизм */}
      {/* Пока что это базовая реализация */}
    </Checkbox.Group>
  );
};

