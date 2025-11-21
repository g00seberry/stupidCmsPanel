import { Form, DatePicker } from 'antd';
import type React from 'react';
import { getFieldLabel } from '../utils/getFieldLabel';
import { getFormItemRules } from '../utils/getFormItemRules';
import { isFieldDisabled, getFieldTooltip, getFieldPlaceholder, createFieldName } from '../utils/pathFieldUtils';
import type { PropsPathFieldBase } from './PathField.types';
import { PathListField } from './PathListField';

/**
 * Компонент поля типа datetime (дата и время).
 * Поддерживает cardinality: one и many через Form.List.
 */
export const PathDateTimeField: React.FC<PropsPathFieldBase> = ({ path, fieldNamePrefix, readonly }) => {
  const label = getFieldLabel(path);
  const rules = getFormItemRules(path);
  const fieldName = createFieldName(fieldNamePrefix, path.name);
  const disabled = isFieldDisabled(path, readonly);
  const tooltip = getFieldTooltip(path);
  const placeholder = getFieldPlaceholder(path, 'Выберите');

  if (path.cardinality === 'many') {
    return (
      <PathListField
        fieldName={fieldName}
        label={label}
        rules={rules}
        disabled={disabled}
        renderField={() => (
          <DatePicker
            showTime
            style={{ width: '100%' }}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={placeholder}
            disabled={disabled}
          />
        )}
        renderAddField={add => (
          <DatePicker
            showTime
            style={{ width: '100%' }}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={getFieldPlaceholder(path, 'Добавить')}
            onChange={() => add()}
          />
        )}
      />
    );
  }

  return (
    <Form.Item name={fieldName} label={label} rules={rules} tooltip={tooltip}>
      <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" placeholder={placeholder} disabled={disabled} />
    </Form.Item>
  );
};

