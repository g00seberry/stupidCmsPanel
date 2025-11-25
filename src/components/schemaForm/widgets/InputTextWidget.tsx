import { Input } from 'antd';
import type React from 'react';
import { observer } from 'mobx-react-lite';
import type { FieldRendererProps } from '../types';
import type { ZEditInputText } from '../ZComponent';
import { getValueByPath } from '@/utils/pathUtils';

/**
 * Пропсы компонента InputTextWidget.
 */
type PropsInputTextWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditInputText;
};

/**
 * Виджет для текстового поля ввода (Input).
 * Рендерит Input с настройками из конфигурации компонента.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент Input для ввода текста.
 */
export const InputTextWidget: React.FC<PropsInputTextWidget> = observer(
  ({ model, namePath, componentConfig }) => {
    const value = getValueByPath(model.values, namePath);

    return (
      <Input
        value={value}
        onChange={e => model.setValue(namePath, e.target.value)}
        placeholder={componentConfig?.props.placeholder}
        style={{ width: '100%' }}
      />
    );
  }
);
