import { Form, Input } from 'antd';
import type React from 'react';
import { getFieldLabel } from '../utils/getFieldLabel';
import { getFormItemRules } from '../utils/getFormItemRules';
import {
  isFieldDisabled,
  getFieldTooltip,
  getFieldPlaceholder,
  createFieldName,
} from '../utils/pathFieldUtils';
import type { PropsPathFieldBase } from './PathField.types';
import { PathListField } from './PathListField';

/**
 * Компонент поля типа text (длинный текст).
 * Поддерживает cardinality: one и many через Form.List.
 */
export const PathTextAreaField: React.FC<PropsPathFieldBase> = ({
  path,
  fieldNamePrefix,
  readonly,
}) => {
  const label = getFieldLabel(path);
  const rules = getFormItemRules(path);
  const fieldName = createFieldName(fieldNamePrefix, path.name);
  const disabled = isFieldDisabled(path, readonly);
  const tooltip = getFieldTooltip(path);
  const placeholder = getFieldPlaceholder(path);

  if (path.cardinality === 'many') {
    return (
      <PathListField
        fieldName={fieldName}
        label={label}
        rules={rules}
        disabled={disabled}
        renderField={() => (
          <Input.TextArea rows={4} placeholder={placeholder} disabled={disabled} />
        )}
        renderAddField={add => (
          <Input.TextArea
            rows={4}
            placeholder={getFieldPlaceholder(path, 'Добавить')}
            onPressEnter={e => {
              if (e.shiftKey) {
                e.preventDefault();
                add();
              }
            }}
          />
        )}
      />
    );
  }

  return (
    <Form.Item name={fieldName} label={label} rules={rules} tooltip={tooltip}>
      <Input.TextArea rows={4} placeholder={placeholder} disabled={disabled} />
    </Form.Item>
  );
};
