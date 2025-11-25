import { Input } from 'antd';
import type React from 'react';
import { observer } from 'mobx-react-lite';
import type { FieldRendererProps } from '../types';
import type { ZEditTextarea } from '../ZComponent';
import { getValueByPath } from '@/utils/pathUtils';

/**
 * Пропсы компонента TextareaWidget.
 */
type PropsTextareaWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditTextarea;
};

/**
 * Виджет для многострочного текстового поля (TextArea).
 * Рендерит TextArea с настройками из конфигурации компонента.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Компонент TextArea для ввода многострочного текста.
 */
export const TextareaWidget: React.FC<PropsTextareaWidget> = observer(
  ({ model, namePath, componentConfig }) => {
    const value = getValueByPath(model.values, namePath);

    return (
      <Input.TextArea
        value={value}
        onChange={e => model.setValue(namePath, e.target.value)}
        placeholder={componentConfig?.props.placeholder}
        rows={componentConfig?.props.rows}
        autoSize={!componentConfig?.props.rows}
        style={{ width: '100%' }}
      />
    );
  }
);
