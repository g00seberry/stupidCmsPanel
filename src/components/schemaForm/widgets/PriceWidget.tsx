import { InputNumber } from 'antd';
import type React from 'react';
import type { FieldRendererProps } from '../widgetRegistry';

/**
 * Виджет для полей цены (price).
 * Рендерит InputNumber с префиксом валюты и минимальным значением 0.
 * @param props Пропсы рендерера поля.
 * @returns Компонент InputNumber для ввода цены.
 */
export const PriceWidget: React.FC<FieldRendererProps> = ({ schema }) => (
  <InputNumber
    prefix="₽"
    min={0}
    style={{ width: '100%' }}
    placeholder={schema.placeholder}
    {...schema.uiProps}
  />
);

