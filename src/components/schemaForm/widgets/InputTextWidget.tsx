import { Input } from 'antd';
import type React from 'react';
import { observer } from 'mobx-react-lite';
import type { FieldRendererProps } from '../types';
import type { ZEditInputText } from '../ZComponent';
import { getValueByPath, pathToString } from '@/utils/pathUtils';
import { FormField } from './common/FormField';

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
    const pathStr = pathToString(namePath);
    const error = model.errorFor(pathStr);
    const labelText = String(componentConfig?.props.label || namePath[namePath.length - 1]);

    return (
      <FormField label={labelText} error={error}>
        <Input
          value={value}
          onChange={e => model.setValue(namePath, e.target.value)}
          placeholder={componentConfig?.props.placeholder}
          className="w-full"
        />
      </FormField>
    );
  }
);
