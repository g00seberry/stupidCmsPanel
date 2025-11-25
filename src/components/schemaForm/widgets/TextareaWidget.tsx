import { Input } from 'antd';
import type React from 'react';
import { observer } from 'mobx-react-lite';
import type { FieldRendererProps } from '../types';
import type { ZEditTextarea } from '../ZComponent';
import { getValueByPath, pathToString } from '@/utils/pathUtils';
import { FormField } from './common/FormField';

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
    const pathStr = pathToString(namePath);
    const error = model.errorFor(pathStr);
    const labelText = String(componentConfig?.props.label || namePath[namePath.length - 1]);

    return (
      <FormField label={labelText} error={error}>
        <Input.TextArea
          value={value}
          onChange={e => model.setValue(namePath, e.target.value)}
          placeholder={componentConfig?.props.placeholder}
          rows={componentConfig?.props.rows}
          autoSize={!componentConfig?.props.rows}
          className="w-full"
        />
      </FormField>
    );
  }
);
