import { Form, InputNumber } from 'antd';
import type React from 'react';
import { getFieldLabel } from '../utils/getFieldLabel';
import { getFormItemRules } from '../utils/getFormItemRules';
import { isFieldDisabled, getFieldTooltip, getFieldPlaceholder, createFieldName } from '../utils/pathFieldUtils';
import type { PropsPathFieldBase } from './PathField.types';
import { PathListField } from './PathListField';

/**
 * Компонент поля типа int (целое число).
 * Поддерживает cardinality: one и many через Form.List.
 */
export const PathIntField: React.FC<PropsPathFieldBase> = ({ path, fieldNamePrefix, readonly }) => {
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
          <InputNumber style={{ width: '100%' }} step={1} placeholder={placeholder} disabled={disabled} />
        )}
        renderAddField={add => (
          <InputNumber
            style={{ width: '100%' }}
            step={1}
            placeholder={getFieldPlaceholder(path, 'Добавить')}
            onPressEnter={e => {
              e.preventDefault();
              add();
            }}
          />
        )}
      />
    );
  }

  return (
    <Form.Item name={fieldName} label={label} rules={rules} tooltip={tooltip}>
      <InputNumber style={{ width: '100%' }} step={1} placeholder={placeholder} disabled={disabled} />
    </Form.Item>
  );
};

